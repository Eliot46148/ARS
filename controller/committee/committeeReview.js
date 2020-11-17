
var cookieData;
var comdata;

var app = angular.module('committeeReview', []);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('MainCtrl', function ($scope, $http, $location) {

    cookieData = JSON.parse($.cookie('committeeCookie'));
    $.cookie("committeeCookie", "");

    $http({
        method: 'POST',
        url: '/committee/GetID',
        data: {
            Oid: cookieData.objID
        }
    }).then(function (res) {
        var retdata = res.data.data;
        console.log(res);
        console.log(cookieData.index)
        var useinload = retdata.needtestform[cookieData.index];

        comdata = {
            Email: retdata.email,
            Password: retdata.password,
            respondDate: new Date(),
            FormType: useinload.formType,
            studyandData: useinload.StudyandData,
            Marketassessment: useinload.Marketassessment,
            ManufacturingEvaluation: useinload.ManufacturingEvaluation,
            FinancialEvaluation: useinload.FinancialEvaluation,
            opinion: useinload.opinion,
            isSubmit: useinload.isSubmit,
            index: cookieData.index
        }
        $scope.needReviewFormURL = "./reviewForm?email=" + retdata.email + "&password=" + retdata.password + "&index=" + cookieData.index;
        $scope.committeeFormURL = "./committeeForm?" + new URLSearchParams(comdata).toString();
    })

    $scope.saveBtClick = function () {
        UpdateDB(false);
        backToPreviousPage();
    }

    $scope.submitBtClick = function () {
        UpdateDB(true);
        backToPreviousPage();
    }

    $scope.backBtClick = function () {
        backToPreviousPage();
    }

    function UpdateDB(isPass) {
        document.getElementById('committeeForm').contentWindow.saveToDB(isPass);

    }
    function backToPreviousPage() {
        $.cookie("committeeCookie", JSON.stringify({ objID: cookieData.objID }))
        window.history.back();
    }
});


function frameload() {
    var $ifram = $('#needReviewForm');
    var $contents = $ifram.contents();
    $contents.find('#title').remove();
    $contents.find('#teachernum').remove();
    $contents.find('#formid').remove();
    $contents.find('#savebt').remove();
    $contents.find('#submitbtn').remove();
    $contents.find('#btn-patent').remove();
    $contents.find('#removePDFpaper').remove();
    $contents.find('#btn-paper').remove();
    $contents.find('#removePDFPatents').remove();

    $contents.find("input").prop("disabled", true);
    $contents.find("select").prop("disabled", true);
    $contents.find("table").prop("disabled", true);
    $contents.find("textarea").prop("disabled", true);
    $contents.find("td").prop("disabled", true);
    $contents.find("#LevelTable").css("pointer-events", "none");
    $contents.find("#LevelTable").css("pointer-events", "none");
    $contents.find("#formStyle").removeClass("offset-md-3");

}