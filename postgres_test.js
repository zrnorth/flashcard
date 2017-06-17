const db = require('./postgres.js');

db.getTodaysCards().then(function(data) {
	console.log(data);
	db.closeConnection();
});