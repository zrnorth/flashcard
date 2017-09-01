var dataController = require('../data/dataController');
var loginController = require('../data/loginController');
var validator = require('validator');
var kanjiHelper = require('../helpers/kanjiHelpers.js');
require('../helpers/dateHelpers.js');

// constant vals go here
const defaultCardsPerPage = 200;
const maxCardsPerPage = 10000;
const validColumnsToOrderBy = ['ID', 'front', 'back', 'next_review', 'difficulty', 'reps'];

// Helper to render failed pages
var failWithError = function(res, pageName, error) {
  res.render(pageName, {
    error: error
  });
}

// Helper to unescape cards' text when received back from datacontroller
var unescapedCards = function(cards) {
  for (var i = 0; i < cards.length; i++) {
    cards[i].front = validator.unescape(cards[i].front);
    cards[i].back = validator.unescape(cards[i].back);
  }
  return cards;
}

// Helper to replace any kanji in a card's string with an <a> link to its jisho page.
var linkKanjiToCards = function(cards) {
  for (var i = 0; i < cards.length; i++) {
    cards[i].front = kanjiHelper.linkAllKanjiInString(cards[i].front);
    cards[i].back = kanjiHelper.linkAllKanjiInString(cards[i].back);
  }
  return cards;
}

// Helper to get cards ready for display.
var processCards = function(cards) {
  return linkKanjiToCards(unescapedCards(cards));
}

// Load the reviews page
exports.review = function(req, res) {
  dataController.getTodaysCards(req.session.user).then(function(cards) {

    res.render('reviewPage', { 
      cards: processCards(cards),
      dryRun: false
    });
  });
}

// Render the custom review start page
exports.customReview_GET = function(req, res) {
  res.render('customReviewPage');
}

// Start a custom review -- basically just the reviews page in dry run mode with specified cards.
exports.customReview_POST = function(req, res) {
  // for now we just doing id, descending so we get the latest ones
  dataController.getAllCardsForUser(req.session.user, parseInt(req.body.numReviews), 0, 'ID DESC').then(function(cards) {
    res.render('reviewPage', {
      cards: processCards(cards),
      dryRun: true
    });
  })
}

// handles the POST to get the data blob for a kanji string
exports.getKanjiData = function(req, res) {
  dataController.getDataForAllKanjiInString(req.body.kanjiString).then(
    function(data) {
      res.status(200).send({
        kanjiData: data
      });
    }, 
    function(err) {
      // You can get an error if you just passed in a string with no kanji.
      // Should fix this. For now just don't do anything.
      res.status(200).send({
        kanjiData: []
      });
    }
  );
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



exports.updateCardSide = function(req, res) {
  // Update the header to not cache anything
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);

  dataController.updateCardSide(req.body.id, req.body.sideToUpdate, req.body.newString).then(function(card) {
    res.status(200).send(card);
  }, function(err) {
    console.log(err);
    res.sendStatus(500);
  });
}

// Get the form for creating a card
exports.createCards_GET = function(req, res) {
  res.render('createCardsPage');
}

// submit the card creation request
exports.createCards_POST = function(req, res) {
  // Validate the input before passing it in
  var fronts = req.body.front;
  var backs = req.body.back;
  if (!fronts || !backs) {
    failWithError(res, 'createCardsPage', 'Input a card before hitting submit.');
    return;
  }
  // If there is only 1 card being input, it doesn't make it an array.
  if (!(fronts instanceof Array)) {
    fronts = [ fronts ];
  }
  if (!(backs instanceof Array)) {
    backs = [ backs ];
  }

  var cards = [];
  for (var i = 0; i < fronts.length; i++) {
    var front = fronts[i];
    var back = backs[i];

    // If both fields are empty, just skip this one
    if (validator.isEmpty(front) && validator.isEmpty(back)) {
      continue;
    }

    // If one of the two fields is empty, fail with validation error
    else if (validator.isEmpty(front) || validator.isEmpty(back)) {
      failWithError(res, 'createCardsPage', 'You missed a field on one of the cards.');
      return;
    }

    // trim and escape the fields
    front = validator.escape(front);
    front = validator.trim(front);
    back = validator.escape(back);
    back = validator.trim(back);

    // Now that we are validated, save our card object.
    cards.push({
      front: front,
      back: back
    });
  }

  dataController.newCards(cards, req.session.user)
    .then(function(ids) {
      res.render('createCardsPage', {
        numNewCards: ids.length
      });
    })
    .catch(function(err) {
      failWithError(res, 'createCardsPage', err);
    });
}

// List all the cards
exports.listCards = function(req, res) {
  // Validate that we are ordering by a valid column.
  var orderBy = req.params.orderBy;
  if (!orderBy || !validColumnsToOrderBy.includes(orderBy)) {
    res.sendStatus('404');
    return;
  }

  var cardsPerPage, offset;
  if (req.params.page === 'showAll') {
    cardsPerPage = maxCardsPerPage;
    offset = 0;
  }
  else {
    cardsPerPage = defaultCardsPerPage;
    offset = parseInt(req.params.page) * defaultCardsPerPage;
  }

  dataController.getAllCardsForUser(req.session.user, cardsPerPage, offset, orderBy).then(function(cards) {
    dataController.getTotalNumberOfCards(req.session.user).then(function(totalCards) {
      if (offset > totalCards) {
        res.sendStatus('404');
        return;
      }
      var totalPagesNeeded = Math.ceil(totalCards / cardsPerPage);
      res.render('listCardsPage', {
        cards: unescapedCards(cards),
        totalCards: totalCards,
        offset: offset,
        orderedBy: orderBy,
        pages: totalPagesNeeded,
        currentPage: req.params.page
      });
    });
  });  
}

// Delete a card by id
exports.deleteCard = function(req, res) {
  dataController.deleteCard(req.body.id).then(function() {
    res.sendStatus(200);
  }, function() {
    res.sendStatus(500);
  });
}

exports.login_GET = function(req, res) {
  res.render('loginPage');
}

exports.login_POST = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    failWithError(res, 'loginPage', 'Not all form elements were filled.');
    return;
  }
  loginController.login(username, password).then(function(userId) {
    // If success, regenerate the session with the userid
    req.session.regenerate(function() {
      req.session.user = userId;
      res.redirect('/review');
    });
  }, function(err) {
    // If failure, stay on the page with error listed
    failWithError(res, 'loginPage', err);
    return;
  });
}

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect(302, '/login');
  });  
}

exports.register_GET = function(req, res) {
  res.render('registerPage');
}

exports.register_POST = function(req, res) {
  var username = req.body.username;
  var password1 = req.body.password;
  var password2 = req.body.password2;

  if (!username || !password1 || !password2) {
    failWithError(res, 'registerPage', 'Not all form elements were filled.');
    return;
  }

  if (password1 !== password2) {
    failWithError(res, 'registerPage', 'Passwords didn\'t match.');
    return;
  }

  // Create a new user with the given information
  loginController.createUser(username, password1).then(function(id) {
    if (!id) {
      failWithError(res, 'registerPage', 'Username is already taken');
      return;
    }
    // else we good, so send em to the login page
    res.redirect('/login');
  });
}

// Blocks access to any page that requires a login session.
exports.restrict = function(req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    res.render('loginPage', {
      error: 'Access denied'
    });
  }
}