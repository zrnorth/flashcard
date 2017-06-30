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

const userId = process.env.npm_config_userId || process.env.USER_ID || null;
if (!userId) {
    console.error('Need a user id to add the cards to. Use --userId=USER_ID');
    return;
}

dataController.newCards(cards, parseInt(userId)).then(function(newCardIds) {
  console.log('Added some new cards with ids ' + newCardIds);
});