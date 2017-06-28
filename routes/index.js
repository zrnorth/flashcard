var express = require('express');
var router = express.Router();

var viewController = require('../viewController.js');

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Flashcards'
  });
});

/* GET the cards for today. */
router.get('/todaysCards', viewController.todaysCards);

/* POST a review for a given card */
router.post('/logReview', viewController.logReview);

/* GET the create card page */
router.get('/createCards', viewController.createCards_GET);

/* POST a new card */
router.post('/createCards', viewController.createCards_POST);

/* GET the list of all cards */
router.get('/listCards', function(req, res) {
  res.redirect('/listCards/0');
});

/* GET the list all cards at a specific page */
router.get('/listCards/:page', viewController.listCards);

/* DELETE a card by id */
router.delete('/deleteCard', viewController.deleteCard);

module.exports = router;
