var app = angular.module('form', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('formCtrl', ($scope, $http, $location) => {
    $scope.init = () => {
        console.log($scope);
        $http.get('/form/data?FormId=' + $scope.FormId).then(
            (res) => {
                var data = res.data.data;
                if (data != null) {
                    $scope.ResearchTopic = data.ResearchTopic;
                    $scope.HIGHER = data.HIGHER;
                    $scope.HIGHER2 = data.HIGHER2;
                    $scope.Industry = data.Industry;
                    $scope.Industry2 = data.Industry2;
                    $scope.Industry5n = data.Industry5n;
                    $scope.Name = data.Name;
                    $scope.college = data.College;
                    $scope.department = data.Department;
                    $scope.Phone = data.Phone;
                    $scope.Email = data.Email;
                    $scope.description = data.Description;
                    $scope.appliedField = data.AppliedField;
                    $scope.industryEffect = data.IndustryEffect;
                    chartData = data.ChartData;
                    $scope.Patents = data.Patent;
                    $scope.Papers = data.Paper;
                    $scope.isCommercialization = data.IsCommercialization;
                    $scope.marketDemand = data.MarketDemand;
                    $scope.competitiveness = data.Competitiveness;
                    $scope.cost = data.Cost;
                    $scope.marketDemandFile = data.MarketDemandFile;
                    $scope.competitivenessFile = data.CompetitivenessFile;
                    $scope.costFile = data.CostFile;
                    $scope.marketDemandType = data.MarketDemandType;
                    $scope.competitivenessType = data.CompetitivenessType;
                    $scope.costType = data.CostType;
                    $scope.submitState = "Edit";

                    showImage(data.Image);
                    showProductImage(data.ProductImage);
                    showVideo(data.Video);
                    $scope.changeDepartments();
                    $scope.initPatentAndPaper();
                    $scope.initRadarChart();
                    $scope.initCommercializationRadios();
                }
            },
            (err) => {
                console.log(err);
                alert("載入表單錯誤!");
            }
        );
        $scope.patentName = "";
        $scope.patentCountry = "";
        $scope.patentStatus = false;
        $scope.paperName = "";
        $scope.paperJournal = false;
        $scope.paperStatus = false;
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
            $scope.HavePatents = 'Y';
        }
        else
            $scope.HavePatents = 'N';

        if ($scope.Papers.length > 0) {
            $('#paperInfo').collapse('toggle');
            $scope.HavePapers = 'Y';
        }
        else
            $scope.HavePapers = 'N';
    }

    /** Initialize the radar chart via data from DB*/
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
            }
        }
    }

    $scope.initCommercializationRadios = function () {
        if (!($scope.isCommercialization)) {
            $scope.isCommercialization = 'N';
            $scope.marketDemandType = 'file';
            $scope.competitivenessType = 'file';
            $scope.costType = 'file';
        }
    }

    $scope.save = () => {
        $http.put('/form?FormId=' + $scope.FormId,
            {
                'TeacherNum': $scope.TeacherNum,
                "ResearchTopic": $scope.ResearchTopic,
                "HIGHER": $scope.HIGHER,
                "HIGHER2": $scope.HIGHER2,
                "Industry": $scope.Industry,
                "Industry2": $scope.Industry2,
                "Industry5n": $scope.Industry5n,
                "Name": $scope.Name,
                "College": $scope.college,
                "Department": $scope.department,
                "Phone": $scope.Phone,
                "Email": $scope.Email,
                "Description": $scope.description,
                "AppliedField": $scope.appliedField,
                "IndustryEffect": $scope.industryEffect,
                "IsCommercialization": $scope.isCommercialization,
                "MarketDemand": $scope.marketDemand,
                "Competitiveness": $scope.competitiveness,
                "Cost": $scope.cost,
                "MarketDemandType": $scope.marketDemandType,
                "CompetitivenessType": $scope.competitivenessType,
                "CostType": $scope.costType,
                "SubmitDate": new Date(),
                "ChartData": chartData
            })
            .then((res) => {
                console.log(res);
                $('#saveModal').modal('show');
                $scope.sendMail();
            }, (err) => {
                alert(err.msg);
            });
    }

    $scope.submit = () => {
        switch ($scope.submitState) {
            case "Edit":
                $scope.submitState = "Check";
                $("html, body").animate({ scrollTop: 0 }, 500);
                break;
            case "Check":
                if (confirm("送出後無法再進行修改\n確認送出？")) {
                    $http.put('/form/submit?FormId=' + $scope.FormId,
                        {
                            'TeacherNum': $scope.TeacherNum,
                            "ResearchTopic": $scope.ResearchTopic,
                            "HIGHER": $scope.HIGHER,
                            "HIGHER2": $scope.HIGHER2,
                            "Industry": $scope.Industry,
                            "Industry2": $scope.Industry2,
                            "Industry5n": $scope.Industry5n,
                            "Name": $scope.Name,
                            "College": $scope.college,
                            "Department": $scope.department,
                            "Phone": $scope.Phone,
                            "Email": $scope.Email,
                            "Description": $scope.description,
                            "AppliedField": $scope.appliedField,
                            "IndustryEffect": $scope.industryEffect,
                            "IsCommercialization": $scope.isCommercialization,
                            "MarketDemand": $scope.marketDemand,
                            "Competitiveness": $scope.competitiveness,
                            "Cost": $scope.cost,
                            "MarketDemandType": $scope.marketDemandType,
                            "CompetitivenessType": $scope.competitivenessType,
                            "CostType": $scope.costType,
                            "SubmitDate": new Date(),
                            "ChartData": chartData
                        })
                        .then((res) => {
                            console.log(res);
                            alert("送出表單成功");
                            window.location.assign('/');
                        }, (err) => {
                            alert(err.msg);
                        });
                }
                break;
        }
    }

    $scope.delete = function () {
        if (confirm("刪除後將無法恢復，確認刪除？")) {
            $.ajax({
                url: "/form",
                type: 'delete',
                data: { "FormId": $scope.FormId },
                success: function (res) {
                    alert(res.msg);
                    if (res.status == "0") {
                        window.location.assign("/");
                    }
                },
                error: function (res) {
                    alert("系統發生錯誤");
                }
            });
        }
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
                alert("上傳失敗");
            }
        });
    });

    $('#productImage').change(() => {
        var formData = new FormData();
        formData.append('productImage', $("#productImage")[0].files[0]);
        var url = '/form/productImage?FormId=' + $scope.FormId;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    showProductImage(e.target.result);
                }
                reader.readAsDataURL($("#productImage")[0].files[0]);
                console.log(res);
            },
            error: function (res) {
                console.log(res);
                alert("上傳失敗");
            }
        });
    });

    $('#video').change(function () {
        if (Math.floor($('#video')[0].files[0].size / 1024 / 1024) > 100) {
            alert('影片超過限制大小(100MB)');
            return;
        };
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
        if (!$scope.IsPatentRequiredFieldValid()) return;
        else {
            let formData = new FormData();
            formData.append('myPatent', $('#patent-file')[0].files[0]);
            let url = `/form/patent?FormId=${$scope.FormId}&Name=${$scope.patentName}&Country=${$scope.patentCountry}&Status=${$scope.patentStatus}`;
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
                },
                complete: function () {
                    $scope.resetPatent();
                }
            });

            // else {
            //     let url = `/form/patent/nofile?FormId=${$scope.FormId}&Name=${$scope.patentName}&Country=${$scope.patentCountry}&Status=${$scope.patentStatus}`;
            //     $.ajax({
            //         url: url,
            //         type: 'patch',
            //         processData: false,
            //         contentType: false,
            //         success: function (res) {
            //             console.log(res);
            //             alert('送出成功');
            //             $('#addPatent').modal('hide');
            //             $scope.Patents.push(
            //                 {
            //                     _id: res.id,
            //                     Name: $scope.patentName,
            //                     Country: $scope.patentCountry,
            //                     Status: $scope.patentStatus,
            //                 }
            //             );
            //             $scope.$apply();
            //         },
            //         error: function (res) {
            //             console.log(res);
            //             alert('送出失敗');
            //         },
            //         complete: function () {
            //             $scope.resetPatent();
            //         }
            //     });
            // }
        }
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
        if (!$scope.IsPaperRequiredFieldValid()) return;
        else {
            let formData = new FormData();
            formData.append('myPaper', $('#paper-file')[0].files[0]);
            let url = `/form/paper?FormId=${$scope.FormId}&Name=${$scope.paperName}&Journal=${$scope.paperJournal}&Status=${$scope.paperStatus}`;
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
                },
                complete: function () {
                    $scope.resetPaper();
                }
            });

            // else {
            //     let url = `/form/paper/nofile?FormId=${$scope.FormId}&Name=${$scope.paperName}&Journal=${$scope.paperJournal}&Status=${$scope.paperStatus}`;
            //     $.ajax({
            //         url: url,
            //         type: 'patch',
            //         processData: false,
            //         contentType: false,
            //         success: function (res) {
            //             console.log(res);
            //             alert('送出成功');
            //             $('#addPaper').modal('hide');
            //             $scope.Papers.push(
            //                 {
            //                     _id: res.id,
            //                     Name: $scope.paperName,
            //                     Journal: $scope.paperJournal,
            //                     Status: $scope.paperStatus,
            //                 }
            //             );
            //             $scope.$apply();
            //         },
            //         error: function (res) {
            //             console.log(res);
            //             alert('送出失敗');
            //         },
            //         complete: function () {
            //             $scope.resetPaper();
            //         }
            //     });
            // }
        }
    }

    $scope.sendMail = function (id, state) {
        if ($scope.Email != null) {
            $http.get('/mailServerSecret/template/saveInfo').success(function (rawhtml) {
                let name = '未填寫';
                let topic = '未填寫';

                if ($scope.Name != null)
                    name = $scope.Name;

                if ($scope.ResearchTopic != null)
                    topic = $scope.ResearchTopic;

                html = rawhtml
                    .replace('{name}', name)
                    .replace('{topic}', topic)
                    .replace('{password}', $scope.FormId)
                    .replace('{url}', `http://localhost:3000/form?TeacherNum=${$scope.TeacherNum}&FormId=${$scope.FormId}`);

                $http.post('/mailServerSecret', {
                    'to': $scope.Email,
                    'subject': '研發能量展現平台-表單暫存資訊',
                    'html': html
                });
            });
        }
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

    $('#marketDemandFile').change(() => {
        var formData = new FormData();
        formData.append('marketDemandFile', $("#marketDemandFile")[0].files[0]);
        var url = '/form/marketDemandFile?FormId=' + $scope.FormId;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                $scope.marketDemandFile = res.data.MarketDemandFile;
                $scope.$apply();
                alert('上傳成功');
            },
            error: function (res) {
                console.log(res);
                alert("上傳失敗");
            }
        });
    });

    $('#competitivenessFile').change(() => {
        var formData = new FormData();
        formData.append('competitivenessFile', $("#competitivenessFile")[0].files[0]);
        var url = '/form/competitivenessFile?FormId=' + $scope.FormId;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                $scope.competitivenessFile = res.data.CompetitivenessFile;
                $scope.$apply();
                alert('上傳成功');
            },
            error: function (res) {
                console.log(res);
                alert("上傳失敗");
            }
        });
    });

    $('#costFile').change(() => {
        var formData = new FormData();
        formData.append('costFile', $("#costFile")[0].files[0]);
        var url = '/form/costFile?FormId=' + $scope.FormId;
        $.ajax({
            url: url,
            type: 'patch',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                $scope.costFile = res.data.CostFile;
                $scope.$apply();
                alert('上傳成功');
            },
            error: function (res) {
                console.log(res);
                alert("上傳失敗");
            }
        });
    });

    /** Validate the required fields of patent */
    $scope.IsPatentRequiredFieldValid = function () {
        if ($scope.patentName == "" || $scope.patentCountry == "" || $scope.Status == false) {
            alert("請輸入完整資訊");
            return false;
        }
        else if ($('#patent-file')[0].value == '') {
            alert("請上傳佐證資料");
            return false;
        }
        return true;
    };

    /** Validate the required fields of paper */
    $scope.IsPaperRequiredFieldValid = function () {
        if ($scope.paperName == "" || $scope.paperJournal == false || $scope.paperStatus == false) {
            alert("請輸入完整資訊");
            return false;
        }
        else if ($('#paper-file')[0].value == '') {
            alert("請上傳佐證資料");
            return false;
        }
        return true;
    };

    /** Reset the modal of patent */
    $scope.resetPatent = function () {
        $scope.patentName = "";
        $scope.patentCountry = "";
        $scope.patentStatus = false;
        $('#patent-file')[0].value = '';
        $scope.$apply();
    };

    /** Reset the modal of paper */
    $scope.resetPaper = function resetPaper() {
        $scope.paperName = "";
        $scope.paperJournal = false;
        $scope.paperStatus = false;
        $('#paper-file')[0].value = '';
        $scope.$apply();
    };

    $scope.resetVariable = function (x) {
        x = "";
    }

    $scope.cancelSubmit = function () {
        $scope.submitState = "Edit";
        $("html, body").animate({ scrollTop: 0 }, 500);
    }

    $scope.init();
});

function showImage(data) {
    if (data == null) return;
    $('#image-preview').attr('src', data);
    $('#image-preview').show();
    $('#image').prop('required', false);
}

function showProductImage(data) {
    if (data == null) return;
    $('#productImage-preview').attr('src', data);
    $('#productImage-preview').show();
}

function showVideo(data) {
    if (data == null) return;
    $('#video-preview').attr('src', data);
    $('#video-preview').show();
    $('#video').prop('required', false);
}