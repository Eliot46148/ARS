var app = angular.module('ProcessorEdit', []);

app.controller('MainCtrl', function($scope, $http) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}
    
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                $scope.forms.push(data.data);
            });
        }
    });
});