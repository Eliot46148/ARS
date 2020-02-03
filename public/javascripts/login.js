$('#btn-login').click(function () {
    var _account = $('#account').val();
    var _passwd = $('#password').val();
    if (!_account || !_passwd)
        alert('請輸入未填欄位');
    else {
        $.post("/auth/login", { 'account': _account, 'password': _passwd }, function (res) {
            if (res.status == 1)
                alert(res.msg);
            else {
                alert(res.msg);
            }
        });
    }
});