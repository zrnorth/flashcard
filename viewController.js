var dataController = require('./data/dataController');

exports.todaysCards = function(req, res) {
  // Get todays cards from the data controller, then pass them to the view
  dataController.getTodaysCards().then(function(cards) {
    res.render('reviewPage', { 
      title: 'Reviews',
      cards: cards
    });
  })
}