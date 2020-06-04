$('#LoginButton').click(function (){
    var accountID = $('#accountID').val();
    var passwordID = $('#passwordID').val();
    $.post("/committee",{
        email : accountID,
        code : passwordID},
        function(data){
            if(data.status == 2)
            {
                $.cookie('committeeCookie', JSON.stringify({objID : data.data._id}));
                window.location.href = "./dashboard";
            }
            else
                alert(data.msg);
   })
});


var hashParams = window.location.hash.substr(1).split('&'); // substr(1) to remove the `#`
for(var i = 0; i < hashParams.length; i++){
    var p = hashParams[i].split('=');
    document.getElementById(p[0]).value = decodeURIComponent(p[1]);;
}