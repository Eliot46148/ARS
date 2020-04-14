var express = require('express');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/dashboard',(req,res)=>res.render('committeeDashboard',{title:'Express'}));

router.get('/review',(req,res)=>res.render('committeeReview',{title:"Express"}));

router.get('/reviewT1',(req,res)=>res.render('ReviewForm/committeeReviewT1',{title:"Express"}));

router.get('/reviewT2',(req,res)=>res.render('ReviewForm/committeeReviewT2',{title:"Express"}));

router.post('/committeeregistered',function(req,res){
    var keylist="abcdefghijklmnopqrstuvwxyz123456789"
    var thepassword = ''
    var theName = req.body.name;
    var theEmail = req.body.email;
    console.log(theName);
    for (var i =0;i<8;i++)
        thepassword += keylist.charAt(Math.floor(Math.random()*keylist.length));
    if(theEmail == ""||theName ==""||req.body.fromType==0||req.body.paperTheme==""||req.body.formOid =="" ||req.body.submitDate==""||req.body.deadLine==""||req.body.paperType=="")
        {
            console.log(theEmail+"-"+theName+"-"+req.body.fromType+"-"+req.body.paperTheme+"-"+req.body.formOid+"-"+req.body.submitDate+"-"+req.body.deadLine+"-"+req.body.paperType);
            res.json({ "status": 1, "msg": "Error" });
        }
    else{
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
    
    }
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

router.post('/getFormExam',function(req,res){
    if (typeof req.body.formId != 'undefined'){
        committeeModel.find({},
        function (err, committee) {
            if (err)
                res.json({ "status": 1, "msg": "Error" });
            else {
                var exams = [];
                for (var i=0; i<committee.length; i++){
                    var forms = committee[i].needtestform;
                    for (var j=0; j<forms.length; j++)
                        if (forms[j].formOid == req.body.formId){
                            var form = JSON.parse(JSON.stringify(forms[j]));
                            form.name = committee[i].name;
                            form.email = committee[i].email;
                            exams.push(form);
                        }
                }
                res.json({"status":0, "msg": "success", "data":exams});
            }
          });
    }
    else
        res.json({ "status": 1, "msg": "given form id is empty." });
});

router.post('/committeeupdate',function(req,res){
    committeeModel.findOne({
        email: req.body.email,
        password : req.body.password
    },
    function (err, data) {
        var forms = JSON.parse(JSON.stringify(data.needtestform));
        console.log("--"+req.body.reMarketassessment)
        forms[req.body.index].isPass = req.body.ispass;
        forms[req.body.index].StudyandData = req.body.StudyandData;
        forms[req.body.index].Marketassessment = req.body.reMarketassessment;
        forms[req.body.index].ManufacturingEvaluation = req.body.ManufacturingEvaluation;
        forms[req.body.index].FinancialEvaluation = req.body.FinancialEvaluation;
        forms[req.body.index].opinion = req.body.opinion;
        forms[req.body.index].isSubmit = req.body.isSubmit;
        /*
        for(var i=0; i<forms.length;i++){
            forms[i].isPass=false;
            forms[i].fromType = 2;
        }*/
        committeeModel.findOneAndUpdate({
            email: req.body.email,
            password : req.body.password
        }, {'needtestform':forms}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });
    });
})

module.exports = router;
