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
                console.log(res);
                console.log(res.data.status);             
                window.location.assign(`./form?TeacherNum=${$scope.TeacherNumGet}&FormId=${$scope.FormId}`);
            }, (err) => alert(err.msg));
    }
    
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
