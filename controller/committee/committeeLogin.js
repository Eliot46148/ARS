$('#LoginButton').click(function (){
    var accountID = $('#accountID').val();
    var passwordID = $('#passwordID').val();
    $.post("/committee",{
        email : accountID,
        code : passwordID},
        function(data){
            if(data.status == 2)
            {
                $.cookie('committeeCookie', JSON.stringify({Email : data.data.email, Password : data.data.password}));
                window.location.href = "./dashboard";
            }
            else
                alert(data.msg);
   })
});
