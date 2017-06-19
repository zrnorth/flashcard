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

exports.deleteCard = function(id) {
	return db.deleteCard(id);
}

exports.logReview = function(id, responseQuality) {
	db.getCard(id).then(function(card) {
		// If the review was correct, update the card's correct reps and difficulty in the db.
		if (responseQuality >= 3) {
			var difficulty = SM2.getUpdatedDifficulty(card.difficulty, responseQuality);
			var today = new Date();
			var nextReviewDate = today.addDays(SM2.getDaysUntilNextReview(card.reps, difficulty));

			db.updateCard(id, difficulty, nextReviewDate, card.reps + 1);
		}
		// If it was incorrect, reset the number of reps, leaving the difficulty the same.
		else {
			db.resetForgottenCard(id);
		}
	});
}

exports.getTodaysCards = function() {
	return db.getTodaysCards();
}