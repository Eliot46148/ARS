var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/userModel');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var router = express.Router();
const saltRounds = 12;

// Set up default root user for server.
default_user = { "username": "admin", "password": "admin12345"};
bcrypt.hash(default_user.password, saltRounds).then(function (hashPass) {
    var newUser = new userModel({
        username: default_user.username,
        password: hashPass
    });
    userModel.count({ username: default_user.username }, function (err, data) {
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
                username: req.body.username,
                password: hashPass
            });
            userModel.count({ username: req.body.username }, function (err, count) {
                if (count > 0)
                    res.status(200).send({ "msg": "帳號已被註冊" });
                else {
                    newUser.save(function (err, data) {
                        if (err)
                            res.status(500).send({ "msg": "Error" });
                        else
                            res.status(200).send({ "msg": "success", "data": data });
                    });
                }
            })
        })
    });
});

// Get current user information
router.get('/', function (req, res) {
    res.status(200).json({ session: req.session });
});

var login = function(username, password) {
    return new Promise((res, rej) => {
        userModel.findOne({
            username: username,
        }, function (err, data) {
            if (data == null || err)
                res(false);
            else {
                bcrypt.compare(password, data.password).then(function (respond) {
                    res(data);
                });
            }
        });
    });
};

router.get('/logout', function(req, res) {
    req.logout();
});

// Passport.js authentication strategy setup

var serializeUser = function (user, done) {
    done(null, user._id);
};

var deserializeUser = function (id, done) {
    userModel.findOne({
        _id: id,
    }, function (err, user) {
        done(err, user);
    });
};

var strategy = new LocalStrategy(
    function(username, password, done) {
        login(username, password).then((data) => {
            if (data)
                return done(null, data);
            else
                return done(err);
        })
    }
);

module.exports.router = router;
module.exports.login = login;
module.exports.strategy = strategy;
module.exports.serializeUser = serializeUser;
module.exports.deserializeUser = deserializeUser;