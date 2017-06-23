var dataController = require('../data/dataController.js')

// Add controller calls here


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

//dataController.newCard('test3', 'test3');
dataController.newCards(cards).then(function(data) {
    console.log(data);
});