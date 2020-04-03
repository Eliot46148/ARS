var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var patentSchema = new mongoose.Schema({
    name :　String,
    email : String,
    password : String,
    needtestform:[{
        formOid : String,
        TeacherNum : String,
        isPass: Boolean,
        submitDate : Date,
        deadLine : Date,
        paperType : String,
        paperTheme : String,
        fromType : Number
    }]
});


module.exports = mongoose.model('committee', patentSchema);