var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    res.render('processor/'+req.params.sys+'/download', { title: 'Express' });
});

module.exports = router;