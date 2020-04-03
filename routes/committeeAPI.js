var express = require('express');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/dashboard',(req,res)=>res.render('committeeDashboard',{title:'Express'}));

router.get('/review',(req,res)=>res.render('committeeReview',{title:"Express"}));

router.post('/committeeregistered',function(req,res){
    var keylist="abcdefghijklmnopqrstuvwxyz123456789"
    var thepassword = ''
    var theName = req.body.name;
    var theEmail = req.body.email;
    console.log(theName);
    for (var i =0;i<8;i++)
        thepassword += keylist.charAt(Math.floor(Math.random()*keylist.length));

    committeeModel.findOne({
        name : theName,
        email: theEmail
    },function(err,data){
        if(data == null ){
            var committeeregistered = new   committeeModel({
                name :theName,                        /*委員名稱*/
                email:theEmail,                       /*委員email*/
                password:thepassword,                 /*委員密碼*/
                needtestform:{
                    formOid : req.body.formOid,            /*表單OID*/
                    TeacherNum : req.body.TeacherNum,       /*職員編號*/
                    isPass: false,                          /*委員是否送出*/
                    submitDate : req.body.submitDate,       /*開始日期*/
                    deadLine : req.body.deadLine,           /*結束日期*/
                    paperType : req.body.paperType,         /*研究類型*/
                    paperTheme : req.body.paperTheme,       /*研究主題*/
                    fromType : req.body.fromType            /*填寫表單的樣式(0,1)型態是numbernumber*/
                }
            
            })
            committeeregistered.save(function(err,data){
                if (err)
                res.json({ "status": 1, "msg": "Error" });
            else
                res.json({ "status": 0, "msg": "success","name":theName,"email":theEmail,"password":thepassword});

            });
        }
        else{
            theName = data.name;
            theEmail = data.email;
            thepassword = data.password;
            committeeModel.updateOne({_id:data._id},{
                $push:{
                    needtestform:{
                        formOid : req.body.formOid,            /*表單OID*/
                        TeacherNum : req.body.TeacherNum,       /*職員編號*/
                        isPass: false,                          /*委員是否送出*/
                        submitDate : req.body.submitDate,       /*開始日期*/
                        deadLine : req.body.deadLine,           /*結束日期*/
                        paperType : req.body.paperType,         /*研究類型*/
                        paperTheme : req.body.paperTheme,       /*研究主題*/
                        fromType : req.body.fromType            /*填寫表單的樣式(0,1)*/    
                    }
                }
            },function(err,ndata){
                if (err)
                    res.json({ "status": 1, "msg": "Error" });
                else
                    res.json({ "status": 0, "msg": "success","name":theName,"email":theEmail,"password":thepassword});
            })
        }
    })
})

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
