var app = angular.module('Processor', []);

app.controller('MainCtrl', function($scope, $location, $http) {

    /**
     * Login event handling
     */
    $scope.login = function(){
        $http({
            method:'POST',
            url:'/auth/login',
            data: {
                account: $scope.account,
                password: $scope.password
            },
        }).then(function(response) {
            console.log(response);
            if (response.data.status == 0){
                $.cookie('account', response.data.account);
                window.location.reload();
            }else{
                $scope.account = "";
                $scope.password = "";
                $scope.msg = "員工號碼或代碼錯誤!";
            }
        });
    }

    /**
     * Logout event handling
     */
    $scope.logout = function(){$.removeCookie('account');window.location.reload();}

    // Check cookie
    var id = $.cookie('account');
    if (id){
        $scope.account = id;
        $scope.disabled = false;
    }else{
        $('#login').modal('show');
        $scope.disabled = true;
    }
    
    $scope.disable = true
});