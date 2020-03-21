var express = require('express');
var systems = require('../../public/json/systemInfo.json').systems
var router = express.Router();

var id = 'rnpp';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

for (var i=0; i<systems.length; i++){
  var system = systems[i], functions = system.functions;
  if (system.id == id){
    for (var j=0; j<functions.length; j++){
      var route = '/'+functions[j].id, dir = '/precessor/'+id+route;
      router.get(route, function(req, res, next) {
        res.render(dir, { title: 'Express' });
      });
      console.log('routing -', route, dir);
    }
  }
}
module.exports = router;