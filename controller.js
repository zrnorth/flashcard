const db = require('./postgres.js');
const SM2 = require('./SM2.js');

// Helper to add days correctly to a js Date object (https://stackoverflow.com/a/563442)
Date.prototype.addDays = function(days) {
	var d = new Date(this.valueOf())
	d.setDate(d.getDate() + days);
	return d;
}

exports.newCard = function(front, back) {
	return db.addCard(front, back, 2.5).then(function(data) {
		return data.id;
	});
}

exports.logReview = function(id, responseQuality) {
	db.getCard(id).then(function(card) {
		var difficulty = SM2.getUpdatedDifficulty(card.difficulty, responseQuality);

		var today = new Date();
		var nextReviewDate = today.addDays(SM2.getDaysUntilNextReview(card.reps, difficulty));

		db.updateCard(id, difficulty, nextReviewDate, card.reps + 1);
	});
}

exports.getTodaysCards = function() {
	return db.getTodaysCards();
}