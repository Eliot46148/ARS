var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/userModel');
const saltRounds = 10;

default_user = { "account": "admin", "password": "admin12345"};

bcrypt.hash(default_user.password, saltRounds).then(function (hashPass) {
    var newUser = new userModel({
        account: default_user.account,
        password: hashPass
    });
    userModel.count({ account: default_user.account }, function (err, data) {
        if (data == 0) {
            newUser.save(function (err, data) {
                if (!err)
                    console.log("success");
            });
        }
    })
  });

router.post('/login', function (req, res) {
    userModel.findOne({
        account: req.body.account,
    }, function (err, data) {
        if (data == null || err)
            res.json({ "status": 1, "msg": "Error" });
        else {
            bcrypt.compare(req.body.password, data.password).then(function (respond) {
                if (respond){
                    res.json({ "status": 0, "msg": "success", "account": req.body.account });
                }else{
                    res.json({ "status": 1, "msg": "Error" });
                }
            });
        }
    })
});

router.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds).then(function (hashPass) {
        var newUser = new userModel({
            account: req.body.account,
            password: hashPass
        });
        userModel.count({ account: req.body.account }, function (err, data) {
            if (data > 0)
                res.json({ "status": 0, "msg": "帳號已被註冊" });
            else {
                newUser.save(function (err, data) {
                    if (err)
                        res.json({ "status": 1, "msg": "Error" });
                    else
                        res.json({ "status": 0, "msg": "success", "data": data });
                });
            }
        })
      });
})

router.post('/test', function (req, res) {
    res.send("test");
});

module.exports = router;