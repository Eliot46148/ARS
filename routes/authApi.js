var express = require('express');
var router = express.Router();
userModel = require('../models/userModel');

router.post('/login', function (req, res) {
    userModel.findOne({
        account: req.body.account,
        password: req.body.password
    }, function (err, data) {
        if (data == null)
            res.json({ "status": 1, "msg": "帳號密碼錯誤!" });
        else {
            if (err)
                res.json({ "status": 1, "msg": "Error" });
            else {
                res.json({ "status": 1, "msg": "success", "data": data });
            }
        }
    })
});

router.post('/register', function (req, res) {
    var newUser = new userModel({
        account: req.body.account,
        password: req.body.password
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
})

router.post('/test', function (req, res) {
    res.send("test");
});

module.exports = router;