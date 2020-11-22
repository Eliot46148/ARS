var app = angular.module('ProcessorExamination', []);

app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    /**
     * @param  {boolean} load - Whether something is loading or not
     * @param  {boolean} state=false - Loading state: False - not loaded yet, True: loaded
     */
    var set_state = function(load, state=false){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
    // Initialize form data
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

    /**
     * Clean scope's variables of controller
     */
    $scope.clear = function(){
        $scope.name = null;
        $scope.email = null;
        $scope.date_start = null;
        $scope.date_end = null;
        $scope.selectedForm = null;
        $scope.radio = null;
        $scope.err_msg = null;
    }

    /**
     * Trigger modal window of examination for 送審
     * @param  {stirng} id - Form id
     */
    $scope.triggerExam = function(id, state){
        $scope.triggerExam.id = id;
    }

    /**
     * Post request for 送審
     */
    $scope.sendExamination = function(){
        var sDate = new Date($scope.date_start), eDate = new Date($scope.date_end);
        sDate.setHours(sDate.getHours() - 8);
        eDate.setHours(eDate.getHours() + 16);
        eDate.setSeconds(eDate.getSeconds() - 1);

        set_state(true);
        var form = $scope.forms.find(element=>element._id==$scope.triggerExam.id);
        var params = {
            'name':$scope.name,
            'email':$scope.email,
            'formOid':$scope.triggerExam.id,
            'submitDate':sDate.toISOString(),
            'deadLine':eDate.toISOString(),
            'paperType':'研發能量展現平台',
            'paperTheme':form.ResearchTopic,
            'formType':parseInt($scope.selectedForm)+1
        };
        
        $http.post('/committee/committeeregistered', params
        ).success(function(data){
            if (data.msg == 'success'){
                $http.put('/form/status', {
                    'FormId':$scope.triggerExam.id,
                    'status':2
                }).success(function(respond){
                    var html = '';
                    $http.get('/mailServerSecret/template').success(function(rawhtml){
                        html = rawhtml
                        .replace('{name}', $scope.name)
                        .replace('{topic}',form.ResearchTopic)
                        .replace('{password}',data.password)
                        .replace('{date_start}',$scope.date_start)
                        .replace('{date_end}',$scope.date_end)
                        .replace('{url}','http://127.0.0.1:3000/committee/#accountID=' + $scope.email + '&passwordID=' + data.password);
                        
                        $http.post('/mailServerSecret', {
                            'to':$scope.email,
                            'subject':'委員通知',
                            'html': html
                        }).success(function(data){
                            set_state(true, true);
                            $timeout(function() {
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

    /**
     * Trigger modal window of examination for 審查意見
     * @param  {string} id - Form id
     */
    $scope.triggerRespond = function(id){
        set_state(true);
        $scope.respond = [];
        $http.post('/committee/getFormExam', {'formId':id}).success(function(data){
            $scope.triggerRespond.id = id;
            var form = $scope.forms.find(element=>element._id==$scope.triggerRespond.id);
            $scope.radio = form.Status;
            $scope.respond = data.data;
            $scope.triggerRespondForm = form;
            set_state(false);
        });
    };

    /**
     * Post request for 審查意見
     */
    $scope.sendRespond = function(){
        set_state(true);
        var update = {
            'FormId':$scope.triggerRespond.id,
            'status':parseInt($scope.radio)
        };
        // 修改 contains deadline options
        if ($scope.radio=="3"){
            update.deadline = new Date($scope.deadline);
            update.deadline.setHours(update.deadline.getHours() + 16);
            update.deadline.setSeconds(update.deadline.getSeconds() - 1);
        };
        $http.put('/form/status', update).success(function(respond){
            var html = '';
            $http.get('/mailServerSecret/template/examination_completed').success(function(rawhtml){
                html = rawhtml
                .replace('{name}', $scope.triggerRespondForm.Name)
                .replace('{topic}', $scope.triggerRespondForm.ResearchTopic)
                .replace('{url}','http://127.0.0.1:3000/progress?TeacherNum=' + $scope.triggerRespondForm.TeacherNum);
                
                $http.post('/mailServerSecret', {
                    'to': $scope.triggerRespondForm.Email,
                    'subject':'審查結果通知',
                    'html': html
                }).success(function(data){
                    $scope.forms.find(element=>element._id==$scope.triggerRespond.id).Status = $scope.radio;
                    set_state(true, true);
                    $timeout(function() { set_state(false)}, 1500);
                });
            });
        });
        $http.put('/committee/setFinalResult', update).success(function(res){
            console.log(res)
        })
        set_state(false);
    }
    
    /**
     * Retreive committee's response
     * @param  {string} id - Committee response id
     */
    $scope.seeRespond = function(id){
        set_state(true);
        var found = $scope.respond.find(element=>element._id==id);
        if (found != null){
            $http.post('/committee/login', {email: found.email, code: found.password}).success((data) => {
                $http.post('/committee/GetID', {Oid : data.data._id}).success((response) => {
                    var found_index = response.data.needtestform.find(element=>element._id==id);
                    $.cookie("committeeCookie",JSON.stringify({objID : data.data._id , index : response.data.needtestform.indexOf(found_index)}), { path: '/committee' })
                    $window.open('/committee/review', '_blank');
                });
            });
        }
        set_state(false);
    };

    /**
     * Initialize deadline datepicker element
     */
    $scope.init_deadline = function(){
        $('#deadline').datepicker({
            constrainInput: false,
            format: "yyyy-mm-dd",
            autoclose: true,
            language: 'zh-TW'
        });
    };
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
        language: 'zh-TW',
        orientation: "top"
    });
    var sDate,eDate;
    ds.on('changeDate',function(e){
        sDate = new Date($(this).val());
        if (!checkDate())
            $(this).val("").datepicker("update");
    });

    de.on('changeDate',function(date){
        eDate = new Date($(this).val());
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