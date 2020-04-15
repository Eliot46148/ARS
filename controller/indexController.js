var app = angular.module('index', []);

app.controller('indexCtrl', ($scope, $http) => {
    $scope.getProgress = () => {
        $http.get(`/form/progress?TeacherNum=${$scope.TeacherNumProgress}`)
            .then((res) => {                
                if (res.data.data.length >0)
                    window.location.assign(`./progress?TeacherNum=${$scope.TeacherNumProgress}`);
                else
                    alert('員工編號錯誤!');
            }, (err) => alert(err.msg));
    }
});