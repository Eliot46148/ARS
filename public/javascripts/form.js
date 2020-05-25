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

var chartData = [0,0,0,0,0,0,0,0];

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

$('td.td1, td.td2').click(function () {
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
    chartData[chartCol-1]=chartRow;
    // console.log(`selected col: ${col}, row: ${row}, part:${part}`);    
    
    $('table tr td[class="' + part + ' table-info"]:nth-child(' + (col + 1) + ')').removeClass('table-info');
    $('table tr:nth-child(' + (row + 1) + ') td:nth-child(' + (col + 1) + ')[class="'+part+'"]').addClass('table-info');
});

// $('#college').change(function () {
//     $('#department').empty();
//     var selected = $('#college').find(":selected").text();
//     if (selected != '請選擇') {
//         $('#department').append("<option>請選擇</option>");
//         for (i in departmentDict[selected])
//             $('#department').append("<option>" + departmentDict[selected][i] + "</option>");
//     }
//     else
//         $('#department').append("<option>請先選擇學院</option>");
// });


$('.PatentInfoRadio').change(function () {
    $('#patentInfo').collapse('toggle');
});

$('.PaperInfoRadio').change(function () {
    $('#paperInfo').collapse('toggle');
});

$('#paperPublished').change(function () {
    $('#paperFileField').collapse('show');
});

$('.paperUnPublished').change(function () {
    $('#paperFileField').collapse('hide');
});
