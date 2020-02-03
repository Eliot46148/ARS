var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var userSchema = new mongoose.Schema({
    account: String,
    password: String
});


module.exports = mongoose.model('user', userSchema);