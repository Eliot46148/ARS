var cookieData;
var isPass = false;
var comdata;

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
    var FormTypeN = comdata.FormTypeN;
    if(FormTypeN==1)
    {
        if(comdata.studyandData!=-1)
            $contents.find('input[name="isStudyandData"]').get(comdata.studyandData).checked = true;

    }
    else if (FormTypeN==2){
        if(comdata.Marketassessment!=-1)
            $contents.find('input[name="isMarketassessment"]').get(comdata.Marketassessment).checked = true;
        if(comdata.ManufacturingEvaluation!=-1)
            $contents.find('input[name="isManufacturingEvaluation"]').get(comdata.ManufacturingEvaluation).checked = true;
        if(comdata.FinancialEvaluation!=-1)
            $contents.find('input[name="isFinancialEvaluation"]').get(comdata.FinancialEvaluation).checked = true;
    }

    $contents.find('#theopinion').val(comdata.opinion);

    if(comdata.isSubmit!=-1)
        $contents.find('input[name="reviewIsPass"]').get(comdata.isSubmit).checked = true;
}

function loadfinish(){
    cookieData =JSON.parse($.cookie('committeeCookie'));
    $.cookie("committeeCookie","");
    $.post('/committee/GetID',{
        Oid : cookieData.objID
    },function(fdata){
        var retdata = fdata.data;
        var ReviewFormSrc ="";
        var useinload = retdata.needtestform[cookieData.index];
        comdata ={
            Email : retdata.email,
            Password :retdata.password,
            FormTypeN:useinload.fromType,
            studyandData:useinload.StudyandData,
            Marketassessment:useinload.Marketassessment,
            ManufacturingEvaluation:useinload.ManufacturingEvaluation,
            FinancialEvaluation:useinload.FinancialEvaluation,
            opinion:useinload.opinion,
            isSubmit:useinload.isSubmit
        }

        switch(comdata.FormTypeN){
            case 1:
                ReviewFormSrc ="./reviewT1";
                break;
            case 2:
                ReviewFormSrc ="./reviewT2";
                break;
        }
        $('#ReviewForm').attr('src',ReviewFormSrc);
    

        $.post("../form/testest",{
            email :  retdata.email,
            password : retdata.password,
            index : cookieData.index,
            FormId : retdata.formOid
        },function(sdata){
            var reviewsrc= "../form?TeacherNum="+sdata.data.TeacherNum+"&FormId="+sdata.data._id;
            $('#needReviewForm').attr('src', reviewsrc);
        })
    })
   
}

function backBtClick(){
    $.cookie("committeeCookie",JSON.stringify({objID:cookieData.objID}))
    window.history.back();
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
        email : comdata.Email,
        password : comdata.Password,
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
            backBtClick()
    })
}