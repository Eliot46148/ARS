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
                    StudyandData: -1,
                    Marketassessment : -1,
                    ManufacturingEvaluation : -1,
                    FinancialEvaluation:-1,
                    opinion: "",
                    isSubmit : -1
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
                        fromType : req.body.fromType,            /*填寫表單的樣式(0,1)*/    
                        StudyandData: -1,
                        Marketassessment : -1,
                        ManufacturingEvaluation : -1,
                        FinancialEvaluation:-1,
                        opinion: "",
                        isSubmit : -1
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

    committeeModel.updateOne({
        email : req.body.email,
        password : req.body.password,
        "needtestform.formOid" : req.body.formOid
    },{
        $set:{
            "needtestform.$.isPass" : req.body.ispass,
            "needtestform.$.StudyandData" : req.body.StudyandData,
            "needtestform.$.Marketassessment" : req.body.Marketassessment,
            "needtestform.$.ManufacturingEvaluation" : req.body.ManufacturingEvaluation,
            "needtestform.$.FinancialEvaluation" : req.body.FinancialEvaluation,
            "needtestform.$.opinion" : req.body.opinion,
            "needtestform.$.isSubmit" : req.body.isSubmit,
        }
    },function(err,data){
        if (err)
            res.json({ "status": 1, "msg": "Error" });
        else {
            res.json({ "status": 2, "msg": "success"});
        }

    })

})

module.exports = router;
