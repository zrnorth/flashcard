var express = require('express');
var router = express.Router();

var viewController = require('../viewController.js');

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET the cards for today. */
router.get('/todaysCards', viewController.todaysCards);

module.exports = router;