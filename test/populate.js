var dataController = require('../data/dataController.js')

const cards = [
    {
        front: Math.random().toString(36).substring(2, 7),
        back: Math.random().toString(36).substring(2, 7)
    },
    {
        front: Math.random().toString(36).substring(2, 7),
        back: Math.random().toString(36).substring(2, 7)
    },
    {
        front: Math.random().toString(36).substring(2, 7),
        back: Math.random().toString(36).substring(2, 7)
    }
];

dataController.newCards(cards).then(function(newCardIds) {
  console.log('Added some new cards with ids ' + newCardIds);
});