$(function () {
    //get user token
    var token = GetCookie('user_token');
    GetUsAccount();

    var wi_bindPhone = GetQueryString('wi_bindPhone');

    //Get graphic verification code
    GetImgCode();

    //Switch graphic verification code
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $('#phone').val();
        var bind_type = '2', $this = $(this), cfm_code = $('#phoneCfmCode').val();

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

        GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code);
    });

    $('.phoneEnable').click(function () {
        // Get country code
        var country_code = $('.selected-dial-code').text().split("+")[1],
            text_type = '4',
            text = country_code + '-' + $('#phone').val(),
            text_hash = $('#phoneCode').val();
        if ($('#phone').val().length <= 0) {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('#phoneCode').val().length <= 0) {
            LayerFun('codeNotEmpty');
            return;
        }

        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#phone').val('');
                $('#phoneCode').val('');
                $('#password').val('');
                LayerFun('bindSuccess');
                if (wi_bindPhone != 'wi_bindPhone') {
                    window.location.href = 'security.html';
                } else {
                    window.location.href = '../ba/BaWithdraw.html';
                }
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            GetImgCode();
        })
    })

});