var app = angular.module('form', []);

app.controller('formCtrl', ($scope, $http) => {
    $scope.test = () => console.log($scope);
    $scope.TeacherNum = $.cookie('id') != null ? $.cookie('id') : '請從/function進入';
    $scope.save = () => {
        $http.put('/form',
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "Industry": $scope.Industry,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.name,
                "College": $scope.college,
                "Department": $scope.department,
                "Phone": $scope.phone,
                "Email": $scope.email,
                "Description": $scope.description,
                "Evaluation": $scope.evaluation,
                "ChartData": chartData
            })
            .then((res) => console.log(res), (err) => alert(err.msg));
    }
    $scope.submit = () => {
        $http.put('/form/submit',
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "Industry": $scope.Industry,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.name,
                "College": $scope.college,
                "Department": $scope.department,
                "Phone": $scope.phone,
                "Email": $scope.email,
                "Description": $scope.description,
                "Evaluation": $scope.evaluation,
                "ChartData": chartData                
            })
            .then((res) => console.log(res), (err) => alert(err.msg));
    }
    $('#image').change(() => {
        var formData = new FormData();
        formData.append('myImage', $("#image")[0].files[0]);
        var url = '/form/image?TeacherNum=' + $.cookie('id');
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#image-preview').attr('src', e.target.result);
                    $('#image-preview').show();
                }
                reader.readAsDataURL($("#image")[0].files[0]);
            },
            error: function (res) {
                console.log(res);
            }
        });
    });
    $('#video').change(function () {
        $('#progress-bar').show();
        var formData = new FormData();
        formData.append('myVideo', $('#video')[0].files[0]);
        var url = '/form/video?TeacherNum=' + $.cookie('id');
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        console.log(percentComplete);
                        $('#progress-bar').css('width', percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                fileUrl = window.URL.createObjectURL($('#video')[0].files[0]);
                $('#video-preview').attr('src', fileUrl);
                $('#video-preview').show();
            },
            error: function (res) {
                console.log(res);
                alert('上傳失敗!');
            }
        });
    });
    var patentCounter = 1;
    $scope.UploadPatent = () => {
        var formData = new FormData();
        formData.append('myPatent', $('#patent-file')[0].files[0]);
        var url = `/form/patent?TeacherNum=${$scope.TeacherNum}&Name=${$scope.patentName}&Country=${$scope.patentCountry}&Status=${$scope.patentStatus}`;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                alert('送出成功');
                $('#addPatent').modal('hide');
                $('#patent-table').append(`<tr><th scope="row">${patentCounter}</th><td>${$scope.patentName}</td><td>${$scope.patentCountry}</td><td>${$scope.patentStatus}</td><td><a href=./files/${res.filename} target="_blank">點選</a></td><td>點選</td><td>點選</td></tr>`);
                $scope.patentName='';
                $scope.patentCountry='';
                patentCounter += 1;
            },
            error: function (res) {
                console.log(res);
                alert('送出失敗');
            }
        });
    };
});