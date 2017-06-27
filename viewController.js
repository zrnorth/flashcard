var dataController = require('./data/dataController');
require('./helpers/dateHelpers.js');

// page names go here
const reviewPageName = 'Review';
const createCardsPageName = 'Create Cards';

exports.todaysCards = function(req, res) {
  // Get todays cards from the data controller, then pass them to the view
  dataController.getTodaysCards().then(function(cards) {
    res.render('reviewPage', { 
      title: reviewPageName,
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

// Get the form for creating a card
exports.createCards_GET = function(req, res) {
  res.render('createCardsPage', {
    title: createCardsPageName
  });
}

// submit the card creation request
exports.createCards_POST = function(req, res) {
  // Check that fields are not empty
  req.checkBody('front', 'Card needs a front').notEmpty();
  req.checkBody('back', 'Card needs a back').notEmpty();

  // Trim and escape the fields
  req.sanitize('front').escape();
  req.sanitize('front').trim();
  req.sanitize('back').escape();
  req.sanitize('back').trim();

  // Run the validators
  var errors = req.validationErrors();

  // If there are errors, pass them back to the page here.
  // Otherwise, send the post and redirect to the card list page.
  if (errors) {
    console.log(errors);
    res.render('createCardsPage', {
      title: createCardsPageName,
      errors: errors
    });
  }
  else {
    const front = req.body.front;
    const back = req.body.back;
    dataController.newCard(front, back).then(function(id) {
      // todo should redirect to the created card in the card list page.
      res.render('createCardsPage', {
        title: createCardsPageName, 
        newCard: {
          front: front,
          back: back,
          id: id
        }
      });
    });
  }
}