var mongoose = require('./mongo.js');

var patentSchema = new mongoose.Schema({
    name :　String,
    email : String,
    password : String,
    needtestform:[{
        formOid : String,
        isPass: Boolean,
        submitDate : Date,
        deadLine : Date,
        respondDate : Date,
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