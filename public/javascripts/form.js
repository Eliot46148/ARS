var departmentDict = [];
departmentDict['機電學院'] = ['機電學院機電科技博士班', '製造科技研究所', '自動化科技研究所', '機械工程系(所)', '車輛工程系(所)', '能源與冷凍工程系(所)', '智慧自動化工程科(五年制專科部)'];
departmentDict['電資學院'] = ['電機工程系(所)', '電子工程系(所)', '光電工程系(所)', '資訊工程系(所)'];
departmentDict['工程學院'] = ['土木工程系', '分子科學與工程系', '環境工程與管理研究所', '資源工程研究所', '材料科學與工程研究所', '化學工程與生物科技系', '材料與資源工程系'];
departmentDict['管理學院'] = ['管理學院管理博士班', '資訊與財金管理系(所)', '工業工程與管理系(所)', '經營管理系(所)', 'EMBA', 'IMBA & IMFI'];
departmentDict['設計學院'] = ['設計學院博士班', '建築系', '工業設計系', '互動設計系(所)'];
departmentDict['人文與社會科學學院'] = ['技術及職業教育研究所', '智慧財產權研究所', '應用英文系(所)', '文化事業發展系(所)'];
departmentDict['體育室'] = ['體育室'];
departmentDict['通識中心'] = ['通識中心'];
departmentDict['師培中心'] = ['師培中心'];

var ctx = document.getElementById('myChart');
var marksData = {
    labels: ["需求成熟度", "市場成熟度", "投資成熟度", "製造成熟度", "技術成熟度", "組織成熟度", "科學成熟度", "社會貢獻成熟度"],
    datasets: [{
        backgroundColor: "rgba(0,200,200,0.2)",

        data: [0, 0, 0, 0, 0, 0, 0, 0],
    }]
};

var radarChart = new Chart(ctx, {
    type: 'radar',
    data: marksData,
    options: {
        title: {
            display: false,
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 9,
                min: 0,
                stepSize: 1,
                display: false
            },
            pointLabels: {
                fontSize: 18
            }
        }
    }
});
radarChart.options.legend.display = false;


$('td').click(function () {
    var $this = $(this);
    var col = $this.index();
    var row = $this.closest('tr').index();
    var chartRow;
    var chartCol;
    var part = '';
    if (row > 9) {
        chartRow = row - 11;
        chartCol = col + 4;
        part = 'td2';
    }
    else {
        chartRow = row;
        chartCol = col;
        part = 'td1';
    }
    radarChart.data.datasets[0].data[chartCol - 1] = chartRow;
    radarChart.update();
    
    $('table tr td[class="' + part + ' table-info"]:nth-child(' + (col + 1) + ')').removeClass('table-info');
    $('table tr:nth-child(' + (row + 1) + ') td:nth-child(' + (col + 1) + ')').addClass('table-info');
});

$('#college').change(function () {
    $('#department').empty();
    var selected = $('#college').find(":selected").text();
    if (selected != '請選擇') {
        $('#department').append("<option>請選擇</option>");
        for (i in departmentDict[selected])
            $('#department').append("<option>" + departmentDict[selected][i] + "</option>");
    }
    else
        $('#department').append("<option>請先選擇學院</option>");
});


$('.PatentInfoRadio').change(function () {
    $('#patentInfo').collapse('toggle');
});

$('.PaperInfoRadio').change(function () {
    $('#paperInfo').collapse('toggle');
});

// $('#image-file').change(function () {
//     readURL(this);
//     var formData = new FormData();
//     formData.append('myImage', this.files[0]);
//     var url = '/form/image/upload?id=' + $.cookie('id');
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function (res) {
//             console.log(res);
//         },
//         error: function (res) {
//             console.log(res);
//         }
//     });
// });

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $('#image-preview').attr('src', e.target.result);
//             $('#image-preview').show();
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }

// $('#video-file').change(function () {
//     $('#progress-bar').show();
//     var formData = new FormData();
//     file = this.files[0];
//     formData.append('myVideo', this.files[0]);
//     var url = '/form/video/upload?id=' + $.cookie('id');
//     $.ajax({
//         xhr: function () {
//             var xhr = new window.XMLHttpRequest();
//             xhr.upload.addEventListener("progress", function (evt) {
//                 if (evt.lengthComputable) {
//                     var percentComplete = evt.loaded / evt.total;
//                     percentComplete = parseInt(percentComplete * 100);
//                     console.log(percentComplete);             
//                     $('#progress-bar').css('width', percentComplete+'%');
//                 }
//             }, false);
//             return xhr;
//         },
//         url: url,
//         type: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function (res) {
//             console.log(res);
//             alert('影片上傳成功!');
//             fileUrl = window.URL.createObjectURL(file);
//             $('#video-preview').attr('src', fileUrl);
//             $('#video-preview').show();            
//         },
//         error: function (res) {
//             console.log(res);
//             alert('上傳失敗!');
//         }
//     });

// });

// $('#btn-test').click(function () {
//     $.cookie('id', '22222');
// });

// $('#btn-image').click(function () {
//     var img = $('#image-file');
//     var formData = new FormData();
//     formData.append('myImage', img[0].files[0]);
//     var url = '/form/image/upload?id=' + $.cookie('id');
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function (res) {
//             console.log(res);
//         },
//         error: function (res) {
//             console.log(res);
//         }
//     });
// });

// var patentCounter = 1;
// $('#btn-patent-upload').click(function () {
//     var _name = $('#patent-name');
//     var _country = $('#patent-country');
//     var _status = $("input[name='patentStatusRadio']:checked");
//     var _file = $('#patent-file');
//     var formData = new FormData();
//     formData.append('myPatent', _file[0].files[0]);
//     var url = `/form/patent/upload?id=${$.cookie('id')}&Name=${_name.val()}&Country=${_country.val()}&Status=${_status.val()}`;
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function (res) {
//             console.log(res);
//             alert('送出成功');
//             $('#addPatent').modal('hide');
//             $('#patent-table').append(`<tr><th scope="row">${patentCounter}</th><td>${_name.val()}</td><td>${_country.val()}</td><td>申請中</td><td>點選</td><td>點選</td><td>點選</td></tr>`);
//             _name.val('');
//             _country.val('');
//             patentCounter += 1;
//         },
//         error: function (res) {
//             console.log(res);
//             alert('送出失敗');
//         }
//     });
// });