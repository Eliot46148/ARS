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
                    isPass: false,                          /*委員是否送出*/
                    submitDate : req.body.submitDate,       /*開始日期*/
                    deadLine : req.body.deadLine,           /*結束日期*/
                    paperType : req.body.paperType,         /*研究類型*/
                    paperTheme : req.body.paperTheme,       /*研究主題*/
                    fromType : req.body.fromType,            /*填寫表單的樣式(0,1)型態是numbernumber*/
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
        password : req.body.password
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

router.post('/committeeupdate',function(req,res){

})

module.exports = router;
