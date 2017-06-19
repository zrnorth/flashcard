var SM2 = require('../SM2.js')
var run = 1;
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