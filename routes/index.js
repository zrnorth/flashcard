var express = require('express');
var router = express.Router();

var viewController = require('../views/viewController.js');

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

// Unrestricted pages

/* GET the login page */
router.get('/login', viewController.login_GET);

/* POST a login attempt */
router.post('/login', viewController.login_POST);

/* GET the register page */
router.get('/register', viewController.register_GET);

/* POST a user registration */
router.post('/register', viewController.register_POST);

/* GET a logout request */
router.get('/logout', viewController.logout);

// Login-restricted pages

/* GET the cards for review for today. */
router.get('/review', viewController.restrict, viewController.review);

/* PUT (Update) a card with a given id. */
router.post('/updateCardSide', viewController.restrict, viewController.updateCardSide);

/* POST a review for a given card */
router.post('/logReview', viewController.restrict, viewController.logReview);

/* POST a kanji string, returning a kanji data blob for the string */
router.post('/getKanjiData', viewController.restrict, viewController.getKanjiData);

/* GET the create card page */
router.get('/createCards', viewController.restrict, viewController.createCards_GET);

/* POST a new card */
router.post('/createCards', viewController.restrict, viewController.createCards_POST);

/* GET the list of all cards */
router.get('/listCards', viewController.restrict, function(req, res) {
  res.redirect('/listCards/ID/0');
});

/* GET the list of all cards at a specific page with a given ordering */
router.get('/listCards/:orderBy/:page', viewController.restrict, viewController.listCards);

/* GET the custom review page */
router.get('/customReview', viewController.restrict, viewController.customReview_GET);

/* POST to start a custom review */
router.post('/customReview', viewController.restrict, viewController.customReview_POST);

/* DELETE a card by id */
router.delete('/deleteCard', viewController.restrict, viewController.deleteCard);

module.exports = router;