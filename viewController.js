var dataController = require('./data/dataController');
var loginController = require('./data/loginController');
var validator = require('validator');
require('./helpers/dateHelpers.js');

// page names go here
const reviewPageName = 'Review';
const createCardsPageName = 'Create Cards';
const listCardsPageName = 'List Cards';
const registerPageName = 'Register';
const loginPageName = 'Login';

// constant vals go here
const maxCardsPerPage = 30;

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
  // helper to fail quickly and not continue through the function.
  var failWithError = function(error) {
    res.render('createCardsPage', {
      title: createCardsPageName,
      error: error
    });
  }

  // Validate the input before passing it in
  var fronts = req.body.front;
  var backs = req.body.back;
  if (!fronts || !backs) {
    failWithError('Input a card before hitting submit.');
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

    //Check that fields are not empty
    if (validator.isEmpty(front) || validator.isEmpty(back)) {
      failWithError('You missed a field on one of the cards.');
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

  dataController.newCards(cards).then(function(ids) {
    console.log(ids);
    // todo should redirect to the created card in the card list page.
    res.render('createCardsPage', {
      title: createCardsPageName, 
      numNewCards: ids.length
    });
  });
}

// List all the cards
exports.listCards = function(req, res) {
  var offset = req.params.page * maxCardsPerPage;
  dataController.getAllCards(maxCardsPerPage, offset).then(function(cards) {
    dataController.getTotalNumberOfCards().then(function(totalCards) {
      if (offset > totalCards) {
        res.sendStatus('404');
        return;
      }
      var totalPagesNeeded = Math.ceil(totalCards / maxCardsPerPage);
      res.render('listCardsPage', {
        title: listCardsPageName,
        cards: cards,
        totalCards: totalCards,
        offset: offset,
        pages: totalPagesNeeded,
        currentPage: parseInt(req.params.page)
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

  res.render('loginPage', {
    title: loginPageName
  });
}

exports.login_POST = function(req, res) {
  // Helper to fail the form POST 
  var failWithError = function(error) {
    res.render('loginPage', {
      title: loginPageName,
      error: error
    });
  }

  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    failWithError('Not all form elements were filled.');
    return;
  }
  loginController.login(username, password).then(function(id) {
    // temp
    failWithError('login was successful!: ' + id);
    return;
  }).catch(function(error) {
    failWithError(error);
    return;
  });
}

exports.register_GET = function(req, res) {
  res.render('registerPage', {
    title: registerPageName
  });
}

exports.register_POST = function(req, res) {
  // Helper to fail the form POST 
  var failWithError = function(error) {
    res.render('registerPage', {
      title: registerPageName,
      error: error
    });
  }

  var username = req.body.username;
  var password1 = req.body.password;
  var password2 = req.body.password2;

  if (!username || !password1 || !password2) {
    failWithError('Not all form elements were filled.');
    return;
  }

  if (password1 !== password2) {
    failWithError('Passwords didn\'t match.');
    return;
  }

  // Create a new user with the given information
  loginController.createUser(username, password1).then(function(id) {
    if (!id) {
      failWithError('Username is already taken');
      return;
    }
    res.render('loginPage', {
      title: loginPageName
    });
  });
}