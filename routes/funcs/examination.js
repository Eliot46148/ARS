var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    res.send('this is the baz for foo#' + req.params.number);
});


module.exports = router;