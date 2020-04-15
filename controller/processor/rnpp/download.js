var app = angular.module('ProcessorDownload', []);
app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    // Redirect if not login

    $scope.downloaddata  = function(){
        $http.post(window.location+"/loadCsv",{
            data:{name : "test"}        //change to json data
        },function(req,res){
            alert(res.data)
        })

    }

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
                                var submitDate = new Date(examData.data[j].submitDate), deadLine = new Date(examData.data[j].deadLine);
    
                                if (form.startDate !== undefined){
                                    if (dates.compare(form.startDate, submitDate))
                                    form.startDate = submitDate;
                                }else{
                                    form.startDate = new Date();
                                }
    
                                if (form.endDate !== undefined){
                                    if (dates.compare(form.endDate, deadLine))
                                    form.endDate = deadLine;
                                }else{
                                    form.endDate = new Date();
                                }
    
                                form.committees.push(examData.data[j]);
                                if (form.committees.length > $scope.max)
                                    $scope.max = form.committees.length;
                            }
                        }
        
                        $scope.forms.push(form);
                        $scope.recursion(i+1);
                    });
                }else{
                    console.log($scope.forms);
                    $timeout(function() {
                        set_state(false);
                    }, 1500);
                }
            }
            $scope.load = $scope.recursion(0);
        });
    });

    $scope.download = function(){
        console.log($scope.forms);
    };
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