var app = angular.module('function', []);

app.controller('functionCtrl', ($scope, $http) => {    
    $scope.createNewForm = () => {        
        $http.post('/form', { 'TeacherNum': $scope.TeacherNumCreate })
        .then((res) => {            
            window.location.assign(`./form?TeacherNum=${$scope.TeacherNumCreate}&FormId=${res.data.id}`);
        }, (err) => alert(err.msg));
    }
    $scope.getForm = () => {
        $http.get(`/form?TeacherNum=${$scope.TeacherNumGet}$FormId=${$scope.FormId}`)
        .then((res) => {    
            if(res.data != null)
                window.location.assign(`./form?TeacherNum=${$scope.TeacherNumGet}&FormId=${$scope.FormId}`);
            else
                alert('員工或表單編號錯誤!');
        }, (err) => alert(err.msg));
    }
});
