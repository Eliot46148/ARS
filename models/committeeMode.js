var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var patentSchema = new mongoose.Schema({
    name :　String,
    email : String,
    password : String,
    needtestform:[{
        formOid : String,
        isPass: Boolean,
        submitDate : Date,
        deadLine : Date,
        respondDate : {
            type: Date,
            default: Date.now
        },
        paperType : String,
        paperTheme : String,
        fromType : Number,
        StudyandData: Number,
        Marketassessment : Number,
        ManufacturingEvaluation : Number,
        FinancialEvaluation:Number,
        opinion: String,
        isSubmit : Number
    }]
});


module.exports = mongoose.model('committee', patentSchema);