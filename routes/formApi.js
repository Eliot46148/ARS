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

router.get('/', (req, res, next) => res.render('form', { title: 'Express' }));

router.post('/', function (req, res, next) {
  var newForm = new formModel({
    TeacherNum: req.body.TeacherNum,
    UploadDate: req.body.UploadDate,
    Submitted: false,
    Ended: false
  });
  newForm.save(function (err, data) {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.redirect('/form');
  });
});

router.put('/', function (req, res, next) {
  formModel.update({ TeacherNum: req.body.TeacherNum },
    {
      ResearchTopic: req.body.ResearchTopic,
      HIGHER: req.body.HIGHER,
      Industry: req.body.Industry,
      Industry5n: req.body.Industry5n,
      Name: req.body.Name,
      College: req.body.College,
      Department: req.body.Department,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Description: req.body.Description,
      Evaluation: req.body.Evaluation
    }, function (err, data) {
      if (err)
        res.json({ "status": 1, "msg": "Error", 'data': data });
      else
        res.json({ "status": 0, "msg": "success", 'data': req.body });
    });
});

router.patch('/patent', upload.single('myPatent'), function (req, res, next) {
  formModel.updateOne({ TeacherNum: req.query.TeacherNum },
    {
      $push: {
        Patent: {
          Name: req.query.Name,
          Country: req.query.Country,
          Status: req.query.Status,
          File: req.file.filename
        }
      }
    }, function (err, data) {
      if (err)
        res.json({ "status": 1, "msg": "Error" });
      else {
        res.json({ "status": 0, "msg": "success", 'data': data });
        console.log(req.query.Status);
      }
    });
});

router.patch('/paper', upload.single('myPaper'), function (req, res, next) {
  formModel.updateOne({ TeacherNum: req.query.TeacherNum },
    {
      $push: {
        Paper: {
          Name: req.query.Name,
          Journal: req.query.Journal,
          Status: req.query.Status,
          File: req.file.filename
        }
      }
    }, function (err, data) {
      if (err)
        res.json({ "status": 1, "msg": "Error" });
      else {
        res.json({ "status": 0, "msg": "success", 'data': data });
        console.log(req.query.Status);
      }
    });
});

router.patch('/image', upload.single('myImage'), function (req, res, next) {
  formModel.findOne({ TeacherNum: req.query.TeacherNum }, function (err, data) {
    data.Image = req.file.filename;
    data.markModified('Image');
    data.save(function (err) {
      if (err) {
        res.json({ 'status': 1, 'msg': err });
      }
      else {
        res.json({ 'status': 0, 'msg': 'success', 'data': data });
      }
    });
  });
});

router.post('/image', upload.single('myImage'), function (req, res, next) {
  formModel.findOne({ TeacherNum: req.query.TeacherNum }, function (err, data) {
    data.Image = req.file.filename;
    data.markModified('Image');
    data.save(function (err) {
      if (err) {
        res.json({ 'status': 1, 'msg': err });
      }
      else {
        res.json({ 'status': 0, 'msg': 'success', 'data': data });
      }
    });
  });
});

router.patch('/video', upload.single('myVideo'), function (req, res, next) {
  formModel.findOne({ TeacherNum: req.query.TeacherNum }, function (err, data) {
    data.Video = req.file.filename;
    data.markModified('Image');
    data.save(function (err) {
      if (err) {
        res.json({ 'status': 1, 'msg': err });
      }
      else {
        res.json({ 'status': 0, 'msg': 'success', 'data': data });
      }
    });
  });
});

module.exports = router;