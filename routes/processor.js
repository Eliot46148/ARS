var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('processor/processor', { title: 'Express' });
});

router.get('/overview', function(req, res, next) {
  res.render('processor/overview', { title: 'Express', sys: req.body.sys });
});

router.get('/:sys/edit', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/edit', { title: 'Express' });
});

router.get('/:sys/examination', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/examination', { title: 'Express' });
});

router.get('/:sys/download', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/download', { title: 'Express' });
});

module.exports = router;