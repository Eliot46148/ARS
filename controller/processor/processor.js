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
                username: $scope.username,
                password: $scope.password
            },
        }).then(function(response) {
            console.log(response);
            if (response.status == 200){
                $.cookie('username', response.data.username);
                window.location.reload();
            }else{
                $scope.username = "";
                $scope.password = "";
                $scope.msg = "員工號碼或代碼錯誤!";
            }
        });
    }

    /**
     * Logout event handling
     */
    $scope.logout = function(){ $http.get('/auth/logout'); }

    // Check cookie
    $http.get('/auth').then((response) => {
        var id = response.data.session.passport ? response.data.session.passport.user : null;
        if (id){
            $scope.username = id;
            $scope.disabled = false;
        }else{
            $('#login').modal('show');
            $scope.disabled = true;
        }
    });
    
    $scope.disable = true
});