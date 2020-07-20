var mongoose = require('./mongo.js');

var formSchema = new mongoose.Schema({
    ResearchTopic: String,
    HIGHER: Number,
    Industry: Number,
    Industry5n: Number,
    Name: String,
    College: Number,
    Department: Number,
    TeacherNum: String,
    Phone: String,
    Email: String,
    Description: String,
    Evaluation: String,    
});

module.exports = mongoose.model('form', formSchema);