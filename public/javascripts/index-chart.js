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
    if (row > 9) {
        row -= 11;
        col += 4;
    }    
    radarChart.data.datasets[0].data[col - 1] = row;
    radarChart.update();

    $('table tr:nth-child('+(row+1)+') td:nth-child('+(col+1)+')').css('font-size', '20px');
});

console.log($('table tr td:nth-child('+4+')'));