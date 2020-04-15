var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('processor/processor', { title: 'Express' });
});

router.get('/overview', function(req, res, next) {
  res.render('processor/overview', { title: 'Express', sys: req.body.sys });
});

router.get('/:sys/edit', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/edit', { title: 'Express' });
});

router.get('/:sys/examination', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/examination', { title: 'Express' });
});

router.get('/:sys/download', function(req, res, next) {
  res.render('processor/'+req.params.sys+'/download', { title: 'Express' });
});


var fastcsv = require("fast-csv");
var fs = require("fs");
var ws = fs.createWriteStream("output.csv");

router.get('/:sys/download/loadCsv',function(req,res,next){
  var data ={name : "123"};
  console.log("start");
  switch(req.params.sys){
    case "rnpp":
      console.log(data);
      fastcsv
      .write(data, { headers: true })
      .on("finish", function() {
        console.log("Write to bezkoder_mongodb_fastcsv.csv successfully!");
      })
      .pipe(ws);      
      console.log("finish00")
      break;
    default:
      res.render("404");
  }
})


module.exports = router;