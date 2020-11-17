var express = require('express');
const { where } = require('../models/committeeMode');
var router = express.Router();
var committeeModel = require('../models/committeeMode');

router.get('/', (req, res, next) => res.render('committeeLogin', { title: 'Express' }));

router.get('/dashboard', (req, res) => res.render('committeeDashboard', { title: 'Express' }));

router.get('/review', (req, res) => res.render('committeeReview', { title: "Express" }));

router.get('/reviewForm', (req, res) => res.render('committeeReviewForm', { title: "Express" }));

router.get('/committeeForm', (req, res) => res.render('committeeForm', { title: "Express" }));

router.post('/committeeregistered', function (req, res) {
    var keylist = "abcdefghijklmnopqrstuvwxyz123456789"
    var thepassword = ''
    var theName = req.body.name;
    var theEmail = req.body.email;
    console.log(theName);
    for (var i = 0; i < 8; i++)
        thepassword += keylist.charAt(Math.floor(Math.random() * keylist.length));
    if (theEmail == "" || theName == "" || req.body.formType == 0 || req.body.paperTheme == "" || req.body.formOid == "" || req.body.submitDate == "" || req.body.deadLine == "" || req.body.paperType == "") {
        console.log(theEmail + "-" + theName + "-" + req.body.formType + "-" + req.body.paperTheme + "-" + req.body.formOid + "-" + req.body.submitDate + "-" + req.body.deadLine + "-" + req.body.paperType);
        res.json({ "status": 1, "msg": "Error" });
    }
    else {
        committeeModel.findOne({
            email: theEmail
        }, function (err, data) {
            if (data == null) {
                var committeeregistered = new committeeModel({
                    name: theName,                        /*委員名稱*/
                    email: theEmail,                       /*委員email*/
                    password: thepassword,                 /*委員密碼*/
                    needtestform: {
                        formOid: req.body.formOid,            /*表單OID*/
                        isPass: false,                          /*委員是否送出*/
                        submitDate: req.body.submitDate,       /*開始日期*/
                        deadLine: req.body.deadLine,           /*結束日期*/
                        paperType: req.body.paperType,         /*研究類型*/
                        paperTheme: req.body.paperTheme,       /*研究主題*/
                        formType: req.body.formType,            /*填寫表單的樣式(0,1)型態是numbernumber*/
                        StudyandData: -1,
                        Marketassessment: -1,
                        ManufacturingEvaluation: -1,
                        FinancialEvaluation: -1,
                        opinion: "",
                        isSubmit: -1,
                        finalResult: "-"
                    }

                })
                committeeregistered.save(function (err, data) {
                    if (err)
                        res.json({ "status": 1, "msg": "Error" });
                    else
                        res.json({ "status": 0, "msg": "success", "name": theName, "email": theEmail, "password": thepassword });
                });
            }
            else {
                theEmail = data.email;
                thepassword = data.password;
                committeeModel.updateOne({ _id: data._id }, {
                    $push: {
                        needtestform: {
                            formOid: req.body.formOid,            /*表單OID*/
                            isPass: false,                          /*委員是否送出*/
                            submitDate: req.body.submitDate,       /*開始日期*/
                            deadLine: req.body.deadLine,           /*結束日期*/
                            paperType: req.body.paperType,         /*研究類型*/
                            paperTheme: req.body.paperTheme,       /*研究主題*/
                            formType: req.body.formType,            /*填寫表單的樣式(0,1)*/
                            StudyandData: -1,
                            Marketassessment: -1,
                            ManufacturingEvaluation: -1,
                            FinancialEvaluation: -1,
                            opinion: "",
                            isSubmit: -1,
                            finalResult: "-"
                        }
                    }
                }, function (err, ndata) {
                    if (err)
                        res.json({ "status": 1, "msg": "Error" });
                    else
                        res.json({ "status": 0, "msg": "success", "name": theName, "email": theEmail, "password": thepassword });
                })
            }
        })

    }
})

router.post('/GetID', function (req, res) {
    committeeModel.findById(req.body.Oid, function (err, data) {
        if (err || data == null)
            res.json({ "status": 1, "msg": "Error" });
        else {
            res.json({ "status": 2, "msg": "success", "data": data });
        }
    })
})

router.post('/login', function (req, res) {
    committeeModel.findOne({
        email: req.body.email,
        password: req.body.code
    }, function (err, data) {
        if (data == null) {
            res.json({ "status": 0, "msg": "email 與 代號 匹配錯誤!" });
        }
        else {
            if (err)
                res.json({ "status": 1, "msg": "Error" });
            else {
                res.json({ "status": 2, "msg": "success", "data": data });
            }
        }
    });
});

router.post('/dashboard', function (req, res) {
    committeeModel.findOne({
        email: req.body.email,
        password: req.body.password
    }, function (err, data) {
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

router.post('/getFormExam', function (req, res) {
    if (typeof req.body.formId != 'undefined') {
        committeeModel.find({},
            function (err, committee) {
                if (err)
                    res.json({ "status": 1, "msg": "Error" });
                else {
                    var exams = [];
                    for (var i = 0; i < committee.length; i++) {
                        var forms = committee[i].needtestform;
                        for (var j = 0; j < forms.length; j++)
                            if (req.body.formId == forms[j].formOid || req.body.formId == -1) {
                                var form = JSON.parse(JSON.stringify(forms[j]));
                                form.name = committee[i].name;
                                form.email = committee[i].email;
                                form.password = committee[i].password;
                                exams.push(form);
                            }
                    }
                    res.json({ "status": 0, "msg": "success", "data": exams });
                }
            });
    }
    else
        res.json({ "status": 1, "msg": "given form id is empty." });
});

router.post('/committeeupdate', function (req, res) {



    committeeModel.findOne({
        email: req.body.Email
    },
        function (err, data) {
            console.log(data)
            var forms = JSON.parse(JSON.stringify(data.needtestform));
            if (req.body.delete) {
                if (forms.splice(req.body.index, 1) == [])
                    return res.send(500, { error: err })
                else {
                    committeeModel.findOneAndUpdate({
                        email: req.body.email
                    }, { 'needtestform': forms }, function (err, doc) {
                        if (err) return res.send(500, { error: err });
                        return res.send('Succesfully saved.');
                    });
                }

            } else {
                //if (req.body.password.localeCompare(data.password) == 0 && Date.now() <= new Date(forms[req.body.index].deadLine)) {
                if (Date.now() <= new Date(forms[req.body.index].deadLine)) {
                    forms[req.body.index].respondDate = req.body.respondDate,
                        forms[req.body.index].isPass = req.body.ispass;
                    forms[req.body.index].StudyandData = req.body.studyandData;
                    forms[req.body.index].Marketassessment = req.body.Marketassessment;
                    forms[req.body.index].ManufacturingEvaluation = req.body.ManufacturingEvaluation;
                    forms[req.body.index].FinancialEvaluation = req.body.FinancialEvaluation;
                    forms[req.body.index].opinion = req.body.opinion;
                    forms[req.body.index].isSubmit = req.body.isSubmit;
                    console.log(forms[req.body.index]);
                    committeeModel.findOneAndUpdate({
                        _id: data._id
                    }, { 'needtestform': forms }, function (err, doc) {
                        if (err) return res.send(500, { error: err });
                        return res.send('Succesfully saved.');
                    });
                }
                else
                    return res.send(500, { error: err });
            }
        });
})

router.put('/setFinalResult', function (req, res) {
    committeeModel.find({}, function (err, data) {
        data.forEach(forms => {
            console.log(forms.email)
            var form = JSON.parse(JSON.stringify(forms.needtestform));

            form.forEach(item => {
                if (req.body.FormId == item.formOid && item.finalResult == '-') {
                    item.finalResult = req.body.status == 3 ? "修改" : req.body.status == 4 ? "未獲推薦" : req.body.status == 5 ? "推薦" : '-'
                }
            });
            committeeModel.findOneAndUpdate({
                email: forms.email
            }, { 'needtestform': form }, function (err, doc) {
                if (err) return res.send(500, { error: err });
            });
        });

    })
    res.status(200).send();
})

module.exports = router;
