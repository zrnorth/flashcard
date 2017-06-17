const pgp = require('pg-promise')()
const postgres = pgp('postgres://znorth:@localhost:5432/test')

exports.selectAllRowsDebug = function() {
	return postgres.any('SELECT * FROM cards');
};

exports.getTodaysCards = function() {
	return postgres.any('SELECT * FROM cards WHERE NEXT_REVIEW = CURRENT_DATE');
};

exports.addCard = function(front, back, difficulty) {
	return postgres.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY, REPS) VALUES($1, $2, CURRENT_DATE, $3, $4) RETURNING ID', 
      [front, back, difficulty, 0]);
};

exports.getCard = function(id) {
	return postgres.one('SELECT FROM cards WHERE ID=$1', [id]);
}

exports.updateCard = function(id, difficulty, review_date, reps) {
	return postgres.none('UPDATE cards SET DIFFICULTY=$1, NEXT_REVIEW=$2, REPS=$3 WHERE ID=$4', [difficulty, review_date, reps, id]);
};

exports.deleteCard = function(id) {
	return postgres.none('DELETE FROM cards WHERE ID=$1', [id]);
};

// not required, but good to do if you don't want to wait for 30sec for auto-timeout.
exports.closeConnection = function() {
	pgp.end(); 
}
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