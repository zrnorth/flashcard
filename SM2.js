// SM2 is explained here: https://www.supermemo.com/english/ol/sm2.htm
exports.getUpdatedDifficulty = function(oldDifficulty, responseQuality) {
	// Given the old difficulty rating and a new response with a quality 0-5,
	// calculate the new difficulty rating for the card
	return 2.1;
}

exports.getDaysUntilNextReview = function(reps, difficulty) {
	// if I(reps) == interval until next review,
	// I(0) == 0
	// I(1) == 1
	// I(2) == 6
	// n>2: I(n) == I(n-1) * difficulty.

	if (reps < 0) {
		throw 'Number of reps must be positive';
	}
	if (difficulty < 1.3 || difficulty > 2.5) {
		throw 'Difficulty rating must be between [1.3, 2.5]';
	}
	
	switch(reps) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 6;
		default: // reps > 2
			return Math.ceil(this.getDaysUntilNextReview((reps - 1), difficulty) * difficulty);
	}
}