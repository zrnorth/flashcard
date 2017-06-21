// Set bluebird as the default promise library for pgp.
const promise = require('bluebird');
const options = {
	promiseLib: promise
}
const pgp = require('pg-promise')(options)

// Setup the connection to postgres
const connection = {
	host: 'localhost',
	port: 5432,
	database: 'test',
	user: 'znorth',
	password: ''
}
const postgres = pgp(connection)

exports.selectAllRowsDebug = function() {
	return postgres.any('SELECT * FROM cards')
		.finally(pgp.end());
}

exports.getTodaysCards = function() {
	return postgres.any('SELECT * FROM cards WHERE NEXT_REVIEW <= CURRENT_DATE')
		.finally(pgp.end());
};

exports.addCard = function(front, back, difficulty) {
	return postgres.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS) VALUES($1, $2, CURRENT_DATE, $3, $4) RETURNING ID', 
      [front, back, difficulty, 0])
		.finally(pgp.end());
};

exports.getCard = function(id) {
	return postgres.one('SELECT * FROM cards WHERE ID=$1', [id])
		.finally(pgp.end());
};

exports.updateCard = function(id, difficulty, review_date, reps) {
	return postgres.none('UPDATE cards SET DIFFICULTY=$1, NEXT_REVIEW=$2, REPS=$3 WHERE ID=$4', [difficulty, review_date, reps, id])
		.finally(pgp.end());
};

exports.resetForgottenCard = function(id) {
	return postgres.none('UPDATE cards SET REPS=0, NEXT_REVIEW = CURRENT_DATE where ID=$1', [id])
		.finally(pgp.end());
};

exports.deleteCard = function(id) {
	return postgres.none('DELETE FROM cards WHERE ID=$1', [id])
		.finally(pgp.end());
};

/*
create table cards(
	ID 			SERIAL PRIMARY KEY 		NOT NULL,
	FRONT		TEXT					NOT NULL,
	BACK		TEXT					NOT NULL,
	NEXT_REVIEW	DATE					NOT NULL,
	DIFFICULTY	REAL 					NOT NULL,
	REPS		INT 					NOT NULL
);
*/