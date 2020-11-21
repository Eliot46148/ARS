var express = require('express');
var router = express.Router();

/**
 * Edit page for processor with form functionality.
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
router.get('/edit', function(req, res, next) {
  res.render('processor/edit', { passport: req.session.passport });
});

/**
 * Examination page for processor with committee functionality.
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
router.get('/examination', function(req, res, next) {
  res.render('processor/examination', { passport: req.session.passport });
});

/**
 * Download page for processor with 2 file auto download popup.
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
router.get('/download', function(req, res, next) {
  res.render('processor/download', { passport: req.session.passport });
});

/**
 * Download page for processor with 2 file generated.
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
router.post('/download/loadCsv',function(req,res,next){
  var fs = require("fs");
  var json2csv = require('json2csv').Parser;

  data = req.body.data;
  const jsoncsv = new json2csv({fields: req.body.fields, header:true, withBOM: true});
  const csvData = jsoncsv.parse(data);

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
  });
})


module.exports = router;