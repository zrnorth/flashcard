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

/* TEST GET the bootstrap testing page */
router.get('/test', function(req, res, next) {
  res.render('testPage', { 
    title: 'Test Page'
  });
});

module.exports = router;
