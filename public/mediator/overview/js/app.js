var app = angular.module('Mediator', []);

app.controller('MainCtrl', function($scope, $http) {
    var system = function(name, href){
        return {
            name:name,
            href:href
        };
    }

    $scope.systems = [
        system('研發能量展現平台', '/mediator/overview/sys1/index.html'),
        system('PBL學習申請', '#'),
        system('師生社群申請', '#'),
        system('待新增', '#'),
        system('待新增', '#'),
        system('待新增', '#'),
    ];
    $scope.redirect = function(url){
        location.href = url;
    }

    $scope.logout = function(){$.removeCookie('account');window.location.reload();}

    var id = $.cookie('account');
    if (id){
        $scope.account = id;
        $scope.disabled = false;
    }else{
        $('#login').modal('show');
        $scope.disabled = true;
        location.href='/mediator/index.html';
    }
});