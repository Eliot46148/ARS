var app = angular.module('function', []);

app.controller('functionCtrl', ($scope, $http) => {    
    $scope.createNewForm = () => {        
        $http.post('/form', { 'TeacherNum': $scope.TeacherNum })
        .then((res) => {
            $.cookie('id', $scope.TeacherNum);
            window.location.assign('./form');
        }, (err) => alert(err.msg));
    }
});
