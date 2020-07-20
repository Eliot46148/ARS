var mongoose = require('mongoose');
var production = process.env.NODE_ENV == 'production';
var development = process.env.NODE_ENV == 'development';
var mongodb_path = `mongodb://localhost:27017/${ production || development ? 'ARS' : 'ARS_TEST'}`;

mongoose.connect(process.env.MONGODB_URI || mongodb_path,{useNewUrlParser: true, useUnifiedTopology: true});

console.log("MongoDB server connected at", process.env.MONGODB_URI || mongodb_path);

module.exports = mongoose;