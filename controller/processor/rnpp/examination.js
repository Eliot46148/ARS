var app = angular.module('ProcessorExamination', []);

app.controller('MainCtrl', function($scope, $http) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}
    
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                $scope.forms.push(data.data);
            });
        }
    });

    $scope.clear = function(){
        $scope.name = null;
        $scope.email = null;
        $scope.date_start = null;
        $scope.date_end = null;
        $scope.selectedForm = null;
        $scope.radio = null;
    }

    $scope.triggerExam = function(id){
        //$scope.loading = true;
    }

    $scope.triggerRespond = function(id){
        $scope.loading = true;
        $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
            $scope.respond = [{
                '_id' : 0,
                'Name' : 'ABC',
                'isPass': false,
                'submitDate' : "2020/01/01",
                'deadLine' : "2020/01/01",
                'formType' : 0
            }];
            $scope.loading = false;
        });
    }
});

if (!$.cookie('account')){window.location='/processor';}
angular.module('Processor', []).controller('MainCtrl', function($scope, $http) {
});

$( function() {
    var ds = $('#date-start').datepicker({
        constrainInput: false,
        format: "yyyy/mm/dd",
        autoclose: true,
        language: 'zh-TW'
    });
    var de = $('#date-end').datepicker({
        constrainInput: false,
        format: "yyyy/mm/dd",
        autoclose: true,
        language: 'zh-TW'
    });
    var sDate,eDate;
    ds.on('changeDate',function(e){
        sDate = new Date($(this).datepicker('getUTCDate'));
        if (!checkDate())
            $(this).val("").datepicker("update");
    });

    de.on('changeDate',function(date){
        eDate = new Date($(this).datepicker('getUTCDate'));
        if (!checkDate())
            $(this).val("").datepicker("update");
    });

    function checkDate()
    {
        if(sDate && eDate && (eDate<sDate))
        {
            alert('結束日期應大於起始日期');
            return false;
        }
        return true;
    }
} );