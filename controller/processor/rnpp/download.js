var app = angular.module('ProcessorDownload', []);
app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}

    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
    set_state(true, 1);
    $http.post('/committee/getFormExam', {'formId':-1}).success(function(examData){
        $http.get('/form/id').success(function(data){
            $scope.forms = [];
            $scope.max = 0;
            $scope.recursion = function(i){
                if (i < data.data.length){
                    var id = data.data[i];
                    $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                        var form = JSON.parse(JSON.stringify(data.data));
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
        
                        $scope.forms.push({
                            "填寫時間": new Date(form.UploadDate),
                            "送出時間": new Date(form.SubmitDate),
                            "審查起始日": form.startDate,
                            "審查終止日": form.endDate,
                            "審核結果": (form.Status==3?"修改":form.Status==4?"未通過":form.Status==5?"通過":"尚未送出"),
                            "教師員工編號": form.TeacherNum,
                            "教師姓名": form.Name,
                            "隸屬學院": form.College,
                            "隸屬系所": form.Department,
                            "電子郵件": form.Email,
                            "連絡電話": form.Phone,
                            "主題": form.ResearchTopic,
                            "領域": form.HIGHER,
                            "產業類別": form.Industry,
                            "5+N產業類別": form.Industry5n,
                            "成果摘要": form.Description,
                            "成果應用範疇": form.Evaluation,
                            "需求成熟度": form.ChartData[0],
                            "市場成熟度": form.ChartData[1],
                            "投資成熟度": form.ChartData[2],
                            "製造成熟度": form.ChartData[3],
                            "技術成熟度": form.ChartData[4],
                            "組織成熟度": form.ChartData[5],
                            "科學成熟度": form.ChartData[6],
                            "社會貢獻成熟度": form.ChartData[7],
                            "創新成熟度綜合評估": null,
                            "創新成熟度平均等級": null,
                            "committees": form.committees
                        });
                        $scope.recursion(i+1);
                    });
                }else{
                    $scope.forms = $scope.forms.map(function(item, index, array){
                        var form = item;
                        var committees = JSON.parse(JSON.stringify(form.committees));
                        delete form.committees;

                        for (var j=0; j<$scope.max; j++){
                            if (committees[j] !== undefined){
                                var committee = {};
                                var opinion = committees[j].opinion;
                                var isSubmit = committees[j].isSubmit;
                                var StudyandData = committees[j].StudyandData;
                                var Marketassessment = committees[j].Marketassessment;
                                var ManufacturingEvaluation = committees[j].ManufacturingEvaluation;
                                var FinancialEvaluation = committees[j].FinancialEvaluation;
                                var name = committees[j].name;

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
                                    committee.StudyandData = "";
                                }
                                
                                if(Marketassessment !== undefined){
                                    var st = ""
                                    switch (Marketassessment){
                                        case 0:
                                            st = "Yes";
                                            break;
                                        case 1:
                                            st = "No";
                                            break;
                                    }

                                    committee.Marketassessment = st;
                                }else{
                                    committee.Marketassessment = "";
                                }
                                
                                if(ManufacturingEvaluation !== undefined){
                                    var st = ""
                                    switch (ManufacturingEvaluation){
                                        case 0:
                                            st = "Yes";
                                            break;
                                        case 1:
                                            st = "No";
                                            break;
                                    }
                                    committee.ManufacturingEvaluation = st;
                                }else{
                                    committee.ManufacturingEvaluation = "";
                                }
                                
                                if(FinancialEvaluation !== undefined){
                                    var st = ""
                                    switch (FinancialEvaluation){
                                        case 0:
                                            st = "Yes";
                                            break;
                                        case 1:
                                            st = "No";
                                            break;
                                    }

                                    committee.FinancialEvaluation = st;
                                }else{
                                    committee.FinancialEvaluation = "";
                                }
                                
                                if(isSubmit !==undefined){
                                    var st = ""
                                    switch (isSubmit){
                                        case 0:
                                            st = "建議";
                                            break;
                                        case 1:
                                            st = "不建議";
                                            break;
                                        case 2:
                                            st ="修改";
                                            break;
                                    }

                                    committee.isSubmit = st;
                                }else{
                                    committee.isSubmit = "";
                                }
                                
                                if(opinion !== undefined){
                                    committee.opinion = opinion;
                                }else{
                                    committee.opinion = "";
                                }

                                form["委員"+(j+1).toString()+"姓名"] = committee.name;
                                form["委員"+(j+1).toString()+"表單類型"] = committees[j].fromType;
                                form["委員"+(j+1).toString()+"回覆日期"] = committees[j].respondDate;
                                form["委員"+(j+1).toString()+"市場評估"] = committee.Marketassessment;
                                form["委員"+(j+1).toString()+"製造評估"] = committee.ManufacturingEvaluation;
                                form["委員"+(j+1).toString()+"財務評估"] = committee.FinancialEvaluation;
                                form["委員"+(j+1).toString()+"研究佐證資料比較"] = committee.StudyandData;
                                form["委員"+(j+1).toString()+"意見"] = committee.opinion;
                                form["委員"+(j+1).toString()+"總體評估"] = committee.isSubmit;
                            }else{
                                form["委員"+(j+1).toString()+"姓名"] = null;
                                form["委員"+(j+1).toString()+"表單類型"] = null;
                                form["委員"+(j+1).toString()+"回覆日期"] = null;
                                form["委員"+(j+1).toString()+"市場評估"] = null;
                                form["委員"+(j+1).toString()+"製造評估"] = null;
                                form["委員"+(j+1).toString()+"財務評估"] = null;
                                form["委員"+(j+1).toString()+"研究佐證資料比較"] = null;
                                form["委員"+(j+1).toString()+"意見"] = null;
                                form["委員"+(j+1).toString()+"總體評估"] = null;
                            }
                        }
                        return form;
                    });
                    $scope.fields = ["填寫時間",
                    "送出時間",
                    "審查起始日",
                    "審查終止日",
                    "審核結果",
                    "教師員工編號",
                    "教師姓名",
                    "隸屬學院",
                    "隸屬系所",
                    "電子郵件",
                    "連絡電話",
                    "主題",
                    "領域",
                    "產業類別",
                    "5+N產業類別",
                    "成果摘要",
                    "成果應用範疇",
                    "需求成熟度",
                    "市場成熟度",
                    "投資成熟度",
                    "製造成熟度",
                    "技術成熟度",
                    "組織成熟度",
                    "科學成熟度",
                    "社會貢獻成熟度",
                    "創新成熟度綜合評估",
                    "創新成熟度平均等級"];
                    for (var j=0; j<$scope.max; j++){
                        $scope.fields.push("委員"+(j+1).toString()+"姓名");
                        $scope.fields.push("委員"+(j+1).toString()+"表單類型");
                        $scope.fields.push("委員"+(j+1).toString()+"回覆日期");
                        $scope.fields.push("委員"+(j+1).toString()+"市場評估");
                        $scope.fields.push("委員"+(j+1).toString()+"製造評估");
                        $scope.fields.push("委員"+(j+1).toString()+"財務評估");
                        $scope.fields.push("委員"+(j+1).toString()+"研究佐證資料比較");
                        $scope.fields.push("委員"+(j+1).toString()+"意見");
                        $scope.fields.push("委員"+(j+1).toString()+"總體評估");
                    }
                    
                    $http.post(window.location+"/loadCsv",{
                        fields:$scope.fields,
                        data:$scope.forms
                    }).success(function(data){
                        var anchor = angular.element('<a/>');
                        anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,%EF%BB%BF' + encodeURI(data),
                            target: '_blank',
                            download: '表單紀錄.csv'
                        })[0].click();
                    })

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

if (!$.cookie('account')){window.location='/processor';}
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