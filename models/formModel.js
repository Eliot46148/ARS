var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ARS', { useNewUrlParser: true });

var formSchema = new mongoose.Schema({
    ResearchTopic: String,  // 研究成果主題
    HIGHER: String,         // HIGHER研究導向
    Industry: String,       // 所屬產業類別
    Industry5n: String,     // 5+n產業類別
    Name: String,           // 研究教師姓名
    College: String,        // 教師隸屬學院
    Department: String,     // 教師隸屬系所
    TeacherNum: String,     // 教師員工編號
    Phone: String,          // 教師連絡電話
    Email: String,          // 教師電子郵件
    Description: String,    // 成果技術摘要說明
    Evaluation: String,     // 應用範圍及產業效益評估
    UploadDate: {           // 建立日期
        type: Date,
        default: Date.now
    },
    Patent:[{               // 專利相關資訊
        Name: String,
        Country: String,
        Status: String,
        File: String
    }],
    Paper:[{                // 論文相關資訊
        Name: String,    
        Journal: String,
        Status: String,
        File: String
    }],    
    Image: String,          // 成果照片
    Video: String,          // 成果影片
    Submitted: Boolean,     // 使用者已確認送出
    Ended: Boolean,         // 審查流程結束
    ChartData:[]            // 成熟度數值
});

module.exports = mongoose.model('form', formSchema);