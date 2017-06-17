const pgp = require('pg-promise')()
const postgres = pgp('postgres://znorth:@localhost:5432/test')

exports.selectAllRows = function() {
	postgres.any('SELECT * FROM cards')
	  .then(function (data) {
	    console.log('DATA:', data);
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error);
	  });
};

exports.getTodaysCards = function() {
	postgres.any('SELECT * FROM cards WHERE NEXT_REVIEW = CURRENT_DATE')
	  .then(function(data) {
	  	console.log('Todays cards: ', data);
	  })
	  .catch(function(error) {
	  	console.log('error getting todays cards');
	  });
};

exports.addCard = function(front, back, difficulty) {
	postgres.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY) VALUES($1, $2, CURRENT_DATE, $3) RETURNING ID', [front, back, difficulty])
	  .then(function(data) {
	  	return data.id;
	  })
	  .catch(function(error) {
	  	console.log('Error inserting a row: ', error);
	  });
};

exports.updateCard = function(id, difficulty, review_date) {
	postgres.none('UPDATE cards SET DIFFICULTY=$1, NEXT_REVIEW=$2 WHERE ID=$3', [difficulty, review_date, id])
};

exports.deleteCard = function(id) {
	postgres.none('DELETE FROM cards WHERE ID=$1', [id]);
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
	DIFFICULTY	REAL 					NOT NULL
);
*/