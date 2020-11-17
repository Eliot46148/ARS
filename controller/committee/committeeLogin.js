/**
 * committeeLogin.js
 * committeeLogin 頁面所使用的JavaScript
 */

var app = angular.module('committeeLogin', []);

/**
 * @param  $scope 作用域
 * @param  $http http協議
 */

app.controller('MainCtrl', function ($scope, $http) {

    /**
     * 當觸發前端頁面中的登入驗證使用者Email與密碼並登入。
     */
    $scope.login = function () {
        $http({
            method: 'POST',
            url: "/committee/login",
            data: {
                email: $scope.account,
                code: $scope.password
            },
            /**
             * 接收後端檢查登入的資料，並依照status來判斷結果
             * 
             * @param  {object} res  回傳物件
             */
        }).then(function (res) {
            if (res.data.status == 2) {
                $.cookie('committeeCookie', JSON.stringify({ objID: res.data.data._id }));
                window.location.href = "./dashboard";
            }
            else {
                alert(res.data.msg);
            }
        })
    }
});
