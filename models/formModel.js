var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS', { useNewUrlParser: true });

var formSchema = new mongoose.Schema({
    ResearchTopic: String,
    HIGHER: String,
    Industry: String,
    Industry5n: String,
    Name: String,
    College: String,
    Department: String,
    TeacherNum: String,
    Phone: String,
    Email: String,
    Description: String,
    Evaluation: String,
    //Image: [],
    //Video: []
});

module.exports = mongoose.model('form', formSchema);