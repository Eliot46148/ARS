var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

module.exports = model;