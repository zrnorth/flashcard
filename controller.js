const db = require('./postgres.js');

exports.newCard = function(front, back) {
	return db.addCard(front, back, 2.5).then(function(data) {
		return data.id;
	});
}

exports.logReview = function(id, response_quality) {
	// get the card's easiness factor and modify it based on the response quality.
	// calculate the next review interval and save it to the db with reps / next review date
}

exports.getTodaysCards = function() {
	return db.getTodaysCards();
}