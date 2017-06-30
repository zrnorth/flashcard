var dataController = require('../data/dataController.js')

const userId = process.env.npm_config_userId || process.env.USER_ID || null;
if (!userId) {
    console.error('Need a user id to add the cards to. Use --userId=USER_ID');
    return;
}

const numCards = process.env.npm_config_numCards || 3;

var cards = [];
for (var i = 0; i < numCards; i++) {
    cards.push({
        front: Math.random().toString(36).substring(2, 7),
        back: Math.random().toString(36).substring(2, 7)
    });
}

dataController.newCards(cards, parseInt(userId)).then(function(newCardIds) {
  console.log('Added ' + numCards + ' new cards with ids ' + newCardIds);
});