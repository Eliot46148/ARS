var app = angular.module('ProcessorDownload', []);
app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };

    $scope.download = function(){
        $http.post(window.location+"/loadCsv",{
            fields:$scope.fields,
            data:$scope.forms
        }).success(function(data){
            var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,%EF%BB%BF' + encodeURI(data),
                target: '_blank',
                download: '成果填寫資料.csv'
            })[0].click();
        });
        $http.post(window.location+"/loadCsv",{
            fields:$scope.c_fields,
            data:$scope.committees
        }).success(function(data){
            var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,%EF%BB%BF' + encodeURI(data),
                target: '_blank',
                download: '委員審查意見.csv'
            })[0].click();
        });
    };

    var formatDate = function(date) {
        var d = new Date(date);
        return d.pattern("yyyy-MM-dd HH:mm:ss");
    };

    var pick = function(obj, keys) {
        return keys.map(k => k in obj ? {[k]: obj[k]} : {})
                   .reduce((res, o) => Object.assign(res, o), {});
    }
    
    set_state(true, 1);
    $http.post('/committee/getFormExam', {'formId':-1}).success(function(examData){
        $http.get('/form/id').success(function(data){
            $scope.forms = [];
            $scope.committees = [];
            $scope.max = 0;
            $scope.recursion = function(i){
                if (i < data.data.length){
                    var id = data.data[i];
                    $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                        var form = JSON.parse(JSON.stringify(data.data));
                        var added = false;
                        form.committees = [];
        
                        if (form.ChartData.length < 8){
                            var length = form.ChartData.length;
                            for (var j=0; j<8-length;j++)
                                form.ChartData.push(null);
                        }
    
                        for (var j=0; j<examData.data.length; j++){
                            if (examData.data[j].formOid == form._id){
                                form.committees.push(examData.data[j]);
                                if (form.committees.length > $scope.max)
                                    $scope.max = form.committees.length;
                            }
                        }

                        form.ChartData.forEach(function(n, i, arr){
                            form.ChartData[i] = form.ChartData[i] == 0 ? "不適用" : form.ChartData[i];
                        });
        
                        var fields1 = {
                            "成果序號": i + 1,
                            "填寫時間": formatDate(form.UploadDate),
                            "送出時間": formatDate(form.SubmitDate),
                            "員工編號": form.TeacherNum,
                            "表單編號": form._id,
                            "填寫狀態": (form.Status==3?"修改":form.Status==4?"未獲推薦":form.Status==5?"推薦":"尚未送出"),
                            "教師姓名": form.Name,
                            "學院": form.College,
                            "系所": form.Department,
                            "電話": form.Phone,
                            "郵件": form.Email,
                            "研究成果": form.ResearchTopic,
                            "商品化研發導向(主)": form.HIGHER,
                            "商品化研發導向(次)": form.HIGHER2,
                            "所屬產業類別(主)": form.Industry,
                            "所屬產業類別(次)": form.Industry2,
                            "5+N產業類別": form.Industry5n
                        };

                        var fields3 = {
                            "成果摘要說明": form.Description,
                            "應用範圍及產業效益評估": form.Evaluation,
                            "需求成熟度": form.ChartData[0],
                            "市場成熟度": form.ChartData[1],
                            "投資成熟度": form.ChartData[2],
                            "製造成熟度": form.ChartData[3],
                            "技術成熟度": form.ChartData[4],
                            "組織成熟度": form.ChartData[5],
                            "科學成熟度": form.ChartData[6],
                            "社會貢獻成熟度": form.ChartData[7],
                            "是否需要進入商品化審查": "MarketDemand" in form ? "是" : "-",
                            "市場必需性": form.MarketDemand,
                            "技術競爭力": form.Competitiveness,
                            "財務規劃": form.Cost
                        };

                        form.Patent.forEach(function(patent, index, array){
                            var fields2 = {
                                "專利相關資訊": form.Patent.length > 0 ? "是" : "",
                                "專利數": form.Patent.length,
                                "專利序號": index + 1,
                                "專利主題名稱": patent.Name,
                                "專利申請國籍": patent.Country,
                                "專利申請狀況": patent.Status,
                                "是否有上傳檔案": "File" in patent ? "是" : "否",
                                "學術論文相關資訊": "-",
                                "論文數": "-",
                                "論文序號": "-",
                                "論文主題名稱": "-",
                                "學術期刊領域": "-",
                                "論文申請狀況": "-",
                                "是否有檔案": "-"
                            };
                            $scope.forms.push($.extend({}, fields1, fields2, fields3));
                            added = true;
                        });

                        form.Paper.forEach(function(paper, index, array){
                            var fields2 = {
                                "專利相關資訊": "-",
                                "專利數": "-",
                                "專利序號": "-",
                                "專利主題名稱": "-",
                                "專利申請國籍": "-",
                                "專利申請狀況": "-",
                                "是否有上傳檔案": "-",
                                "學術論文相關資訊": form.Paper.length > 0 ? "是" : "",
                                "論文數": form.Paper.length,
                                "論文序號": index + 1,
                                "論文主題名稱": paper.Name,
                                "學術期刊領域": paper.Journal,
                                "論文申請狀況": paper.Status,
                                "是否有檔案": "File" in paper ? "是" : "否"
                            };
                            $scope.forms.push($.extend({}, fields1, fields2, fields3));
                            added = true;
                        });

                        if (!added){
                            var fields2 = {
                                "專利相關資訊": "-",
                                "專利數": "-",
                                "專利序號": "-",
                                "專利主題名稱": "-",
                                "專利申請國籍": "-",
                                "專利申請狀況": "-",
                                "是否有上傳檔案": "-",
                                "學術論文相關資訊": "-",
                                "論文數": "-",
                                "論文序號": "-",
                                "論文主題名稱": "-",
                                "學術期刊領域": "-",
                                "論文申請狀況": "-",
                                "是否有檔案": "-"
                            };
                            $scope.forms.push($.extend({}, fields1, fields2, fields3));
                        }

                        form.committees.forEach(function(committee, index, array){
                            var c_fields1 = pick(fields1, ["成果序號", "員工編號", "表單編號", "教師姓名", "學院", "系所", "電話", "郵件", "研究成果"]);
                            
                            var c_fields2 = {
                                "送審時間": formatDate(committee.submitDate),
                                "審查截止時間": formatDate(committee.deadLine),
                                "審查送出時間": "respondDate" in committee ? formatDate(committee.respondDate) : "-",
                                //"委員序號": "委員" + index,
                                "委員姓名": committee.name,
                                "委員郵件": committee.email,
                                "填寫表單密碼": committee.password,
                                "表單類型": "表單" + committee.formType.toString(),
                                //"綜整審查結果": (form.Status==3?"修改":form.Status==4?"未通過":form.Status==5?"通過":"-")
                                "綜整審查結果": committee.finalResult
                            };

                            var opinion = committee.opinion;
                            var isSubmit = committee.isSubmit;
                            var StudyandData = committee.StudyandData;
                            var Marketassessment = committee.Marketassessment;
                            var ManufacturingEvaluation = committee.ManufacturingEvaluation;
                            var FinancialEvaluation = committee.FinancialEvaluation;
                            var name = committee.name;

                            if(name !== undefined){
                                committee.name = name;
                            }else{
                                committee.name = "";
                            }
                            
                            if(StudyandData !== undefined){
                                var st = ""
                                switch (StudyandData){
                                    case 0:
                                        st = "符合";
                                        break;
                                    case 1:
                                        st = "不符合";
                                        break;
                                }
                                committee.StudyandData = st;
                            }else{
                                committee.StudyandData = "-";
                            }
                            
                            if(Marketassessment !== undefined){
                                var st = ""
                                switch (Marketassessment){
                                    case 0:
                                        st = "高";
                                        break;
                                    case 1:
                                        st = "中";
                                        break;
                                    case 2:
                                        st = "低";
                                        break;
                                        
                                }

                                committee.Marketassessment = st;
                            }else{
                                committee.Marketassessment = "-";
                            }
                            
                            if(ManufacturingEvaluation !== undefined){
                                var st = ""
                                switch (ManufacturingEvaluation){
                                    case 0:
                                        st = "高";
                                        break;
                                    case 1:
                                        st = "中";
                                        break;
                                    case 2:
                                        st = "低";
                                        break;
                                }
                                committee.ManufacturingEvaluation = st;
                            }else{
                                committee.ManufacturingEvaluation = "-";
                            }
                            
                            if(FinancialEvaluation !== undefined){
                                var st = ""
                                switch (FinancialEvaluation){
                                    case 0:
                                        st = "高";
                                        break;
                                    case 1:
                                        st = "中";
                                        break;
                                    case 2:
                                        st = "低";
                                        break;
                                }

                                committee.FinancialEvaluation = st;
                            }else{
                                committee.FinancialEvaluation = "-";
                            }
                            
                            if(isSubmit !==undefined){
                                var st = ""
                                switch (isSubmit){
                                    case 0:
                                        st = "推薦";
                                        break;
                                    case 1:
                                        st = "不推薦";
                                        break;
                                    case 2:
                                        st ="修改";
                                        break;
                                }

                                committee.isSubmit = st;
                            }else{
                                committee.isSubmit = "-";
                            }
                            
                            if(opinion !== undefined){
                                committee.opinion = opinion;
                            }else{
                                committee.opinion = "-";
                            }

                            if (committee.formType == 1){
                                c_fields2 = $.extend({}, c_fields2, {
                                    "研究資料與佐證資料是否相符": committee.StudyandData,
                                    "審查意見1": committee.opinion,
                                    "總體審查1": committee.isSubmit,
                                    "市場價值性	": "-",
                                    "技術競爭力	": "-",
                                    "財務規劃完整性	": "-",
                                    "審查意見2": "-",
                                    "總體審查2": "-",
                                });
                            }else{
                                c_fields2 = $.extend({}, c_fields2, {
                                    "研究資料與佐證資料是否相符": "-",
                                    "審查意見1": "-",
                                    "總體審查1": "-",
                                    "市場價值性	": committee.Marketassessment,
                                    "技術競爭力	": committee.ManufacturingEvaluation,
                                    "財務評估": committee.FinancialEvaluation,
                                    "財務規劃完整性	": committee.opinion,
                                    "總體審查2": committee.isSubmit,
                                });
                            }
                            $scope.committees.push($.extend({}, c_fields1, c_fields2));
                        });
                        
                        $scope.recursion(i+1);
                    });
                }else{
                    $scope.fields = ["成果序號",
                        "填寫時間",
                        "送出時間",
                        "員工編號",
                        "表單編號",
                        "填寫狀態",
                        "教師姓名",
                        "學院",
                        "系所",
                        "電話",
                        "郵件",
                        "研究成果",
                        "商品化研發導向(主)",
                        "商品化研發導向(次)",
                        "所屬產業類別(主)",
                        "所屬產業類別(次)",
                        "5+N產業類別",
                        "專利相關資訊",
                        "專利數",
                        "專利序號",
                        "專利主題名稱",
                        "專利申請國籍",
                        "專利申請狀況",
                        "是否有上傳檔案",
                        "學術論文相關資訊",
                        "論文數",
                        "論文序號",
                        "論文主題名稱",
                        "學術期刊領域",
                        "論文申請狀況",
                        "是否有檔案",
                        "成果摘要說明",
                        "應用範圍及產業效益評估",
                        "需求成熟度",
                        "市場成熟度",
                        "投資成熟度",
                        "製造成熟度",
                        "技術成熟度",
                        "組織成熟度",
                        "科學成熟度",
                        "社會貢獻成熟度",
                        "是否需要進入商品化審查",
                        "市場必需性",
                        "技術競爭力",
                        "財務規劃"
                    ];
                    $scope.c_fields = [
                        "成果序號", "員工編號", "表單編號", "教師姓名", "學院", "系所", "電話", "郵件", "研究成果",
                        "送審時間",
                        "審查截止時間",
                        "審查送出時間",
                        "委員姓名",
                        "委員郵件",
                        "填寫表單密碼",
                        "表單類型",
                        "研究資料與佐證資料是否相符",
                        "審查意見1",
                        "總體審查1",
                        "市場價值性	",
                        "技術競爭力	",
                        "財務規劃完整性	",
                        "審查意見2",
                        "總體審查2",
                        "綜整審查結果"
                    ];

                    $scope.download();

                    // console.log($scope.forms);
                    $timeout(function() {
                        set_state(false);
                    }, 1500);
                }
            }
            $scope.load = $scope.recursion(0);
        });
    });
});

angular.module('Processor', []).controller('MainCtrl', function($scope, $http) {
});

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
  };
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}

Date.prototype.pattern=function(fmt) {         
  var o = {         
  "M+" : this.getMonth()+1, //月份         
  "d+" : this.getDate(), //日         
  "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
  "H+" : this.getHours(), //小时         
  "m+" : this.getMinutes(), //分         
  "s+" : this.getSeconds(), //秒         
  "q+" : Math.floor((this.getMonth()+3)/3), //季度         
  "S" : this.getMilliseconds() //毫秒         
  };         
  var week = {         
  "0" : "/u65e5",         
  "1" : "/u4e00",         
  "2" : "/u4e8c",         
  "3" : "/u4e09",         
  "4" : "/u56db",         
  "5" : "/u4e94",         
  "6" : "/u516d"        
  };         
  if(/(y+)/.test(fmt)){         
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
  }         
  if(/(E+)/.test(fmt)){         
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
  }         
  for(var k in o){         
      if(new RegExp("("+ k +")").test(fmt)){         
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
      }         
  }         
  return fmt;         
}