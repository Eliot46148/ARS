var cookieData;
var isPass = false;
function frameload()
{
    var $ifram = $('#needReviewForm');
    var $contents = $ifram.contents();
    $contents.find('#teachernum').remove();
    $contents.find('#formid').remove();
    $contents.find('#savebt').remove();
    $contents.find('#submitbt').remove();
}

function loadfinish(){
    $('#needReviewForm').attr('src', "../form?&TeacherNum=1324654&FormId=5e7de5d5f7bf39164440937f");
//    src="../form?TeacherNum=1324654&FormId=5e7de5d5f7bf39164440937f"

    cookieData =JSON.parse($.cookie('committeeCookie'));
    alert(cookieData._OID);
    var reviewFormHtml = "<div class =' container text-center'><h1>審查表</h1></div><table class='table table-bordered'>";
    if(cookieData.FormType ==1)
    {
        reviewFormHtml +=`
        <tr>
            <th scope='row' >研究資料與佐證資料是否相符</th>
            <td colspan='3'><input type='radio' name='isStudyandData' value='True'> 符合</<td>
            <td colspan='3'><input type='radio' name='isStudyandData' value='False'> 不符合</<td>
        </tr>
        `;
    }
    else if (cookieData.FormType == 2)
    {
        reviewFormHtml +=`
        <tr>
            <th scope='row' >市場評估</th>
            <td colspan='3'><input type='radio' name='isMarketassessment' value='True' >符合</<td>
            <td colspan='3'><input type='radio' name='isMarketassessment' value='False'> 不符合</<td>
        </tr>
        <tr>
            <th scope='row' >製造評估</th>
            <td colspan='3'><input type='radio' name='isManufacturingEvaluation' value='True'>符合</<td>
            <td colspan='3'><input type='radio' name='isManufacturingEvaluation' value='False'> 不符合</<td>
        </tr>
        <tr>
            <th scope='row' >財務評估</th>
            <td colspan='3'><input type='radio' name='isFinancialEvaluation' value='True'>符合</<td>
            <td colspan='3'><input type='radio' name='isFinancialEvaluation' value='False'> 不符合</<td>
        </tr>`;
    }
    reviewFormHtml += `
    <tr>
        <th scope='row' >審查意見填寫</th>
        <td colspan='6' height=220px><textarea style ='width:100%;height:200px;' id = 'theopinion'></textarea></td>
    </tr>
    <tr>
        <th scope='row' >總體審查意見</th>
        <td colspan='2'><input type='radio' name='reviewIsPass' value='pass'> 建議</<td>
        <td colspan='2'><input type='radio' name='reviewIsPass' value='faile'> 不建議</<td>
        <td colspan='2'><input type='radio' name='reviewIsPass' value='modify'> 修改</<td>
    </tr>
    `;
    $(reviewForm).html(reviewFormHtml);
    loadReview();

    var cookies = JSON.stringify({Email : cookieData.Email,Password : cookieData.Password})
    $.cookie("committeeCookie",cookies)
}

function loadReview(){
    var typeID = cookieData.FormType;
    if(typeID==1){
        if(cookieData.studyandData!=-1)
            $('input[name="isStudyandData"]')[cookieData.studyandData].checked = true;
    }
    else if (typeID==2){
        if(cookieData.Marketassessment!=-1)
            $('input[name="isMarketassessment"]')[cookieData.Marketassessment].checked = true;
        if(cookieData.ManufacturingEvaluation!=-1)
            $('input[name="isManufacturingEvaluation"]')[cookieData.ManufacturingEvaluation].checked = true;
        if(cookieData.FinancialEvaluation!=-1)
            $('input[name="isFinancialEvaluation"]')[cookieData.FinancialEvaluation].checked = true;
    }
    $(theopinion).val(cookieData.opinion);
    if(cookieData.isSubmit!=-1)
    $('input[name="reviewIsPass"]')[cookieData.isSubmit].checked = true;

}

function saveBtClick(){
    isPass = false;
    UpdateDB();
}

function submitBtClick(){
    isPass = true;
    UpdateDB();
}

function UpdateDB(){

}