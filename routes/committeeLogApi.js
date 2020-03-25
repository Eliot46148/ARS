var express = require('express');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/review',(req,res)=>res.render('committeeReview',{title:"Express"}));



router.post('/',function(req,res){
    /*var ncommittee = new committeeModel({
        email :"test@ntut",
        code:"1234",
        formOid:"asdf"
    });
    ncommittee.save(function(err,data){});*/
    console.log (req.body.email+"----"+req.body.code);
    committeeModel.findOne({
        email: req.body.email,
        code : req.body.code
    },function (err, data) {
        console.log("data :  "+ data);
        if (data == null)
            res.json({ "status": 0, "msg": "email 與 代號 匹配錯誤!" });
        else {
            if (err)
                res.json({ "status": 1, "msg": "Error" });
            else {
                res.json({ "status": 2, "msg": "success", "data": data });
            }
        }
      });
});

module.exports = router;
