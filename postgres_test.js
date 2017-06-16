const pgp = require('pg-promise')()
const db = pgp('postgres://znorth:@localhost:5432/test')

function selectAllRows() {
	db.any('SELECT * FROM cards')
	  .then(function (data) {
	    console.log('DATA:', data)
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	  });
}

function addCard(front, back, difficulty) {
	db.one('INSERT INTO cards(FRONT, BACK, NEXT_REVIEW, DIFFICULTY) VALUES($1, $2, CURRENT_DATE, $3) RETURNING ID', [front, back, difficulty])
	  .then(function(data) {
	  	console.log('inserted card id: ', data.id)
	  })
	  .catch(function(error) {
	  	console.log('Error inserting a row: ', error)
	  });
}

addCard('test', 'test_back', 1.3);
selectAllRows();
pgp.end();

/*
create table cards(
	ID 			SERIAL PRIMARY KEY 		NOT NULL,
	FRONT		TEXT					NOT NULL,
	BACK		TEXT					NOT NULL,
	NEXT_REVIEW	DATE					NOT NULL,
	DIFFICULTY	REAL 					NOT NULL
);
*/