const db = require('./postgres.js');

db.selectAllRows();
db.closeConnection();

exports.newCard = function(front, back) {
	// find the difficulty rating of the new card and then add it to the db. return succ/fail
}

exports.logReview = function(id, response_quality) {
	// get the card's easiness factor and modify it based on the response quality.
	// calculate the next review interval and save it to the db with reps / next review date
}