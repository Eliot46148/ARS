var app = angular.module('progress', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('progressCtrl', ($scope, $http, $location, $window) => {
    $scope.init = () => {
        $scope.statusDict = ['暫存中', '已送出', '審查中', '需修改', '未獲推薦', '推薦'];
        $scope.TeacherNum = $location.search().TeacherNum;
        $http.get('/form/progress?TeacherNum=' + $scope.TeacherNum).then(
            (res) => {
                $scope.forms = res.data.data;
                console.log(res);
            },
            (err) => {
                alert('資料載入錯誤!');
            }
        );
        console.log($scope);
    }

    $scope.triggerRespond = function (id, state = 0) {
        if (state == 0) {
            $scope.respond = [];
            $http.post('/committee/getFormExam', { 'formId': id }).success(function (data) {
                //console.log(data);
                $scope.triggerRespond.id = id;
                $scope.respond = data.data;
            });
        }
        else {
        }
    };
    $scope.seeRespond = function (opinion, isSubmit, state = 0) {
        if (state == 0) {
            // $scope.respond = [];
            $scope.opinion = opinion;
            $scope.isSubmit = isSubmit;
            $('#reviewModal').modal('show');
        }
        else {
            $('#reviewModal').modal('hide');
        }
        // var found = $scope.respond.find(element => element._id == id);
        // if (found != null) {
        //     $window.open('/static/review.html?' + new URLSearchParams(found).toString(), '_blank');
        // }
    };
    $scope.init();
});