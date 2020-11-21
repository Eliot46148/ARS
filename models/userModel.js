var mongoose = require('./mongo.js');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});


module.exports = mongoose.model('user', userSchema);