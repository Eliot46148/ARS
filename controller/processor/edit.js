var app = angular.module('ProcessorEdit', []);

app.controller('MainCtrl', function($scope, $http, $window) {
    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                $scope.forms.push(data.data);
            });
        }
    });

    $scope.triggerView = function(tNum, id){
        $window.open('/form?'+new URLSearchParams({TeacherNum:tNum, FormId:id,isProcess:'process'}).toString(), '_blank');
    };
    
    $scope.triggerRespond = function(id, state=0){
        if (state==0){
            set_state(true);
            $scope.respond = [];
            $http.post('/committee/getFormExam', {'formId':id}).success(function(data){
                //console.log(data);
                $scope.triggerRespond.id = id;  
                $scope.respond = data.data;
                set_state(false);
            });
        }
        else{
            set_state(true);
            set_state(true, 1);            
            $timeout(function() { set_state(false);}, 1500);
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
});