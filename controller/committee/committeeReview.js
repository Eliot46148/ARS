function loadfinish(){
    var $ifram = $('#needReviewForm');
    var $contents = $ifram.contents();
    $contents.find('#teachernum').remove();
    $contents.find('#formid').remove();
    $contents.find('#savebt').remove();
    $contents.find('#submitbt').remove();
    var typeID = 1;
    var reviewFormHtml = "<div class =' container text-center'><h1>審查表</h1></div><table class='table table-bordered'>";
    if(typeID ==1)
    {
        reviewFormHtml +="<tr><th scope='row' >研究資料與佐證資料是否相符</th>";
        reviewFormHtml +="<td colspan='3'><input type='radio' name='datachack' id = 'dataIsTrue' value='True'> 符合</<td>";
        reviewFormHtml +="<td colspan='3'><input type='radio' name='datachack' id = 'dataIsFalse' value='False'> 不符合</<td></tr>";
        reviewFormHtml +="<tr><th scope='row' >審查意見填寫</th>";
        reviewFormHtml +="<td colspan='6' height=220px><textarea style ='width:100%;height:200px;'></textarea></td></tr>";
        reviewFormHtml +="<tr><th scope='row' >總體審查意見</th>";
        reviewFormHtml +="<td colspan='2'><input type='radio' name='reviewIsPass' id = 'isPass' value='pass'> 建議</<td>";
        reviewFormHtml +="<td colspan='2'><input type='radio' name='reviewIsPass' id = 'isFaile' value='faile'> 不建議</<td>";
        reviewFormHtml +="<td colspan='2'><input type='radio' name='reviewIsPass' id = 'ismodify' value='modify'> 修改</<td></tr>";
    }
    else if (typeID == 2)
    {

    }
    $(reviewForm).html(reviewFormHtml);
}