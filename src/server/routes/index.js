var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.get('/test', function (req, res, next) {
  res.render('reactTesting/test');
});

router.get('/test2', function (req, res, next) {
  res.render('reactTesting/test2', { testInfo: 'blah this is a test' });
});


router.get('/testReactStrap', function (req, res, next) {
  res.render('reactTesting/testReactStrap');
});


module.exports = router;
