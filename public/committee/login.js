$(function(){
    $('#LoginButton').click(function(){
        var password = $('#passwordID').val();
        var account = $('#accountID').val();
        alert(account + "--"+password);
    })
})
