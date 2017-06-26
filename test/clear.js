var dataController = require('../data/dataController.js')

dataController.deleteAll().then(function() {
  console.log('Cleared all cards in db.');
});