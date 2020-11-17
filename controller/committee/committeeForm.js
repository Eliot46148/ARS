/**
 * committeeForm.js
 * committeeForm 頁面所使用的JavaScript
 */

var app = angular.module('committeeForm', []);

/**
 * @param  $scope 作用域
 * @param  $http http協議
 */

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});


app.controller('MainCtrl', function ($scope, $http, $location) {
    $scope.radio = $location.$$search;

    window.saveToDB = function (isPass) {
        $scope.radio.ispass =isPass;
        $http({
            method: "POST",
            url: "/committee/committeeupdate",
            data: $scope.radio
        }).then(function (res) { console.log(res) });
        console.log($scope.radio);
    }
});
