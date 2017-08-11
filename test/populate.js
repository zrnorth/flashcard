var dataController = require('../data/dataController.js')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const userId = process.env.npm_config_userId || process.env.USER_ID || null;
if (!userId) {
    console.error('Need a user id to add the cards to. Use --userId=USER_ID');
    return;
}

const numCards = process.env.npm_config_numCards || 3;

var cards = [];
for (var i = 0; i < numCards; i++) {
  cards.push({
      front: Math.random().toString(36).substring(2, getRandomInt(7, 30)),
      back: Math.random().toString(36).substring(2, getRandomInt(7, 30))
  });
}

dataController.newCards(cards, parseInt(userId)).then(function(newCardIds) {
  console.log('Added ' + numCards + ' randomized new cards with ids ' + newCardIds);
});