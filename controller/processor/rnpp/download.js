var app = angular.module('ProcessorDownload', []);

app.controller('MainCtrl', function($scope, $http, $timeout, $window) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}

    var set_state = function(load, state=0){
        $scope.loading = load;
        $scope.loading_state = state;
    };
    
    set_state(true, 1);
    $http.get('/form/id').success(function(data){
        $scope.forms = [];
        for (var i=0; i<data.data.length; i++){
            var id = data.data[i];
            $http.get('/form/data', {'params': {'FormId':id}}).success(function(data){
                $scope.forms.push(data.data);
            });
        }
        console.log($scope.forms);
        
        $timeout(function() {
            set_state(false);
        }, 1500);
    });
});

if (!$.cookie('account')){window.location='/processor';}
angular.module('Processor', []).controller('MainCtrl', function($scope, $http) {
});