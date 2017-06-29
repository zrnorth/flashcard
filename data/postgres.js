const fs = require('fs');
require('../helpers/dateHelpers.js');

// Set bluebird as the default promise library for pgp.
const promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});

var databaseUrl;
switch (process.env.NODE_ENV) {
    case 'DEV':
    case 'DEVELOPMENT': {
        pgp.pg.defaults.ssl = false;
        // Change this to your local postgres information.
        databaseUrl = 'postgres://znorth:@localhost:5432/test';
        break;
    }

    case 'PROD':
    case 'PRODUCTION': {
        pgp.pg.defaults.ssl = true;
        databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            console.error('You are trying to run against the production db, but haven\'t set up the db url through heroku yet.');
            console.error('You can run this:');
            console.error('export DATABASE_URL=$(heroku config:get DATABASE_URL -a zrnorth-flashcards)');
            console.error('to set it.');
        }
        break;
    }
    default: {
        console.error('You need to set NODE_ENV before starting this. Run');
        console.error('export NODE_ENV=DEV | PROD');
        console.error('to choose which db to run against.')
        return;
    }
}

// Setup the connection to postgres
const postgres = pgp(databaseUrl);

// limit and offset are used for pagination, but not required.
// row number is the sequential order of the cards (no gaps)
exports.getAllCards = function(limit, offset) {
    var sql = 'SELECT ROW_NUMBER() OVER (ORDER BY ID), * FROM cards ORDER BY ID';
    if (limit !== undefined && offset !== undefined) {
        sql += ' LIMIT ' + limit + ' OFFSET ' + offset;
    }
    return postgres.any(sql)
        .finally(pgp.end());
}

exports.getTotalNumberOfCards = function() {
    return postgres.one('SELECT count(*) AS count FROM cards')
        .finally(pgp.end());
}

exports.getTodaysCards = function() {
    return postgres.any('SELECT * FROM cards WHERE NEXT_REVIEW <= CURRENT_DATE ORDER BY RANDOM()')
        .finally(pgp.end());
};

exports.addCard = function(front, back, difficulty) {
    return postgres.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS) VALUES($1, $2, $3, $4, 0) RETURNING ID', 
      [front, back, Date.simpleToday(), difficulty])
        .finally(pgp.end());
};

exports.addCards = function(cards) {
    return postgres.tx(function(t) {
        var queries = []
        cards.forEach(function(card) {
            var q = t.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS) VALUES ($1, $2, CURRENT_DATE, 2.5, 0) RETURNING ID',
                [card.front, card.back]); // No custom difficulty in bulk adding! Too annoying to do
            queries.push(q);
        });
        return t.batch(queries);
    }).finally(pgp.end());
}

exports.getCard = function(id) {
    return postgres.one('SELECT * FROM cards WHERE ID=$1', [id])
        .finally(pgp.end());
};

exports.getCardByFront = function(front) {
    return postgres.any('SELECT * FROM cards where FRONT=$1', [front])
        .finally(pgp.end());
}

exports.updateCard = function(id, difficulty, review_date, reps) {
    return postgres.one('UPDATE cards SET DIFFICULTY=$1, NEXT_REVIEW=$2, REPS=$3 WHERE ID=$4 RETURNING NEXT_REVIEW', [difficulty, review_date, reps, id])
        .finally(pgp.end());
};

exports.resetForgottenCard = function(id) {
    return postgres.one('UPDATE cards SET REPS=0, NEXT_REVIEW = CURRENT_DATE where ID=$1 RETURNING NEXT_REVIEW', [id])
        .finally(pgp.end());
};

exports.deleteCard = function(id) {
    return postgres.none('DELETE FROM cards WHERE ID=$1', [id])
        .finally(pgp.end());
};

exports.deleteAll = function() {
    return postgres.none('DELETE FROM cards WHERE ID>0')
        .finally(pgp.end());
}
/*
create table cards(
    ID              SERIAL PRIMARY KEY      NOT NULL,
    FRONT           TEXT                    NOT NULL,
    BACK            TEXT                    NOT NULL,
    NEXT_REVIEW     DATE                    NOT NULL,
    DIFFICULTY      REAL                    NOT NULL,
    REPS            INT                     NOT NULL
);
*/