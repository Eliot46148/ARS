var app = angular.module('ProcessorOverview', []);

app.controller('MainCtrl', function($scope, $http) {
    // Redirect if not login
    if (!$.cookie('account')){window.location='/processor';}
    
    var sys = getUrlParameter('sys');
    $scope.disable = true

    // Process selected system
    if (sys){
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
    }else
        window.location.href = "/404";
});
