var express = require('express');
var router = express.Router();

var viewController = require('../viewController.js');

// List of pages + their names to link to on the front page.
const PAGES = [
  {
    name: 'Review',
    url: '/todaysCards'
  },
  {
    name: 'Create Cards',
    url: '/createCards'
  },
];

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Flashcards',
    pages: PAGES
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

module.exports = router;
