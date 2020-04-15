var app = angular.module('progress', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('progressCtrl', ($scope, $http, $location) => {      
    $scope.init = () => {
        $scope.statusDict = ['暫存中','已送出','審查中','需修改','未通過','已通過']; 
        $scope.TeacherNum = $location.search().TeacherNum;
        $http.get('/form/progress?TeacherNum=' + $scope.TeacherNum).then(
            (res) => {
                $scope.forms = res.data.data;
                console.log(res);
            },
            (err) => {
                alert('資料載入錯誤!');
            }
        );
        console.log($scope);
    }

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

    $scope.init();
});