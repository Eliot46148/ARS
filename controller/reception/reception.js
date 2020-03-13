var app = angular.module('Reception', []);

app.controller('MainCtrl', function($scope, $http) {
    $scope.login = function(){
        $http({
            method:'POST',
            url:'/users/login',
            data: {
                account: $scope.account,
                password: $scope.password
            },
        }).then(function(response) {
            $.cookie('account', response.data.data.account);
            window.location.reload();
        });
    }

    $scope.logout = function(){$.removeCookie('account');window.location.reload();}

    var id = $.cookie('account');
    if (id){
        $scope.account = id;
        $scope.disabled = false;
    }else{
        $('#login').modal('show');
        $scope.disabled = true;
    }
});