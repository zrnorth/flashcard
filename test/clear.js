var dataController = require('../data/dataController.js')

const userId = process.env.npm_config_userId || process.env.USER_ID || null;
if (!userId) {
    console.error('Need a user id to add the cards to. Use --userId=USER_ID');
    return;
}

dataController.deleteAllForUser(userId).then(function() {
  console.log('Cleared all cards in db for user ' + userId);
});