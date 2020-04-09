function loadfinish(){
    var $ifram = $('#needReviewForm');
    var $contents = $ifram.contents();
    $contents.find('#teachernum').remove();
    $contents.find('#formid').remove();
    $contents.find('#savebt').remove();
    $contents.find('#submitbt').remove();
    var typeID = 2;
    var reviewFormHtml = "<div class =' container text-center'><h1>審查表</h1></div><table class='table table-bordered'>";
    if(typeID ==1)
    {
        reviewFormHtml +=`
        <tr>
            <th scope='row' >研究資料與佐證資料是否相符</th>
            <td colspan='3'><input type='radio' name='isStudyandData' value='True'> 符合</<td>
            <td colspan='3'><input type='radio' name='isStudyandData' value='False'> 不符合</<td>
        </tr>
        `;
    }
    else if (typeID == 2)
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
    loadReview(typeID);
}

function loadReview(typeID,reqData){
    if(typeID==1){
        if(reqData.StudyandData!=-1)
            $('input[name="isStudyandData"]')[reqData.StudyandData].checked = true;
    }
    else if (typeID==2){
        if(reqData.Marketassessment!=-1)
            $('input[name="isMarketassessment"]')[reqData.Marketassessment].checked = true;
        if(reqData.ManufacturingEvaluation!=-1)
            $('input[name="isManufacturingEvaluation"]')[reqData.Marketassessment].checked = true;
        if(reqData.FinancialEvaluation!=-1)
            $('input[name="isFinancialEvaluation"]')[reqData.Marketassessment].checked = true;
    }
    $(theopinion).val= reqData.theopinion;
    if(reqData.reviewIsPass!=-1)
    $('input[name="reviewIsPass"]')[reqData.reviewIsPass].checked = true;

}
