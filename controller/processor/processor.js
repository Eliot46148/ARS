var app = angular.module('Processor', []);

app.controller('MainCtrl', function($scope, $location, $http) {
    // Login event handling
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
            if (response.data.msg == "success"){
                $.cookie('account', response.data.data.account);
                window.location.reload();
            }else{
                $scope.account = "";
                $scope.password = "";
                $scope.msg = response.data.msg;
            }
        });
    }

    // Logout event handling
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

    // Route all of the systems through front end
    var system = function(name, id){
        return {
            name:name,
            id:id,
            href:(id!=''?"/processor/overview?sys="+id:'#'),
        };
    }
    $scope.systems = [];
    $http.get('/json/systemInfo.json').success(function(data){
        var sys = data.systems;
        for (var i=0; i<sys.length; i++)
            $scope.systems.push(system(sys[i].name, sys[i].id));
    });
});