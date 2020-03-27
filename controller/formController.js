var app = angular.module('form', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('formCtrl', ($scope, $http, $location) => {

    $scope.init = () => {
        $http.get('/form/data?FormId=' + $scope.FormId).then(
            (res) => {
                var data = res.data.data;
                console.log(data);
                if(data!=null){                    
                    $scope.ResearchTopic =data.ResearchTopic;
                    $scope.HIGHER=data.HIGHER;
                    $scope.Industry=data.Industry;
                    $scope.Industry5n=data.Industry5n;
                    $scope.Name=data.Name;
                    $scope.college=data.College;
                    $scope.department=data.Department;
                    $scope.Phone=data.Phone;
                    $scope.Email=data.Email;
                    $scope.description=data.Description;
                    $scope.evaluation=data.Evaluation;
                    chartData=data.ChartData;
                    $scope.Patent = data.Patent;
                    $scope.Paper = data.Paper;
                }                                
            },
            (err) => {
                console.log(err);
            }
        );
    }
    $scope.TeacherNum = $location.search().TeacherNum;

    $scope.FormId = $location.search().FormId;

    $scope.test = () => console.log($scope);

    $scope.save = () => {
        $http.put('/form?FormId='+$scope.FormId,
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
        $http.put('/form/submit?FormId='+$scope.FormId,
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
                console.log(res);
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
                $scope.patentName = '';
                $scope.patentCountry = '';
                patentCounter += 1;
            },
            error: function (res) {
                console.log(res);
                alert('送出失敗');
            }
        });
    }
    $scope.init();
});