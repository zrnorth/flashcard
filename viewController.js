var dataController = require('./data/dataController');

exports.todaysCards = function(req, res) {
  // Get todays cards from the data controller, then pass them to the view
  
  // temp
  res.render('reviewPage', { 
      title: 'Reviews',
      cards: [
        {
          front: 'card1',
          back: 'card1'
        },
        {
          front: 'card2',
          back: 'card2'
        }
      ]
  });
}