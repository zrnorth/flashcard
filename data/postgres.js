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

// --- USER operations
exports.createUser = function(username, hashedPassword) {
  return postgres.one('INSERT INTO users (USERNAME, PASSWORD) values ($1, $2) RETURNING ID', [username, hashedPassword])
    .finally(pgp.end());
};

exports.getUserByUsername = function(username) {
  return postgres.one('SELECT * FROM users WHERE USERNAME=$1', [username])
    .finally(pgp.end());
};

exports.deleteUser = function(id) {
  return postgres.none('DELETE FROM users where ID=$1', [id])
    .finally(pgp.end());
};

/*
create table users(
  ID        SERIAL PRIMARY KEY      NOT NULL,
  USERNAME    VARCHAR(200)        NOT NULL UNIQUE,
  PASSWORD    VARCHAR(100)        NOT NULL
);
*/

// ----- CARD operations

// limit and offset are used for pagination, but not required.
// row number is the sequential order of the cards (no gaps)
// the string formatting is funky here, but the $1 $2 method is hard to do with limit / offset and
// i got tired of looking for the clean way to do it :)
exports.getAllCardsForUser = function(userId, limit, offset, orderBy='ID') {
  var sql = 'SELECT ROW_NUMBER() OVER (ORDER BY ' + orderBy + '), * FROM cards WHERE OWNER_ID=' + userId + ' ORDER BY ' + orderBy;
  if (limit !== undefined && offset !== undefined) {
    sql += ' LIMIT ' + limit + ' OFFSET ' + offset;
  }
  return postgres.any(sql)
    .finally(pgp.end());
};

exports.getTotalNumberOfCards = function(userId) {
  return postgres.one('SELECT count(*) AS count FROM cards WHERE OWNER_ID=$1', [userId])
    .finally(pgp.end());
};

exports.getTodaysCards = function(userId) {
  return postgres.any('SELECT * FROM cards WHERE OWNER_ID=$1 AND NEXT_REVIEW <= CURRENT_DATE ORDER BY RANDOM()', [userId])
    .finally(pgp.end());
};

exports.addCard = function(front, back, difficulty, userId) {
  return postgres.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS, OWNER_ID) VALUES($1, $2, $3, $4, 0, $5) RETURNING ID', 
    [front, back, Date.simpleToday(), difficulty, userId])
    .finally(pgp.end());
};

exports.addCards = function(cards, userId) {
  return postgres.tx(function(t) {
    var queries = []
    cards.forEach(function(card) {
      var q = t.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS, OWNER_ID) VALUES ($1, $2, CURRENT_DATE, 2.5, 0, $3) RETURNING ID',
        [card.front, card.back, userId]); // No custom difficulty in bulk adding! Too annoying to do
      queries.push(q);
    });
    return t.batch(queries);
  }).finally(pgp.end());
};

exports.getCard = function(id) {
  return postgres.one('SELECT * FROM cards WHERE ID=$1', [id])
    .finally(pgp.end());
};

exports.getCards = function(idsArray) {
  return postgres.any('SELECT * FROM cards WHERE ID = ANY ($1)', [idsArray])
    .finally(pgp.end());
}

exports.getCardByFront = function(front) {
  return postgres.any('SELECT * FROM cards where FRONT=$1', [front])
    .finally(pgp.end());
};

exports.updateCard = function(id, front, back, next_review, difficulty, reps) {
  return postgres.one('UPDATE cards SET FRONT=$1, BACK=$2, NEXT_REVIEW=$3, DIFFICULTY=$4, REPS=$5 WHERE ID=$6 RETURNING NEXT_REVIEW',
    [front, back, next_review, difficulty, reps, id])
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
};

exports.deleteAllForUser = function(userId) {
  return postgres.none('DELETE FROM cards WHERE OWNER_ID=$1', userId)
    .finally(pgp.end());
};
/*
create table cards(
  ID        SERIAL PRIMARY KEY      NOT NULL,
  FRONT       TEXT            NOT NULL,
  BACK      TEXT            NOT NULL,
  NEXT_REVIEW   DATE            NOT NULL,
  DIFFICULTY    REAL            NOT NULL,
  REPS      INT             NOT NULL,
  OWNER_ID    INT REFERENCES users(ID)  ON DELETE CASCADE NOT NULL,
  UNIQUE(FRONT, BACK)
); */

// ----- KANJI_LOOKUP operations

exports.getKanjiData = function(kanji) {
  return postgres.one('SELECT * FROM kanji_lookup WHERE KANJI=$1', [kanji])
    .finally(pgp.end());
};

exports.getKanjiDataFromArray = function(kanjiArray) {
  return postgres.any('SELECT * FROM kanji_lookup WHERE KANJI = ANY ($1)', [kanjiArray])
    .finally(pgp.end());
}

/*
create table kanji_lookup(
    KLC_INDEX       INT PRIMARY KEY             NOT NULL,
    KANJI           TEXT                        NOT NULL,
    HEISIG          TEXT                        NOT NULL,
    ENGLISH         TEXT
);
*/