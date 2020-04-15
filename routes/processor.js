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



router.post('/:sys/download/loadCsv',function(req,res,next){
  var fs = require("fs");
  var json2csv = require('json2csv').Parser;

  data = req.body.data;
  /*data = {
    name : 123,
    price : 321
  }*/
  const jsoncsv = new json2csv({header:true, excelStrings:true, withBOM: true});
  const csvData = jsoncsv.parse(data);
  console.log("start");
  
  switch(req.params.sys){
    case "rnpp":
      var time = new Date();
      var filename = __dirname + 'cache' + time.getTime().toString() + '.csv';
      fs.writeFile(filename,csvData,function(err){
        if(err) throw err;
        res.sendFile(filename, function(err){
          if (err) {
            res.render("404");
          } else {
            fs.unlinkSync(filename);
          }
        });
      })
      
      break;
    default:
      res.render("404");
  }
  // res.json({data : "sucess"})
})


module.exports = router;