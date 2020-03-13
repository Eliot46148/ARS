var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var patentSchema = new mongoose.Schema({
    email : String,
    code : String,
    formOid : String
});


module.exports = mongoose.model('committee', patentSchema);