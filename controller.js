const db = require('./postgres.js');
const SM2 = require('./SM2.js');

exports.newCard = function(front, back) {
	return db.addCard(front, back, 2.5).then(function(data) {
		return data.id;
	});
}

exports.logReview = function(id, responseQuality) {
	db.getCard(id).then(function(card) {
		var difficulty = SM2.getUpdatedDifficulty(card.difficulty, responseQuality);
		var nextReviewDate = SM2.getNextReviewDate(card.reps, difficulty);
		var reps = card.reps + 1;
		db.updateCard(id, difficulty, nextReviewDate, reps);
	});
}

exports.getTodaysCards = function() {
	return db.getTodaysCards();
}