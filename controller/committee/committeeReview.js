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
function reviewload()
{
    var $ifram = $('#ReviewForm');
    var $contents = $ifram.contents();
    var typeID = cookieData.FormType;
    if(typeID==1)
    {
        if(cookieData.studyandData!=-1)
            $contents.find('input[name="isStudyandData"]').get(cookieData.studyandData).checked = true;
    }
    else if (typeID==2){

        if(cookieData.Marketassessment!=-1)
            $contents.find('input[name="isMarketassessment"]').get(cookieData.Marketassessment).checked = true;
        if(cookieData.ManufacturingEvaluation!=-1)
            $contents.find('input[name="isManufacturingEvaluation"]').get(cookieData.ManufacturingEvaluation).checked = true;
        if(cookieData.FinancialEvaluation!=-1)
            $contents.find('input[name="isFinancialEvaluation"]').get(cookieData.FinancialEvaluation).checked = true;
    }

    $contents.find('#theopinion').val(cookieData.opinion);

    if(cookieData.isSubmit!=-1)
        $contents.find('input[name="reviewIsPass"]').get(cookieData.isSubmit).checked = true;
}

function loadfinish(){
    $('#needReviewForm').attr('src', "../form?&TeacherNum=1324654&FormId=5e7de5d5f7bf39164440937f");
//    src="../form?TeacherNum=1324654&FormId=5e7de5d5f7bf39164440937f"
    var ReviewFormSrc ="";
    cookieData =JSON.parse($.cookie('committeeCookie'));
    console.log(cookieData);

    switch(cookieData.FormType){
        case 1:
            ReviewFormSrc ="./reviewT1";
            break;
        case 2:
            ReviewFormSrc ="./reviewT2";
            break;
    }
    $('#ReviewForm').attr('src',ReviewFormSrc);

    var cookies = JSON.stringify({Email : cookieData.Email,Password : cookieData.Password})
    $.cookie("committeeCookie",cookies)
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
    var $ifram = $('#ReviewForm');
    var $contents = $ifram.contents();

    var isStudyandData= $contents.find('input:radio[name="isStudyandData"]:checked').val();
    var isMarketassessment= $contents.find('input:radio[name="isMarketassessment"]:checked').val();
    var isManufacturingEvaluation= $contents.find('input:radio[name="isManufacturingEvaluation"]:checked').val();
    var isFinancialEvaluation= $contents.find('input:radio[name="isFinancialEvaluation"]:checked').val();
    var reviewIsPass= $contents.find('input:radio[name="reviewIsPass"]:checked').val();
    var theopinion = $contents.find('#theopinion').val();
    $.post("/committee/committeeupdate",{
        email : cookieData.Email,
        password : cookieData.Password,
        //formOid : cookieData._OID,
        formOid : "asdfasdf",
        ispass : isPass,
        index : cookieData.index,
        StudyandData : (isStudyandData == undefined? -1:isStudyandData),
        reMarketassessment : (isMarketassessment == undefined? -1:isMarketassessment),
        ManufacturingEvaluation :(isManufacturingEvaluation== undefined? -1:isManufacturingEvaluation),
        FinancialEvaluation : (isFinancialEvaluation== undefined? -1:isFinancialEvaluation),
        opinion : theopinion,
        isSubmit : (reviewIsPass== undefined? -1:reviewIsPass)
    },function(data){
        if(data.status == 1)
            alert(data.msg);
        else
            window.history.back();
    })
}