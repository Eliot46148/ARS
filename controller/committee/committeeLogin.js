
$('#LoginButton').click(function (){
    var ID = $('#accountID').val();
    var password = $('#passwordID').val();
    $.post("/committee",{
        email : ID,
        code : password},
        function(err,Data){
            if (Data != null && !err ){
                alert("welcom");
                window.location.href = "./review";
            }
            else 
            {
                alert("Data error");
                console.log(err);
            }
        });
});
