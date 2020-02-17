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

$('#btn-submit').click(function () {
    var _ResearchTopic = $('#ResearchTopic').val();
    var _Higher = $('#HIGHER').val();
    var _Industry = $('#Industry').val();
    var _Industry5n = $('#Industry5n').val();
    var _Name = $('#Name').val();
    var _college = $('#college').val();
    var _department = $('#department').val();
    var _TeacherNum = $('#TeacherNum').val();
    var _Phone = $('#Phone').val();
    var _Email = $('#Email').val();
    var _description = $('#description').val();
    var _evaluation = $('#evaluation').val();

    console.log([_Higher]);
    $.post("/form/save",
        {
            'ResearchTopic' :_ResearchTopic,
            'HIGHER': _Higher,                       
            'Industry':_Industry,
            'Industry5n': _Industry5n,
            'Name': _Name,
            'College': _college,
            'Department': _department,
            'TeacherNum': _TeacherNum,
            'Phone': _Phone,
            'Email':_Email,
            'Description':_description,
            'Evaluation':_evaluation
        }, function (res) {
            alert(res.msg);
        });
});

$('#btn-patent').click(function () {
    var _name = $('#patent-name').val();
    var _country = $('#patent-country').val();
    var _status = $("input[name='patentStatusRadio']:checked").val();
    var _pdf = $('#patent-file').prop('files')[0];
    console.log([_name, _country, _status, _pdf]);

    $.post("/form/patent/save", { 'Name': _name, 'Country': _country, 'Status': _status, 'Pdf': _pdf }, function (res) {
        if (res.status == 1)
            alert(res.msg);
        else {
            alert(res.msg);
        }
    });

});