var app = angular.module('form', []);

app.controller('formCtrl', ($scope, $http) => {
    $scope.test = () => console.log($scope);
    $scope.TeacherNum = $.cookie('id');
    $scope.save = () => {        
        $http.put('/form',
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "Industry": $scope.Industry,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.name,
                "College": $scope.college,
                "Department": $scope.department,                
                "Phone": $scope.phone,
                "Email": $scope.email,
                "Description": $scope.description,
                "Evaluation": $scope.evaluation
            })
            .then((res) => console.log(res), (err) => alert(err.msg));
    }
    $scope.
});