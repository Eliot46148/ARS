function loadfinish(){
    var $ifram = $('#needReviewForm');
    var $contents = $ifram.contents();
    $contents.find('#teachernum').remove();
    $contents.find('#formid').remove();
    $contents.find('#savebt').remove();
    $contents.find('#submitbt').remove();


}