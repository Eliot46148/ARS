var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const formModel = require('../models/formModel');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    var str = file.originalname.split('.');
    cb(null, Date.now() + '.' + str[1]);
  }
});

var upload = multer({ storage: storage });

router.get('/', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    if (err || data == null || req.query.TeacherNum != data.TeacherNum) {
      res.render('404');
    }
    if (req.query.isProcess == 'process') {
      res.render('form');
    }
    if (data.Status != 0 && data.Status != 3) {
      res.render('blocked');
    }
    res.render('form');
  });
});

router.get('/testest', (req, res) => {
  var committeeModel = require('../models/committeeMode');
  committeeModel.findOne({ email: req.query.email, password: req.query.password }, function (merr, mdata) {
    formModel.findById(mdata.needtestform[req.query.index].formOid, (ferr, fdata) => {
      if (ferr)
        res.json({ "status": 1, "msg": "Error", 'data': fdata });
      else
        res.json({ "status": 0, "msg": "success", 'data': fdata });
    })
  })
})

/** get form data */
router.get('/data', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    if (err)
      res.json({ "status": 1, "msg": "Error", 'data': data });
    else
      res.json({ "status": 0, "msg": "success", 'data': data });
  });
});

router.get('/id', (req, res, next) => {
  formModel.find({}, (err, data) => {
    if (err)
      res.json({ "status": 1, "msg": "Error", 'data': data });
    else {
      var lst = [];
      for (var i = 0; i < data.length; i++)
        lst.push(data[i]._id);
      res.json({ "status": 0, "msg": "success", 'data': lst });
    }
  });
});

router.post('/', function (req, res, next) {
  var newForm = new formModel({
    TeacherNum: req.body.TeacherNum,
    UploadDate: req.body.UploadDate,
    Status: 0
  });
  newForm.save(function (err, data) {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "success", "id": data._id });
  });
});

router.delete('/', function (req, res, next) {
  formModel.deleteOne({ _id: req.body.FormId }, function (err) {
    if (err) {
      res.json({ "status": "1", "msg": "系統發生錯誤" });
    }
    else {
      res.json({ "status": "0", "msg": "刪除成功" });
    }
  })
});

/** save form data */
router.put('/', function (req, res, next) {
  console.log(req);
  formModel.update({ _id: req.query.FormId },
    {
      ResearchTopic: req.body.ResearchTopic,
      HIGHER: req.body.HIGHER,
      HIGHER2: req.body.HIGHER2,
      Industry: req.body.Industry,
      Industry2: req.body.Industry2,
      Industry5n: req.body.Industry5n,
      Name: req.body.Name,
      College: req.body.College,
      Department: req.body.Department,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Description: req.body.Description,
      AppliedField: req.body.AppliedField,
      IndustryEffect: req.body.IndustryEffect,
      IsCommercialization: req.body.IsCommercialization,
      MarketDemand: req.body.MarketDemand,
      Competitiveness: req.body.Competitiveness,
      Cost: req.body.Cost,
      MarketDemandType: req.body.MarketDemandType,
      CompetitivenessType: req.body.CompetitivenessType,
      CostType: req.body.CostType,
      SubmitDate: req.body.SubmitDate,
      ChartData: req.body.ChartData,
      Status: 0
    }, function (err, data) {
      if (err)
        res.json({ "status": 1, "msg": "Error", 'data': data });
      else {
        res.json({ "status": 0, "msg": "success", 'data': req.body });
      }
    });
});

// submit form data
router.put('/submit', function (req, res, next) {
  formModel.update({ _id: req.query.FormId },
    {
      ResearchTopic: req.body.ResearchTopic,
      HIGHER: req.body.HIGHER,
      HIGHER2: req.body.HIGHER2,
      Industry: req.body.Industry,
      Industry2: req.body.Industry2,
      Industry5n: req.body.Industry5n,
      Name: req.body.Name,
      College: req.body.College,
      Department: req.body.Department,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Description: req.body.Description,
      AppliedField: req.body.AppliedField,
      IndustryEffect: req.body.IndustryEffect,
      IsCommercialization: req.body.IsCommercialization,
      MarketDamand: req.body.MarketDamand,
      Competitiveness: req.body.Competitiveness,
      Cost: req.body.Cost,
      MarketDemandType: req.body.MarketDemandType,
      CompetitivenessType: req.body.CompetitivenessType,
      CostType: req.body.CostType,
      SubmitDate: req.body.SubmitDate,
      Submitted: true,
      ChartData: req.body.ChartData,
      Status: 1
    }, function (err, data) {
      if (err)
        res.json({ "status": 1, "msg": "Error", 'data': data });
      else
        res.json({ "status": 0, "msg": "success", 'data': req.body, });
    });
});

// upload patent data
router.patch('/patent', upload.single('myPatent'), function (req, res, next) {
  formModel.findByIdAndUpdate({ _id: req.query.FormId },
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
      if (err) res.json({ "status": 1, "msg": "Error" });
      else
        res.json({ "status": 0, "msg": "Success", "filename": req.file.filename, "id": data._id });
    });
});

// upload patent data without files
router.patch('/patent/nofile', function (req, res, next) {
  formModel.findByIdAndUpdate({ _id: req.query.FormId },
    {
      $push: {
        Patent: {
          Name: req.query.Name,
          Country: req.query.Country,
          Status: req.query.Status,
        }
      }
    }, function (err, data) {
      if (err) res.json({ "status": 1, "msg": "Error" });
      else
        res.json({ "status": 0, "msg": "Success", "id": data._id });
    });
});


// get patent data
router.get('/patent', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    res.sendFile(path.join(__dirname, `../uploads/${data.Patent[0].File}`), (err) => {
      if (err)
        res.json({ 'status': 0, 'msg': 'send patent file error', 'detail': err });
    }
    );
  });
});

// delete patent
router.delete('/patent', (req, res, next) => {
  formModel.updateOne({ _id: req.query.FormId }, {
    $pull: {
      Patent: {
        _id: req.query.PatentId
      }
    }
  }, (err) => {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "Success" });
  });
});

// upload paper data with files
router.patch('/paper', upload.single('myPaper'), function (req, res, next) {
  formModel.findByIdAndUpdate({ _id: req.query.FormId },
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
      if (err) res.json({ "status": 1, "msg": "Error" });
      else
        res.json({ "status": 0, "msg": "Success", "filename": req.file.filename, "id": data._id });
    });
});

// upload paper data without files
router.patch('/paper/nofile', function (req, res, next) {
  formModel.findByIdAndUpdate({ _id: req.query.FormId },
    {
      $push: {
        Paper: {
          Name: req.query.Name,
          Journal: req.query.Journal,
          Status: req.query.Status,
        }
      }
    }, function (err, data) {
      if (err) res.json({ "status": 1, "msg": "Error" });
      else
        res.json({ "status": 0, "msg": "Success", "id": data._id });
    });
});

// get paper data
router.get('/paper', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    res.sendFile(path.join(__dirname, `../uploads/${data.Patent[0].File}`), (err) => {
      if (err)
        res.json({ 'status': 0, 'msg': 'send patent file error', 'detail': err });
    }
    );
  });
});

// delete paper
router.delete('/paper', (req, res, next) => {
  formModel.updateOne({ _id: req.query.FormId }, {
    $pull: {
      Paper: {
        _id: req.query.PaperId
      }
    }
  }, (err) => {
    if (err)
      res.json({ "status": 1, "msg": "Error" });
    else
      res.json({ "status": 0, "msg": "Success" });
  });
});


// get image
router.get('/image', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    res.sendFile(path.join(__dirname, `../uploads/${data.Image}`), (err) => {
      if (err)
        res.json({ 'status': 0, 'msg': 'send patent file error', 'detail': err });
    }
    );
  });
});

// upload image
router.patch('/image', upload.single('myImage'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
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

// get product image
router.get('/productImage', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    res.sendFile(path.join(__dirname, `../uploads/${data.ProductImage}`), (err) => {
      if (err)
        res.json({ 'status': 0, 'msg': 'send productImage file error', 'detail': err });
    }
    );
  });
});

// upload product image
router.patch('/productImage', upload.single('productImage'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
    data.ProductImage = req.file.filename;
    data.markModified('ProductImage');
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

// get video
router.get('/video', (req, res, next) => {
  formModel.findById(req.query.FormId, (err, data) => {
    res.sendFile(path.join(__dirname, `../uploads/${data.Video}`), (err) => {
      if (err)
        res.json({ 'status': 0, 'msg': 'send patent file error', 'detail': err });
    }
    );
  });
});

// upload video
router.patch('/video', upload.single('myVideo'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
    data.Video = req.file.filename;
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

// upload marketDemandFile
router.patch('/marketDemandFile', upload.single('marketDemandFile'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
    data.MarketDemandFile = req.file.filename;
    data.markModified('MarketDemandFile');
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

// upload competitivenessFile
router.patch('/competitivenessFile', upload.single('competitivenessFile'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
    console.log(req);
    data.CompetitivenessFile = req.file.filename;
    data.markModified('CompetitivenessFile');
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

// upload costFile
router.patch('/costFile', upload.single('costFile'), function (req, res, next) {
  formModel.findById(req.query.FormId, (err, data) => {
    if (data == null) {
      res.json({ 'status': 1, 'msg': 'can not find document' });
      return;
    }
    data.CostFile = req.file.filename;
    data.markModified('CostFile');
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


// update form status
// 0 : 暫存
// 1 : 送出
// 2 : 審查中
// 3 : 修改
// 4 : 未通過
// 5 : 通過
router.put('/status', function (req, res, next) {
  var update = {
    Status: req.body.status
  };
  if (req.body.status == "3") {
    if (typeof req.body.deadline != 'undefined')
      update.Deadline = req.body.deadline;
    formModel.update({ _id: req.body.FormId }, update
      , function (err, data) {
        if (err)
          res.json({ "status": 1, "msg": "Error", 'data': data });
        else
          res.json({ "status": 0, "msg": "success", 'data': data, });
      });
  } else {
    formModel.update({ _id: req.body.FormId }, update
      , function (err, data) {
        if (err)
          res.json({ "status": 1, "msg": "Error", 'data': data });
        else
          formModel.findOne({}, function (err, form) {
            if (err)
              res.json({ "status": 1, "msg": "Error", 'data': data });
            else {
              form.Deadline = undefined;
              form.save();
              res.json({ "status": 0, "msg": "success", 'data': data, });
            }
          })
      });
  }
});

//get progress data
router.get('/progress', function (req, res, next) {
  formModel.find({ TeacherNum: req.query.TeacherNum })
    .select('UploadDate ResearchTopic Status')
    .exec((err, data) => {
      if (err || data == null) res.json({ "status": 1, "msg": "Error" });
      else res.json({
        "status": 0,
        "msg": "Success",
        "data": data
      });
    });
});

module.exports = router;