$(function () {
    //get invite
    let invite_code = GetQueryString("invite_code");
    let code = GetQueryString("code");
    let group_id = GetQueryString("group_id");
    if (invite_code && invite_code != 0) {
        $(".emailInviteCode,.phoneInviteCode").val(invite_code);
    }

    if (code && code != "null") {
        GetWeChatName(code, function (response) {
            if (response.errcode == "0") {
                $(".phoneWeChatName").val(response.wechat);
                $(".phoneWeChatNameBox").removeClass("none");
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        });
    }

    //Whether to allow registration
    let type = 'us';
    RegisterSwitch(type, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            if (data[0].option_name == 'user_lock' && data[0].is_open == '0') {
                $('.register_box').remove();
                $('.form_col').html('<h2 style="color: #fff" class="i18n font-weight-400" name="unableRegister"></h2>');
                execI18n();
                return;
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    GetImgCode();

    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    // Switch mailbox and mobile registration
    $('.registerToggle').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // Switch mailbox registration
    $('.emailRegister').click(function () {
        $(".phone_box").addClass("none");
        $(".email_box").removeClass("none");
        $(".register_btn").removeClass("phoneRegisterBtn").addClass("emailRegisterBtn");
    });
    // Switch phone registration
    $('.phoneRegister').click(function () {
        $(".phone_box").removeClass("none");
        $(".email_box").addClass("none");
        $(".register_btn").removeClass("emailRegisterBtn").addClass("phoneRegisterBtn");
        GetImgCode();
    });

    // Monitor mailbox registration input
    //emailInput
    $("#email").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".accountNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        }
        if (!IsEmail($(this).val())) {
            $(".alert-warning").fadeIn();
            $(".emailErrorTips").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //password input
    $("#password").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".passwordNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else if ($(this).val().length < 8) {
            $(".alert-warning").fadeIn();
            $(".PasswordStructure").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //again password input
    $("#againPassword").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".confirmPasswordNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else if ($(this).val() != $("#password").val()) {
            $(".alert-warning").fadeIn();
            $(".TwoPassword").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    // ========email registration========
    let _email = '', emailList = '';
    $('.emailRegisterBtn').click(function () {
        let email = $('#email').val(),
            pass_word = $('#password').val(),
            againEmailPassword = $('#againPassword').val(),
            pass_word_hash = hex_sha1(pass_word),
            invite_code = $('#inviteCode').val(),
            wechat = $("#weChatName").val();

        if (email.length <= 0) {
            // LayerFun('emailNotEmpty');
            layer.msg("请输入账号", {icon: 0});
            return;
        }
        if (!IsEmail(email)) {
            layer.msg("邮箱格式错误", {icon: 0});
            return;
        }
        if (pass_word.length <= 0) {
            // LayerFun('passNotEmpty');
            layer.msg("请输入密码", {icon: 0});
            return;
        }
        if (againEmailPassword.length <= 0) {
            // LayerFun('confirmPasswordNotEmpty');
            layer.msg("请输入确认密码", {icon: 0});
            return;
        }
        if (pass_word != againEmailPassword) {
            // LayerFun('TwoPassword');
            layer.msg("两次密码必须相同", {icon: 0});
            return;
        }

        _email = email.split('@')[1];
        emailList = EmailList();

        let $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        EmailRegister(email, pass_word, pass_word_hash, invite_code, wechat, group_id, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailPassword').val('');
                $('.againEmailPassword').val('');
                $('.emailInvitCode').val('');
                $('#registerSuccess').modal('show');//Registration successfully displayed prompt
            }
        }, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '105') {
                $('.emailLoginTips').fadeIn('fast');
            }
            if (response.errcode == '121') {
                $('#alreadyRegister').modal('show');
            }
            GetImgCode();
            // LayerFun(response.errcode);
            layer.msg(response.errmsg, {icon: 2});
            return;
        });
    });
    //Go to the mailbox to verify
    $('.goEmailBtn').click(function () {
        window.location.href = 'login.html';
        window.open(emailList[_email]);
    });

    //phoneInput
    //phone
    $("#phone").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".accountNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //phoneCfmCode-
    $("#phoneCfmCode").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".codeNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });


    //phoneSmsCode-
    $("#phoneSmsCode").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".codeNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        let country_code = $('.selected-dial-code').text().split("+")[1];
        let bind_type = '1', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        let cellphone = $('#phone').val();
        if ($("#phone").val().length <= 0) {
            layer.msg("请输入账号", {icon: 0});
            return;
        }
        if (cfm_code.length <= 0) {
            // LayerFun('codeNotEmpty');
            layer.msg("请输入图形验证码", {icon: 0});
            return;
        }

        ShowLoading("show");
        GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code);
    });
    /**
     /* ========Register your phone========
     * Click to register to submit
     */
    $('.phoneRegisterBtn').click(function () {
        let country_code = $('.selected-dial-code').text().split("+")[1];
        // Get user input
        let cellphone = $('#phone').val(),
            sms_code = $('#phoneSmsCode').val(),
            phoneCfmCode = $('#phoneCfmCode').val(),
            pass_word = $('#password').val(),
            again_pass_word = $('#againPassword').val(),
            pass_word_hash = hex_sha1(pass_word),
            wechat = $('#weChatName').val(),
            invit_code = $('#inviteCode').val();
        if (cellphone.length <= 0) {
            // LayerFun('phoneNotEmpty');
            layer.msg("请输入账号", {icon: 0});
            return;
        }
        if (pass_word.length <= 0) {
            // LayerFun('passNotEmpty');
            layer.msg("请输入密码", {icon: 0});
            return;
        }
        if (again_pass_word.length <= 0) {
            // LayerFun('confirmPasswordNotEmpty');
            layer.msg("请输入确认密码", {icon: 0});
            return;
        }
        if (phoneCfmCode.length <= 0) {
            // LayerFun('codeNotEmpty');
            layer.msg("请输入图形验证码", {icon: 0});
            return;
        }
        if (pass_word != again_pass_word) {
            // LayerFun('TwoPassword');
            layer.msg("两次密码必须相同", {icon: 0});
            $('.phoneSamePassword_tips').fadeIn();
            return;
        }
        if (sms_code.length <= 0) {
            // LayerFun('codeNotEmpty');
            layer.msg("请输入短信验证码", {icon: 0});
            return;
        }
        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        PhoneRegister(country_code, cellphone, sms_code, pass_word, pass_word_hash, invit_code, wechat, group_id, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCfmCode').val('');
                $('#password').val('');
                $('#againPassword').val('');
                $('#inviteCode').val('');
                window.location.href = 'login.html?name=phone';
            }
        }, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '100') {
                $('.phoneErrorTips').fadeIn('fast');
            }
            if (response.errcode == 105) {
                $('.phoneLoginTips').fadeIn('fast');
            }
            if (response.errcode == 111) {
                $('.phoneCode_expired').fadeIn('fast');
            }
            GetImgCode();
            // LayerFun(response.errcode);
            layer.msg(response.errmsg, {icon: 2});
            return;
        });
    });
});








