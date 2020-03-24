
$('#LoginButton').click(function (){
    var accountID = $('#accountID').val();
    var passwordID = $('#passwordID').val();
    $.post("/committee",{
        email : accountID,
        code : passwordID},
        function(data){
            //alert(data);
            if(data.status == 2)
            {
                alert("welcom : "+ data.data.formOid);
                window.location.href = "./review";

            }
            else
                alert(data.msg);
/*
            if (data != null && !err ){
                alert(Data);
                alert("welcom");
                window.location.href = "./review";
            }
            else 
            {
                alert(data.msg);
                alert("Data error");
                console.log(err);
            }*/
        })
});
