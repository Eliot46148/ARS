var mongoose = require('mongoose');
var production = process.env.NODE_ENV == 'production';
var mongodb_path = `mongodb://localhost:27017/${ production ? 'ARS' : 'ARS_TEST'}`;

mongoose.connect(mongodb_path,{useNewUrlParser: true, useUnifiedTopology: true});

console.log("MongoDB server connected at",mongodb_path);

module.exports = mongoose;