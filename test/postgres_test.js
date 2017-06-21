const db = require('../postgres.js');

/*
db.updateCard(7, 1.2, new Date(), 1).then(function() {
    console.log('done');
    db.closeConnection();
}); */

db.getTodaysCards().then(function(cards) {
    console.log(cards);
});

db.resetForgottenCard(2);