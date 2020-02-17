var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var patentSchema = new mongoose.Schema({
    Name: String,
    Country: String,
    Status: String,
    Pdf: BSON
});


module.exports = mongoose.model('user', userSchema);