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

    $scope.init();
});