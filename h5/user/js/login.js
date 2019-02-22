$(document).ready(function () {
    //判断当前是否登录
    function GetLoginCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }else{
            alert("登录页面不存在user_token");
            DelCookie("user_token");
            return 0;
        }
    }

    let user_token = GetLoginCookie('user_token');
    if (user_token) {
        window.location.href = "account.html";
    }

    let leaderBoard = GetQueryString("honor");
    let domain_list = GetQueryString("domain_list");

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

    //自动填充账号密码
    let account_cellphone = GetLoginCookie("account_cellphone");
    let account_email = GetLoginCookie("account_email");
    let p = GetLoginCookie("p");
    let e = GetLoginCookie("e");
    let isRemember = GetLoginCookie("remember");
    if (account_cellphone) {
        $("#phone").val(account_cellphone);
        if (p) {
            $("#phonePassword").val(uncompileStr(p));
        }
    }

    if (account_email) {
        $("#email").val(account_email);
        if (e) {
            $("#emailPassword").val(uncompileStr(e));
        }
    }

    if (isRemember) {
        $("#remember_phone,#remember_email").attr("checked", true);
    } else {
        $("#remember_phone,#remember_email").attr("checked", false);
    }


    //是否记住密码
    function IsRememberPassword(p, type) {
        if (type == "phone" && $("#remember_phone").is(":checked")) {
            SetCookie("p", compileStr(p));
            SetCookie("remember", "1");
            return;
        } else {
            SetCookie("p", "");
            SetCookie("remember", "");
            return;
        }

        if (type == "email" && $("#remember_email").is(":checked")) {
            SetCookie("e", compileStr(p));
            SetCookie("remember", "1");
            return;
        } else {
            SetCookie("e", "");
            SetCookie("remember", "");
            return;
        }
    }

    //显示隐藏密码
    $(document).on("click",".icon-yanjing1",function () {
       $(this).removeClass("icon-yanjing1").addClass("icon-yanjing").siblings("input").attr("type","text");
    });

    $(document).on("click",".icon-yanjing",function () {
        $(this).removeClass("icon-yanjing").addClass("icon-yanjing1").siblings("input").attr("type","password");
    });

    // ========email login========

    // Email form change judgment
    //email judgment
    $("#email").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".accountNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else if (!IsEmail($(this).val())) {
            $(".alert-warning").fadeIn();
            $(".emailErrorTips").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //email password judgment
    $("#emailPassword").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".phonePassword_tips").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //email emailCfmCode
    $("#emailCfmCode").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".phoneImgCode_tips").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
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

                SetCookie('account_email', email);
                IsRememberPassword(emailPassword, "email");

                if (!leaderBoard) {
                    window.location.href = 'account.html';
                } else {
                    window.location.href = "../honor/honor.html";
                }
                if (!domain_list) {
                    window.location.href = 'account.html';
                } else {
                    window.location.href = "../domain/domain_list2.html";
                }
            }
        }, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '116') {//Login Failed
                $(".alert-warning").fadeIn();
                $('.phoneLoginError').fadeIn().siblings(".phone_tips").fadeOut();
                let count = response.errmsg,
                    emailErrorNum = $('.emailErrorNum'),
                    emailLoginBtn = $('.emailLoginBtn'),
                    emailLoginError = $('.emailLoginError'),
                    emailInput = $('.emailLoginBox input');
                CountDown(count, emailErrorNum, emailLoginBtn, emailInput, emailLoginError);
            } else if (response.errcode == '112') {
                $(".alert-warning").fadeIn();
                $('.phoneAccountNot').fadeIn().siblings(".phone_tips").fadeOut();//User Does Not Exist
            } else if (response.errcode == '113') {//Unverified
                $('#emailVerification').modal('show');
            }
            if (response.errcode == '139') {
                $(".alert-warning").fadeIn();
                $('.errPhoneImgCode_tips').fadeIn().siblings(".phone_tips").fadeOut();//Graphic verification code error
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
    $("#phone").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".accountNotEmpty").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //phone password
    $("#phonePassword").bind("input propertuchange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $('.phonePassword_tips').fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    //phone phoneCfmCode
    $("#phoneCfmCode").bind("input propertychange", function () {
        if ($(this).val().length <= 0) {
            $(".alert-warning").fadeIn();
            $(".phoneImgCode_tips").fadeIn().siblings(".phone_tips").fadeOut();
        } else {
            $(".alert-warning,.phone_tips").fadeOut();
        }
    });

    // ========Log in with phone========
    $(".phoneLoginBtn").click(function () {//Click Login to submit
        let user_token = GetLoginCookie('user_token');
        // Get country code
        let country_code = $('.selected-dial-code').text().split("+")[1];

        // Get user input
        let cellphone = $("#phone").val(),
            cfm_code = $("#phoneCfmCode").val(),
            phonePassword = $("#phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);
        if (cellphone.length <= 0) {
            // LayerFun('phoneNotEmpty');
            WarnPrompt("请输入账号");
            $('.phone_tips').fadeIn().siblings('.phone_tips').fadeOut();
            return;
        }

        if (phonePassword.length <= 0) {
            // LayerFun('passwordNotEmpty');
            WarnPrompt("请输入密码");
            $('.phonePassword_tips').fadeIn().siblings('.phone_tips').fadeOut();
            return;
        }

        if (cfm_code.length <= 0) {
            // LayerFun('codeNotEmpty');
            WarnPrompt("请输入图形验证码");
            $('.phoneImgCode_tips').fadeIn().siblings('.phone_tips').fadeOut();
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
                SetCookie('account_cellphone', cellphone);
                IsRememberPassword(phonePassword, "phone");
                if (!leaderBoard) {
                    window.location.href = 'account.html';
                } else {
                    window.location.href = "../honor/honor.html";
                }

                if (!domain_list) {
                    window.location.href = 'account.html';
                } else {
                    window.location.href = "../domain/domain_list2.html";
                }
            }
        }, function (response) {
            GetImgCode();
            ActiveClick($this, _text);
            if (response.errcode == '116') {//Login Failed
                $('.alert-warning,.phoneLoginError').fadeIn();
                let count = response.errmsg,
                    phoneErrorNum = $('.phoneErrorNum'),
                    phoneLoginBtn = $('.phoneLoginBtn'),
                    phoneLoginError = $('.phoneLoginError'),
                    phoneInput = $('.phoneLoginBox input');
                CountDown(count, phoneErrorNum, phoneLoginBtn, phoneInput, phoneLoginError);
            } else if (response.errcode == '112') {
                $(".alert-warning").fadeIn();
                $('.phoneAccountNot').fadeIn().siblings('.phone_tips').fadeOut();//User Does Not Exist
            }
            if (response.errcode == '139') {
                $(".alert-warning").fadeIn();
                $('.errPhoneImgCode_tips').fadeIn().siblings('.phone_tips').fadeOut();//Graphic verification code error
            }

            // LayerFun(response.errcode);
            WarnPrompt(response.errmsg);
            return;
        });
    });
});

