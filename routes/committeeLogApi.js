var express = require('express');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/dashboard',(req,res)=>res.render('committeeDashboard',{title:'Express'}));

router.get('/review',(req,res)=>res.render('committeeReview',{title:"Express"}));



router.post('/',function(req,res){
    /*var ncommittee = new committeeModel({
        email :"123",
        password:"123",
        needtestform:[{
            formOid : "5e7de5d5f7bf39164440937f",
            TeacherNum : 1324654,
            isPass: false,
            submitDate : "2020-04-01",
            deadLine : "2020-04-15",
            paperType : "String",
            paperTheme : "test",
            fromType : 2
        },{
            formOid : "5e7de5d5f7bf39164440937f",
            TeacherNum : 1324654,
            isPass: true,
            submitDate : "2020-04-01",
            deadLine : "2020-04-15",
            paperType : "String",
            paperTheme : "test",
            fromType : 1
        }]
        });
    ncommittee.save(function(err,data){});*/
    console.log (req.body.email+"----"+req.body.code);
    committeeModel.findOne({
        email: req.body.email,
        password : req.body.code
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

router.post('/dashboard',function(req,res){
   
    committeeModel.findOne({
        email: req.body.email,
        password : req.body.code
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
