var app = angular.module('ProcessorExamination', []);

app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}

    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
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
            set_state(true);
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
            //console.log(params);
            
            $http.post('/committee/committeeregistered', params
            ).success(function(data){
                if (data.msg == 'success'){
                    //console.log(data);
                    $http.put('/form/status', {
                        'FormId':$scope.triggerExam.id,
                        'status':2
                    }).success(function(respond){
                        //console.log(respond);
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
                                set_state(true, 1);
                                $timeout(function() {
                                    //console.log(data);
                                    $('#examModal').modal('hide');
                                    $timeout(function(){
                                        set_state(false);
                                        $scope.clear();
                                    }, 100);
                                }, 1500);
                            });
                        });
                    });
                }else{
                    set_state(false);
                    $scope.err_msg="無法送出，請檢查填寫內容。";
                }
            });
        }
    }

    $scope.triggerRespond = function(id, state=0){
        if (state==0){
            set_state(true);
            $scope.respond = [];
            $http.post('/committee/getFormExam', {'formId':id}).success(function(data){
                //console.log(data);
                $scope.triggerRespond.id = id;
                var form = $scope.forms.find(element=>element._id==$scope.triggerRespond.id);
                $scope.radio = form.Status;
                $scope.respond = data.data;
                set_state(false);
            });
        }
        else{
            set_state(true);
            var update = {
                'FormId':$scope.triggerRespond.id,
                'status':parseInt($scope.radio)
            };
            if ($scope.radio=="3")
                update.deadline = new Date($scope.deadline);
            $http.put('/form/status', update).success(function(respond){
                //console.log(respond);
                $scope.forms.find(element=>element._id==$scope.triggerRespond.id).Status = $scope.radio;
                set_state(true, 1);
                $timeout(function() { set_state(false);}, 1500);
            });
            set_state(false);
        }
    };

    $scope.seeRespond = function(id){
        set_state(true);
        var found = $scope.respond.find(element=>element._id==id);
        if (found != null){
            $window.open('/static/review.html?'+new URLSearchParams(found).toString(), '_blank');
        }
        set_state(false);
    };

    $scope.init_deadline = function(){
        $('#deadline').datepicker({
            constrainInput: false,
            format: "yyyy-mm-dd",
            autoclose: true,
            language: 'zh-TW'
        });
    };
});

if (!$.cookie('account')){window.location='/processor';}
angular.module('Processor', []).controller('MainCtrl', function($scope, $http) {
});

$( function() {
    var ds = $('#date-start').datepicker({
        constrainInput: false,
        format: "yyyy-mm-dd",
        autoclose: true,
        language: 'zh-TW'
    });
    var de = $('#date-end').datepicker({
        constrainInput: false,
        format: "yyyy-mm-dd",
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