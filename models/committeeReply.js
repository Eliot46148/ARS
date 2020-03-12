var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS',{useNewUrlParser: true});

var committeeReplytSchema = new mongoose.Schema({
    StudyandData: Boolean,
    Marketassessment : Boolean,
    ManufacturingEvaluation : Boolean,
    FinancialEvaluation:Boolean,
    opinion: String,
    isPass : Number
});


module.exports = mongoose.model('committeeReply', committeeReplytSchema);