var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');

router.post('/create', function (req, res, next) {
  userModel.save(function (err, data) {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "success", "data": data });
  });
});

router.post('/login', function (req, res, next) {
  userModel.findOne({ account: req.body.account, password: req.body.password }, function (err, data) {
    console.log(req.body.account);
      if (err) {
        res.json({ 'status': 1, 'msg': err });
      }
      else {
        res.json({ 'status': 0, 'msg': 'success', 'data': {account:req.body.account} });
      };
  });
});

module.exports = router;
