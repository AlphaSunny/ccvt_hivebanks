$(function () {
    let token = GetCookie('user_token');
    GetUsAccount();
    // let is_email = GetVerifyBindingInformation(token,"email");
    // if(is_email){
    //     console.log(is_email);
    //     SuccessPrompt("邮箱已绑定!");
    //     window.location.href = "security.html";
    // }

    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows, cellphone = "";
            $.each(data, function (i, val) {
                if (data[i].bind_name == 'email' && data[i].bind_flag == '1') {
                    SuccessPrompt("邮箱已绑定!");
                    window.location.href = "security.html";
                }
            });
        }
    }, function (response) {
        ErrorPrompt(response.errcode);
        return;
    });

    let _email = '', emailList = '';
    $('.emailEnable').click(function () {
        let text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1';
        if (text.length <= 0) {
            // LayerFun('emailNotEmpty');
            WarnPrompt("邮箱不能为空");
            return;
        }

        if (!IsEmail(text)) {
            WarnPrompt("邮箱格式错误");
            return;
        }

        _email = text.split('@')[1];
        let $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
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
        })
    });
    $('.GoEmailBtn').click(function () {
        window.open(emailList[_email]);
    });

    $("#email").bind("input propertychange", function () {
        if ($(this).val().length > 0) {
            $(".emailEnable").attr("disabled", false);
        }else {
            $(".emailEnable").attr("disabled", true);
        }
    })
});