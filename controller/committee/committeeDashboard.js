/**
 * committeeDashboard.js
 * committeeDashboard 頁面所使用的JavaScript
 */

var cookieData;
var Getdatafin;
var app = angular.module('committeeDashboard', []);

/**
 * @param  $scope 作用域
 * @param  $http http協議
 */
app.controller('MainCtrl', function ($scope, $http) {
    cookieData = JSON.parse($.cookie('committeeCookie'));

    $http({
        method: 'POST',
        url: '/committee/GetID',
        data: {
            Oid: cookieData.objID
        },
    /**
     * 接收接收後端資料並放入$Scope.array中以利前端連結資料
     * 
     * @param  {object} res 後端回傳資料
     */
    }).then(function (res) {
        var tmp = [];
        res.data.data.needtestform.forEach((element, index) => {
            tmp.push({
                submitDate: (element.submitDate).substring(0, 10),
                deadLine: (element.deadLine).substring(0, 10),
                paperType: element.paperType,
                paperTheme: element.paperTheme,
                buttonText: element.isPass ? "已送出" : Date.now() > new Date(element.deadLine) ? "已過期" : "點選",
                isDisable: element.isPass ? false : Date.now() > new Date(element.deadLine) ? false : true,
                index: index
            })
        });
        $scope.array = tmp
        Getdatafin = res.data.data
    })

    /**
     * 點擊選取按鈕，將資料放入cookie以利後續頁面使用
     * 
     * @param  {object} index 被點選的資料編號
     */
    $scope.clickButton = function (index) {
        $.cookie("committeeCookie", JSON.stringify({ objID: Getdatafin._id, index: index }))
    }
})