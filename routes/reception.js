var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('reception/reception', { title: 'Express' });
});

router.get('/overview', function(req, res, next) {
  res.render('reception/overview', { title: 'Express' });
});

router.get('/examination', function(req, res, next) {
  res.render('reception/examination', { title: 'Express' });
});

router.get('/data-download', function(req, res, next) {
  res.render('reception/data-download', { title: 'Express' });
});


module.exports = router;
