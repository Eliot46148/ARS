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
                if (data != null) {
                    $scope.ResearchTopic = data.ResearchTopic;
                    $scope.HIGHER = data.HIGHER;
                    $scope.Industry = data.Industry;
                    $scope.Industry5n = data.Industry5n;
                    $scope.Name = data.Name;
                    $scope.college = data.College;
                    $scope.department = data.Department;
                    $scope.Phone = data.Phone;
                    $scope.Email = data.Email;
                    $scope.description = data.Description;
                    $scope.evaluation = data.Evaluation;
                    chartData = data.ChartData;
                    $scope.Patents = data.Patent;
                    $scope.Papers = data.Paper;
                    showImage(data.Image);
                    showVideo(data.Video);
                    $scope.changeDepartments();
                    $scope.initPatentAndPaper();
                    $scope.initRadarChart();
                }
            },
            (err) => {
                console.log(err);
                alert("載入表單錯誤!");
            }
        );
    }
    $scope.TeacherNum = $location.search().TeacherNum;

    $scope.FormId = $location.search().FormId;

    $scope.changeDepartments = () => {
        if ($scope.college != '請選擇') {
            $scope.departments = departmentDict[$scope.college];
        }
        else
            $scope.departments = ['請先選擇學院'];
    }

    $scope.initPatentAndPaper = () => {
        if ($scope.Patents.length > 0) {
            $('#patentInfo').collapse('toggle');
            $scope.HavePatents = '有';
        }
        else
            $scope.HavePatents = '無';

        if ($scope.Papers.length > 0) {
            $('#paperInfo').collapse('toggle');
            $scope.HavePapers = '有';
        }
        else
            $scope.HavePapers = '無';
    }

    $scope.initRadarChart = () => {
        if (chartData != null) {
            var col;
            var row;
            var part = "";
            for (var chartCol = 0; chartCol < chartData.length; chartCol++) {
                radarChart.data.datasets[0].data[chartCol] = chartData[chartCol];
                radarChart.update();
                if (chartCol > 3) {
                    row = chartData[chartCol] + 11;
                    col = chartCol - 3;
                    part = 'td2';
                }
                else {
                    row = chartData[chartCol];
                    col = chartCol + 1;
                    part = 'td1';
                }
                $('table tr td[class="' + part + ' table-info"]:nth-child(' + (col + 1) + ')').removeClass('table-info');
                $('table tr:nth-child(' + (row + 1) + ') td:nth-child(' + (col + 1) + ')[class="' + part + '"]').addClass('table-info');
                // console.log(`col: ${col}, row: ${row}, part:${part}`);
            }
        }
    }

    $scope.test = () => console.log($scope);

    $scope.save = () => {
        $http.put('/form?FormId=' + $scope.FormId,
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "Industry": $scope.Industry,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.name,
                "College": $scope.college,
                "Department": $scope.department,
                "Phone": $scope.Phone,
                "Email": $scope.Email,
                "Description": $scope.description,
                "Evaluation": $scope.evaluation,
                "ChartData": chartData
            })
            .then((res) => {
                console.log(res);
                alert("暫存成功");
            }, (err) => {
                alert(err.msg);
            });
    }

    $scope.submit = () => {
        $http.put('/form/submit?FormId=' + $scope.FormId,
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "Industry": $scope.Industry,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.Name,
                "College": $scope.college,
                "Department": $scope.department,
                "Phone": $scope.Phone,
                "Email": $scope.Email,
                "Description": $scope.description,
                "Evaluation": $scope.evaluation,
                "ChartData": chartData,
                "Submitted": true
            })
            .then((res) => {
                console.log(res);
                alert("送出成功");
                window.location.assign('/');
            }, (err) => {
                alert(err.msg);
            });
    }

    $('#image').change(() => {
        var formData = new FormData();
        formData.append('myImage', $("#image")[0].files[0]);
        var url = '/form/image?FormId=' + $scope.FormId;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    showImage(e.target.result);
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
        var url = '/form/video?FormId=' + $scope.FormId;
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
                showVideo(fileUrl);
            },
            error: function (res) {
                console.log(res);
                alert('上傳失敗!');
            }
        });
    });

    $scope.UploadPatent = () => {
        var formData = new FormData();
        formData.append('myPatent', $('#patent-file')[0].files[0]);
        var url = `/form/patent?FormId=${$scope.FormId}&Name=${$scope.patentName}&Country=${$scope.patentCountry}&Status=${$scope.patentStatus}`;
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
                $scope.Patents.push(
                    {
                        _id: res.id,
                        Name: $scope.patentName,
                        Country: $scope.patentCountry,
                        Status: $scope.patentStatus,
                        File: res.filename
                    }
                );
                $scope.$apply();
            },
            error: function (res) {
                console.log(res);
                alert('送出失敗');
            }
        });
    }

    $scope.removePatent = (patentIndex) => {
        var url = `/form/patent?FormId=${$scope.FormId}&PatentId=${$scope.Patents[patentIndex]._id}`;
        $.ajax({
            url: url,
            type: 'delete',
            data: null,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                alert('移除成功');
                $scope.Patents.splice(patentIndex, 1);
                $scope.$apply();
            },
            error: function (res) {
                console.log(res);
                alert('移除失敗');
            }
        });
    };

    $scope.UploadPaper = () => {
        var formData = new FormData();
        formData.append('myPaper', $('#paper-file')[0].files[0]);
        var url = `/form/paper?FormId=${$scope.FormId}&Name=${$scope.paperName}&Journal=${$scope.paperJournal}&Status=${$scope.paperStatus}`;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                alert('送出成功');
                $('#addPaper').modal('hide');
                $scope.Papers.push(
                    {
                        _id: res.id,
                        Name: $scope.paperName,
                        Journal: $scope.paperJournal,
                        Status: $scope.paperStatus,
                        File: res.filename
                    }
                );
                $scope.$apply();
            },
            error: function (res) {
                console.log(res);
                alert('送出失敗');
            }
        });
    }

    $scope.removePaper = (patentIndex) => {
        var url = `/form/paper?FormId=${$scope.FormId}&PaperId=${$scope.Papers[patentIndex]._id}`;
        $.ajax({
            url: url,
            type: 'delete',
            data: null,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                alert('移除成功');
                $scope.Papers.splice(patentIndex, 1);
                $scope.$apply();
            },
            error: function (res) {
                console.log(res);
                alert('移除失敗');
            }
        });
    };
    $scope.init();
});

function showImage(data) {
    if (data == null) return;
    $('#image-preview').attr('src', data);
    $('#image-preview').show();
}

function showVideo(data) {
    if (data == null) return;
    $('#video-preview').attr('src', data);
    $('#video-preview').show();
}