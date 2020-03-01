$('#createNewFormBtn').click(function(){
    var _TeacherNum = $('#createNewFormNum').val();
    $.post("/form/create",
    {        
        'TeacherNum': _TeacherNum,        
    }, function (res) {
        alert(res.msg);
    });
    $.cookie('id', _TeacherNum);
    window.location.pathname = '/form.html';
});