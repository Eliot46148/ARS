var mongoose = require('./mongo.js');

var userSchema = new mongoose.Schema({
    account: String,
    password: String
});


module.exports = mongoose.model('user', userSchema);