var app = angular.module('ProcessorExamination', []);

app.controller('MainCtrl', function($scope, $http) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}
    
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                if (data.data.Submitted){
                    $scope.forms.push(data.data);
                }
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
        $scope.err_msg = null;
    }

    $scope.triggerExam = function(id, state){
        if (state==0)
            $scope.triggerExam.id = id;
        else{
            $scope.loading = true;

            var form = $scope.forms.find(element=>element._id==$scope.triggerExam.id);
            var params = {
                'name':$scope.name,
                'email':$scope.email,
                'formOid':$scope.triggerExam.id,
                'submitDate':$scope.date_start,
                'deadLine':$scope.date_end,
                'paperType':'研發能量展現平台',
                'paperTheme':form.ResearchTopic,
                'fromType':$scope.selectedForm+1
            };
            console.log(params);
            
            $http.post('/committee/committeeregistered', {'params': params
            }).success(function(data){
                if (data.msg == 'success'){
                    console.log(data);
                    var html = '';
                    $http.get('/mailServerSecret/template').success(function(rawhtml){
                        html = rawhtml
                        .replace('{name}', $scope.name)
                        .replace('{topic}',form.ResearchTopic)
                        .replace('{password}',data.password)
                        .replace('{date_start}',$scope.date_start)
                        .replace('{date_end}',$scope.date_end)
                        .replace('{url}','https://www.google.com/');
                        
                        $http.post('/mailServerSecret/send', {
                            'to':$scope.email,
                            'subject':'委員通知',
                            'html': html
                        }).success(function(data){
                            $('#examModal').modal('hide');
                            $scope.loading = false;
                            console.log(data);
                            $scope.clear();
                        });
                    });
                }else{
                    $scope.loading = false;
                    $scope.err_msg="無法送出，請檢查填寫內容。";
                }
            });
        }
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