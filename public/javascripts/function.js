$('#createNewFormBtn').click(function(){
    var _TeacherNum = $('#createNewFormNum').val();
    $.post("/form",
    {        
        'TeacherNum': _TeacherNum 
    },data=>window.location.assign('/form'))
    $.cookie('id', _TeacherNum);
});