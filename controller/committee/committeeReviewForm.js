var app = angular.module('form', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('formCtrl', ($scope, $http, $location) => {
    $scope.init = () => {
        var urlDt = $location.$$search;
        console.log(urlDt);
        $http.get('/form/testest?email=' + urlDt.email + '&password=' + urlDt.password + '&index=' + urlDt.index).then(
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
                    $scope.evaluation = data.Evaluation;
                    chartData = data.ChartData;
                    for (var i = 0; i < data.Patent.length; i++) {
                        data.Patent[i].File = "../" + data.Patent[i].File;
                    }
                    $scope.Patents = data.Patent;
                    for (var i = 0; i < data.Paper.length; i++) {
                        data.Paper[i].File = "../" + data.Paper[i].File;
                    }
                    $scope.Papers = data.Paper;
                    $scope.marketDemand = data.MarketDemand;
                    $scope.competitiveness = data.Competitiveness;
                    $scope.cost = data.Cost;
                    $scope.marketDemandFile = "../"+data.MarketDemandFile;
                    $scope.competitivenessFile = "../"+data.CompetitivenessFile;
                    $scope.costFile = "../"+data.CostFile;
                    $scope.marketDemandType = data.MarketDemandType;
                    $scope.competitivenessType = data.CompetitivenessType;
                    $scope.isCommercialization = data.IsCommercialization;
                    $scope.costType = data.CostType;
                    showImage(data.Image);
                    showVideo(data.Video);
                    $scope.changeDepartments();
                    $scope.initPatentAndPaper();
                    $scope.initRadarChart();
                    $scope.initCommercializationRadio();
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

    $scope.initCommercializationRadio = function () {
        console.log($scope.isCommercialization)
        if ($scope.isCommercialization == "是") {
            $('#CommercializationPanel').collapse('toggle');
            if ($scope.marketDemandType == "檔案") {
                $('#marketDemandFileField').collapse('show');
            }
            else {
                $scope.marketDemandType = "文字";
                $('#marketDemandTextField').collapse('show');
            }
            if ($scope.competitivenessType == "檔案") {
                $('#competitivenessFileField').collapse('show');
            }
            else {
                $scope.competitivenessType = "文字";
                $('#competitivenessTextField').collapse('show');
            }
            if ($scope.costType == "檔案") {
                $('#costFileField').collapse('show');
            }
            else {
                $scope.costType = "文字"
                $('#costTextField').collapse('show');
            }
        }
        else
            $scope.isCommercialization = "否";
    };

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
        else if ($scope.patentStatus == "已核准" && $('#patent-file')[0].value == '') {
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
        else if ($scope.paperStatus == "已發表" && $('#paper-file')[0].value == '') {
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

    $scope.init();
});

function showImage(data) {
    if (data == null) return;
    $('#image-preview').attr('src', "../" + data);
    $('#image-preview').show();
    $('#image').prop('required', false);
}

function showVideo(data) {
    if (data == null) return;
    $('#video-preview').attr('src', "../" + data);
    $('#video-preview').show();
    $('#video').prop('required', false);
}