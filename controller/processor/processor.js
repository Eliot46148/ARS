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

    var sys = 'rnpp';
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
    
    $scope.disable = true

    // Get all of the systems from json
    $http.get('/json/systemInfo.json').success(function(data){
        $scope.disable = false;
        $scope.functions = [];

        // Route all of the functions through front end
        var functionTemplate = function(name, sys, id){
            var defaults = [
                ['edit', 'fa-plus-circle', 'btn btn-sq-lg btn-primary'],
                ['examination', 'fa-user', 'btn btn-sq-lg btn-success'],
                ['download', 'fa-file-alt', 'btn btn-sq-lg btn-info'],
            ], found = defaults.find(element=>element[0]==id), icon='fa-toggle-on', classes='btn btn-sq-lg btn-warning';
            if (found){
                icon=found[1];
                classes=found[2];
            }
            return {
                name:name,
                href:"/processor/"+sys+"/"+id,
                icon:icon,
                classes:classes
            };
        }

        var systems = data.systems;
        $scope.systems = systems;
        for (var i=0; i<systems.length; i++){
            var system = systems[i];
            if (system.id == sys){
                $scope.title = system.name;
                for (var j=0; j<system.functions.length; j++){
                    var func = system.functions[j];
                    $scope.functions.push(functionTemplate(func.name, system.id, func.id));
                }
            }
        }
    });
});