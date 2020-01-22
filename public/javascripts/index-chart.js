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

    //console.log($('table tr td[class="' + part + '"]:nth-child(' + (col + 1) + ')'));
    $('table tr td[class="' + part + ' table-info"]:nth-child(' + (col + 1) + ')').removeClass('table-info');
    $('table tr:nth-child(' + (row + 1) + ') td:nth-child(' + (col + 1) + ')').addClass('table-info');
});

