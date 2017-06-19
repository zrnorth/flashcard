var SM2 = require('../SM2.js')
var run = 1;

/* getUpdatedDifficulty test
for (var diff = 1.3; diff <= 2.5; diff += 0.1) {
	for (var qual = 0; qual <= 5; qual++) {
		console.log('run: ' + run);
		run++;
		console.log('old diff: ', diff);
		console.log('resp.quality: ', qual);
		console.log('new diff: ', SM2.getUpdatedDifficulty(diff, qual));
		console.log('---');
	}
}
*/

/* getDaysUntilNextReview test
for (var diff = 1.0; diff < 2.7; diff += 0.2) {
	for (var reps = 0; reps < 20; reps++) {
		console.log('run: ', run);
		run++;
		console.log('diff: ', diff);
		console.log('reps: ', reps);
		console.log('daysUntilNextReview: ');
		try { 
			var days = SM2.getDaysUntilNextReview(reps, diff);
			console.log(days + '\n');
		} catch(e) {
			console.log(e + '\n');
		}
	}
}
*/