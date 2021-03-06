var mongoose = require('./mongo.js');

var formSchema = new mongoose.Schema({
    ResearchTopic: String,          // 研究成果主題
    HIGHER: String,                 // 商品化研究導向(主關聯)
    HIGHER2: String,                // 商品化研究導向(次關聯)
    Industry: String,               // 所屬產業類別(主關聯)
    Industry2: String,              // 所屬產業類別(次關聯)
    Industry5n: String,             // 5+n產業類別
    Name: String,                   // 研究教師姓名
    College: String,                // 教師隸屬學院
    Department: String,             // 教師隸屬系所
    TeacherNum: String,             // 教師員工編號
    Phone: String,                  // 教師連絡電話
    Email: String,                  // 教師電子郵件
    Description: String,            // 成果技術摘要說明
    AppliedField: String,           // 應用範圍評估
    IndustryEffect: String,         // 產業效益評估
    IsCommercialization: String,    // 是否進入商品化審查
    MarketDemand: String,           // 市場需求價值
    Competitiveness: String,        // 技術競爭性
    Cost: String,                   // 商品化成本規劃
    MarketDemandFile: String,       // 市場需求價值(檔案)
    CompetitivenessFile: String,    // 技術競爭性(檔案)
    CostFile: String,               // 商品化成本規劃(檔案)
    MarketDemandType: String,       // 技術競爭性類型
    CompetitivenessType: String,    // 市場需求價值類型
    CostType: String,               // 商品化成本規劃類型
    UploadDate: {                   // 建立日期
        type: Date,
        default: Date.now
    },
    SubmitDate: Date,               // 送出日期
    Patent: [{                      // 專利相關資訊
        Name: String,
        Country: String,
        Status: String,
        File: String
    }],
    Paper: [{                       // 論文相關資訊
        Name: String,
        Journal: String,
        Status: String,
        File: String
    }],
    Image: String,                  // 成果照片
    ProductImage: String,           // 實物照片
    Video: String,                  // 成果影片
    Submitted: {                    // 使用者已確認送出
        type: Boolean,
        default: false
    },

    Ended: Boolean,                 // 審查流程結束
    ChartData: [],                  // 成熟度數值
    Status: Number,                 // 表單送審狀態
    Deadline: Date                  // 表單修改期限
});

module.exports = mongoose.model('form', formSchema);