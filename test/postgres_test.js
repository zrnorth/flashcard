const db = require('../helpers/postgres.js');

/*
db.updateCard(7, 1.2, new Date(), 1).then(function() {
    console.log('done');
    db.closeConnection();
}); */

var cards = [
    {
        front: 'test1',
        back: 'test1'
    },
    {
        front: 'test2',
        back: 'test2'
    },
    {
        front: 'test3',
        back: 'test3'
    }
];

db.addCards(cards).then(function(data) {
    console.log('data: ' + JSON.stringify(data));
});