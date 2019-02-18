$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();

    //Get graphic verification code
    GetImgCode();

    //Switch graphic verification code
    $('.getImgCodeBtn').click(function () {
        GetImgCode();
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        let country_code = $('.selected-dial-code').text().split("+")[1];
        let cellphone = $('#phone').val();
        let bind_type = '2', cfm_code = $('#phoneCfmCode').val();

        if (cellphone == '') {
            // LayerFun('phoneNotEmpty');
            WarnPrompt("请输入手机号码");
            return;
        }

        if (cfm_code <= 0) {
            // LayerFun('pleaseImgCode');
            WarnPrompt("请输入图形验证码");
            return;
        }
        ShowLoading("show");
        GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code);
    });

    //Binding fund password
    $('.fundPasswordEnable').click(function () {
        let hash_type = 'pass_hash',
            // Get country code
            country_code = $(".selected-flag").attr("title").split("+")[1],
            phone = country_code + '-' + $('#phone').val(),
            phoneCode = $('#phoneCode').val(),
            hash = hex_sha1($('#fundPassword').val()),
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password),
            confirm_pass_hash = hex_sha1($('#confirmPassword').val());
        if ($('#fundPassword').val().length <= 0) {
            // LayerFun('funPassNotEmpty');
            WarnPrompt("请输入资金密码");
            return;
        }

        if ($('#confirmPassword').val().length <= 0) {
            WarnPrompt("请输入确认资金密码");
            return;
        }

        if ($('#phone').val().length <= 0) {
            // LayerFun('phoneNotEmpty');
            WarnPrompt("请输入手机号码");
            return;
        }

        if ($('#phoneCode').val().length <= 0) {
            // LayerFun('codeNotEmpty');
            WarnPrompt("请输入手机验证码");
            return;
        }

        if (password.length <= 0) {
            // LayerFun('passNotEmpty');
            WarnPrompt("请输入登录密码");
            return;
        }
        //hashFund password binding
        let $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        Hash(token, hash_type, hash, pass_word_hash, confirm_pass_hash, phone, phoneCode, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                // LayerFun("modifySuccess");
                SuccessPrompt("修改成功");
                setInterval(() => {
                    window.location.href = 'security.html';
                }, 2000);
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            GetImgCode();
        })
    })
});
