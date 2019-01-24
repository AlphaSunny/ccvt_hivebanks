$(document).ready(function () {
    //判断当前是否登录
    function GetLoginCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }
    let user_token = GetLoginCookie('user_token');
    if (user_token) {
        window.location.href = "test_account.html";
    }

    let leaderBoard = GetQueryString("honor");

    function GetLoginCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
    }

    //Get graphic verification code
    GetImgCode();
    //Switch verification code
    $('#email_imgCode, #phone_imgCode').click(function () {
        GetImgCode();
    });

    // Switch mailbox and phone login styles
    $(".loginToggle").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // Switch mailbox login
    $(".emailLogin").click(function () {
        $(".phoneLoginBox").fadeOut();
        $(".emailLoginBox").fadeIn();
        $('.phonePassword').removeClass('.pass');
        GetImgCode();
    });
    // Switch phone login
    $(".phoneLogin").click(function () {
        $(".emailLoginBox").fadeOut();
        $(".phoneLoginBox").fadeIn();
        $('.emailPassword').removeClass('.pass');
        GetImgCode();
    });
    // ========email login========
    $('.emailCanvas').click(function () {//Click to replace the verification code
        GetImgCode();
    });

    // Email form change judgment
    //email judgment
    $('.email').focus(function () {
        $('.email_tips').fadeOut('fast');
        $('.emailErrorTips').fadeOut('fast');
        $('.emailAccountNot').fadeOut('fast');
        $('.emailAuditFail').fadeOut('fast');
    });
    $('.email').blur(function () {
        let emailVal = $('.email').val();//Get mailbox content
        if (emailVal.length <= 0) {//Is it empty?
            $('.email_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (!IsEmail(emailVal)) {
            $('.emailErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.email_tips').fadeOut('fast');
            $('.emailErrorTips').fadeOut('fast');
            $('.emailAuditFail').fadeOut('fast');
        }
    });

    //email password judgment
    $('.emailPassword').blur(function () {
        let emailPassword = $('.emailPassword').val();//Get mailbox content
        if (emailPassword.length <= 0) {//Is it empty?
            $('.password_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.password_tips').fadeOut('fast')
        }
    });

    //email emailCfmCode
    $('.emailCfmCode').focus(function () {
        $('.emailImgCode_tips').fadeOut('fast');
        $('.errEmailImgCode_tips').fadeOut('fast');
    });
    $('.emailCfmCode').blur(function () {
        let emailCfmCode = $('.emailCfmCode').val();//Get mailbox content
        if (emailCfmCode.length <= 0) {//Is it empty?
            $('.emailImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.emailImgCode_tips').fadeOut('fast');
            $('.errEmailImgCode_tips').fadeOut('fast');
        }
    });

    // email submit judgment
    let _email = '', emailList = '';
    $(".emailLoginBtn").click(function () {
        let user_token = GetLoginCookie('user_token');
        let email = $(".email").val(),
            emailPassword = $(".emailPassword").val(),
            pass_word_hash = hex_sha1(emailPassword),
            cfm_code = $(".emailCfmCode").val();

        if (email.length <= 0) {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            // LayerFun('emailNotEmpty');
            WarnPrompt("请输入账号");
            return;
        }
        if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            // LayerFun('emailBad');
            WarnPrompt("邮箱格式错误");
            return;
        }
        if (emailPassword.length <= 0) {
            $('.password_tips').fadeIn().siblings('span').hide();
            // LayerFun('passwordNotEmpty');
            WarnPrompt("请输入密码");
            return;
        }
        if (user_token) {
            // LayerFun('noMoreAccount');
            WarnPrompt("已登录！请前往账户中心");
            return;
        }

        _email = email.split('@')[1];
        emailList = EmailList();
        let $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        EmailLogin(email, pass_word_hash, cfm_code, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailPassword').val('');
                $('.emailCfmCode').val('');
                // LayerFun('loginSuccessful');
                SuccessPrompt("登录成功");
                let token = response.token;
                SetCookie('user_token', token);
                if (!leaderBoard) {
                    window.location.href = 'test_account.html';
                } else {
                    window.location.href = "../honor/honor.html";
                }
            }
        }, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '116') {//Login Failed
                $('.emailLoginError').fadeIn('fast');
                let count = response.errmsg,
                    emailErrorNum = $('.emailErrorNum'),
                    emailLoginBtn = $('.emailLoginBtn'),
                    emailLoginError = $('.emailLoginError'),
                    emailInput = $('.emailLoginBox input');
                CountDown(count, emailErrorNum, emailLoginBtn, emailInput, emailLoginError);
            } else if (response.errcode == '112') {
                $('.emailAccountNot').fadeIn('fast');//User Does Not Exist
            } else if (response.errcode == '113') {//Unverified
                $('#emailVerification').modal('show');
            }
            if (response.errcode == '139') {
                $('.errEmailImgCode_tips').fadeIn('fast');//Graphic verification code error
            }
            if (response.errcode == '118') {
                $('.emailAuditFail').fadeIn('fast');//not approved
            }
            GetImgCode();
            // LayerFun(response.errcode);
            WarnPrompt(response.errmsg);
            return;
        });
    });

    //Go to the mailbox to verify
    $('.goEmailBtn').click(function () {
        window.open(emailList[_email]);
    });

    //Phone registration returns to login display
    let url = GetQueryString('name');
    if (url == 'phone') {
        $('.emailLogin').removeClass('active');
        $('.emailLoginBox').fadeOut('fast');
        $('.phoneLogin,.phoneLoginBox').addClass('active');
    }
    GetImgCode();

    //PhoneForm Input Monitor
    //phone
    $('#phone').focus(function () {
        $('.phone_tips').fadeOut('fast');
        $('.phoneErrorTips').fadeOut('fast');
        $('.phoneAccountNot').fadeOut('fast');
        $('.phoneAuditFail').fadeOut('fast');
    });
    $('#phone').blur(function () {
        let phone = $('#phone').val();
        if (phone.length <= 0) {
            $('.phone_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (isNaN(phone)) {
            $('.phoneErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.phone_tips').fadeOut('fast');
            $('.phoneErrorTips').fadeOut('fast');
            $('.phoneAuditFail').fadeOut('fast');
        }
    });

    //phone password
    $('.phonePassword').blur(function () {
        let phonePassword = $('.phonePassword').val();
        if (phonePassword.length <= 0) {
            $('.phonePassword_tips').fadeIn('fast');
        } else {
            $('.phonePassword_tips').fadeOut('fast');
        }
    });

    //phone phoneCfmCode
    $('.phoneCfmCode').focus(function () {
        $('.phoneImgCode_tips').fadeOut('fast');
        $('.errPhoneImgCode_tips').fadeOut('fast');
    });
    $('.phoneCfmCode').blur(function () {
        let phoneCfmCode = $('.phoneCfmCode').val();
        if (phoneCfmCode.length <= 0) {
            $('.phoneImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.phoneImgCode_tips').fadeOut('fast');
            $('.errPhoneImgCode_tips').fadeOut('fast');
        }
    });

    //phone phoneSmsCode
    // $('#phoneSmsCode').blur(function () {
    //     let phoneSmsCode = $('#phoneSmsCode').val();
    //     if (phoneSmsCode.length <= 0) {
    //         $('.phoneSmsCode_tips').fadeIn('fast');
    //     } else {
    //         $('.phoneSmsCode_tips').fadeOut('fast');
    //     }
    // });

    //Get phone verification code
    // $('.phoneCodeBtn').click(function () {
    //     let bind_type = '2', $this = $(this), cfm_code = $('.phoneCfmCode').val();
    //     if ($(".phone").val().length <= 0) {
    //         $('.phone_tips').fadeIn().siblings('span').hide();
    //         LayerFun('phoneNotEmpty');
    //         return;
    //     }
    //     if ($('.phoneCfmCode').val().length <= 0) {
    //         $('.phoneImgCode_tips').fadeIn('fast');
    //         return;
    //     }
    //     setTime($this);
    //     GetPhoneCodeFun(bind_type, $this, cfm_code);
    // });

    // ========Log in with phone========
    $('.phoneCanvas').click(function () {//click switch verification code
        GetImgCode();
    });

    $(".phoneLoginBtn").click(function () {//Click Login to submit
        let user_token = GetLoginCookie('user_token');
        // Get country code
        let country_code = $('.selected-dial-code').text().split("+")[1];

        // Get user input
        let cellphone = $("#phone").val(),
            cfm_code = $(".phoneCfmCode").val(),
            // sms_code = $("#phoneSmsCode").val(),
            phonePassword = $(".phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);
        if (cellphone.length <= 0) {
            // LayerFun('phoneNotEmpty');
            WarnPrompt("请输入账号");
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (cfm_code.length <= 0) {
            // LayerFun('codeNotEmpty');
            WarnPrompt("请输入图形验证码");
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
        // if (sms_code.length <= 0) {
        //     LayerFun('codeNotEmpty');
        //     $('.phoneCode_tips').fadeIn();
        //     return;
        // }

        if (phonePassword.length <= 0) {
            // LayerFun('passwordNotEmpty');
            WarnPrompt("请输入密码");
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (user_token) {
            // LayerFun('noMoreAccount');
            WarnPrompt("已登录，请前往账户中心");
            return;
        }

        let $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('#phone').val('');
                $('.phoneCfmCode').val('');
                // $('#phoneSmsCode').val('');
                $('.phonePassword').val('');
                let token = response.token;
                SetCookie('user_token', token);
                if (!leaderBoard) {
                    window.location.href = 'test_account.html';
                } else {
                    window.location.href = "../honor/honor.html";
                }
            }
        }, function (response) {
            GetImgCode();
            ActiveClick($this, _text);
            if (response.errcode == '116') {//Login Failed
                $('.phoneLoginError').fadeIn('fast');
                let count = response.errmsg,
                    phoneErrorNum = $('.phoneErrorNum'),
                    phoneLoginBtn = $('.phoneLoginBtn'),
                    phoneLoginError = $('.phoneLoginError'),
                    phoneInput = $('.phoneLoginBox input');
                CountDown(count, phoneErrorNum, phoneLoginBtn, phoneInput, phoneLoginError);
            } else if (response.errcode == '112') {
                $('.phoneAccountNot').fadeIn('fast');//User Does Not Exist
            }
            if (response.errcode == '139') {
                $('.errPhoneImgCode_tips').fadeIn('fast');//Graphic verification code error
            }
            if (response.errcode == '118') {
                $('.phoneAuditFail').fadeIn('fast');//not approved
            }
            // LayerFun(response.errcode);
            WarnPrompt(response.errmsg);
            return;
        });
    });
});

