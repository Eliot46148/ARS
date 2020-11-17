var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/userModel');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var router = express.Router();
const saltRounds = 12;

// Set up default root user for server.
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

// Create user(register)
router.post('/', function (req, res) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt).then(function (hashPass) {
            var newUser = new userModel({
                account: req.body.account,
                password: hashPass
            });
            userModel.count({ account: req.body.account }, function (err, count) {
                if (count > 0)
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
    });
});

var login = function(account, password) {
    return new Promise((res, rej) => {
        userModel.findOne({
            account: account,
        }, function (err, data) {
            if (data == null || err)
                res(false);
            else {
                bcrypt.compare(password, data.password).then(function (respond) {
                    res(respond);
                });
            }
        });
    });
};

// Login request
router.post('/login', function(req, res){
    var result;
    login(req.body.account, req.body.password).then(function(respond){
       if (respond){
           res.json({ "status": 0, "msg": "success", "account": req.body.account });
       }else
           res.json({ "status": 1, "msg": "Error" });
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Passport.js authentication strategy setup
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    userModel.findOne({
        account: id,
    }, function (err, data) {
        done(err, data);
    });
});

passport.use('login', new LocalStrategy({
        usernameField: 'account',
        passwordField: 'password',
    },
    function(username, password, done) {
        login(username, password).then((respond) => {
            console.log(username, password);
            if (respond)
                done(null, response);
            else
                done(err);
        })
    }
));

module.exports = router;