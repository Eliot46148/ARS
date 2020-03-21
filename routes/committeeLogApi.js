var express = require('express');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/review',(req,res)=>res.render('committeeReview',{title:"Express"}));

router.post('/',function(req,res){
    committeeModel.findOne({email:req.body.email,code : req.body.code},function (err, data) {
          res.send(data);
      });
});

module.exports = router;
