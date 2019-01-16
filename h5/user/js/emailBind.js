$(function () {
    var token = GetCookie('user_token');
    GetUsAccount();

    var _email = '', emailList = '';
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if (text.length <= 0) {
            // LayerFun('emailNotEmpty');
            WarnPrompt("邮箱不能为空");
            return;
        }

        if(!IsEmail(text)){
            WarnPrompt("邮箱格式错误");
            return;
        }

        if (password.length <= 0) {
            // LayerFun('passNotEmpty');
            WarnPrompt("密码不能为空");
            return;
        }
        _email = text.split('@')[1];
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash,
            function (response) {
            WarnPrompt(response.errmsg);
            console.log(response.errmsg);
            console.log(response.errcode);
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                emailList = EmailList();
                $('#goEmailVerify').modal('show');
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            // LayerFun(response.errmsg);
            ErrorPrompt(response.errmsg);
                console.log(response.errmsg);
        })
    });
    $('.GoEmailBtn').click(function () {
        window.open(emailList[_email]);
    })
});