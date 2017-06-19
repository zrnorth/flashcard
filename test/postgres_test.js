const db = require('../postgres.js');

// Add postgres calls here

db.updateCard(7, 1.2, new Date(), 1).then(function() {
	console.log('done');
	db.closeConnection();
});