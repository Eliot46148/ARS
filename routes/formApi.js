var express = require('express');
var router = express.Router();
var multer = require('multer');
formModel = require('../models/formModel');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files');
  },
  filename: function (req, file, cb) {
    var str = file.originalname.split('.');
    cb(null, Date.now() + '.' + str[1]);
  }
});

var upload = multer({ storage: storage });

router.post('/save', function (req, res, next) {
  var newForm = new formModel({
    ResearchTopic: req.body.ResearchTopic,
    HIGHER: req.body.HIGHER,
    Industry: req.body.Industry,
    Industry5n: req.body.Industry5n,
    Name: req.body.Name,
    College: req.body.College,
    Department: req.body.Department,
    TeacherNum: req.body.TeacherNum,
    Phone: req.body.Phone,
    Email: req.body.Email,
    Description: req.body.Description,
    Evaluation: req.body.Evaluation
  });
  newForm.save(function (err, data) {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "success", "data": data });
  });
});

router.post('/patent/save', function (req, res, next) {
  var newForm = new formModel({
    Name: req.body.HIGHER,
    Country: req.body.Country,
    Status: req.body.Status,
    Pdf: req.body.Pdf
  });
  newForm.save(function (err, data) {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "success", "data": data });
  });
});

module.exports = router;