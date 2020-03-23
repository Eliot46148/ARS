var express = require('express');
var systems = require('../../public/json/systemInfo.json').systems
var router = express.Router();

var id = 'community';

for (var i=0; i<systems.length; i++){
  var system = systems[i], functions = system.functions;
  if (system.id == id){
    for (var j=0; j<functions.length; j++){
      var route = '/'+system.id+'/'+functions[j].id;
      router.get(route, function(req, res, next) {
        res.render(dir, { title: 'Express' });
      });
      console.log('routing -', route);
    }
  }
}
module.exports = router;