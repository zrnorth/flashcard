var dataController = require('./data/dataController');
require('./helpers/dateHelpers.js');


exports.todaysCards = function(req, res) {
  // Get todays cards from the data controller, then pass them to the view
  dataController.getTodaysCards().then(function(cards) {
    res.render('reviewPage', { 
      title: 'Reviews',
      cards: cards
    });
  })
}

exports.logReview = function(req, res) {
  dataController.logReview(req.body.id, req.body.responseQuality).then(function(nextReview) {
    console.log('Recorded score of ' + req.body.responseQuality + ' for card #' + req.body.id + '.');
    res.status(200).send({
      repeat: (nextReview.getDate() === Date.simpleToday().getDate()) // we need to repeat the card if the next_review date is today.
    });
  }, function(err) { // if some sort of error
    console.log(err);
    res.sendStatus(500);
  });
}