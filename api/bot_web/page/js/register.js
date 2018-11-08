$(function () {
    GetImgCode();

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //前往登录
    $(".login_text").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //切换手机/邮箱登录
    $(".toggle_reg_btn").click(function () {
        $(this).addClass("active").siblings(".toggle_reg_btn").removeClass("active");
        if ($(this).hasClass("email_reg_btn")) {
            $(".phone_reg_box").fadeOut("fast");
            $(".phoneRegBtn").fadeOut("fast");
            $("#email").fadeIn("fast");
            $(".emailRegBtn").fadeIn("fast");
        } else {
            $("#email").fadeOut("fast");
            $(".emailRegBtn").fadeOut("fast");
            $(".phone_reg_box").fadeIn("fast");
            $(".phoneRegBtn").fadeIn("fast");
        }
    });

    //切换验证码
    $("#phone_imgCode").click(function () {
        GetImgCode();
    });

    //获取手机验证码
    $(".get_sms_code_btn").click(function () {
        var cellphone = $("#phone").val();
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var bind_type = "1";
        var cfm_code = $("#phoneCfmCode").val();

        if (cellphone.length <= 0) {
            layer.msg("请输入手机号码");
            return;
        }
        if (cfm_code.length <= 0) {
            layer.msg("请输入图形验证码");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
            if (response.errcode == '0') {
                CountDown($this);
                layer.msg("发送成功");
            }
        }, function (response) {
            ActiveClick($this, btnText);
            layer.msg(response.errmsg);
        });
    });

    //倒计时60秒
    function CountDown(_this) {
        var count = 60;
        var timer = setInterval(function () {
            if (count > 0) {
                _this.text(count + "s");
                count--;
            } else {
                _this.text("获取验证码");
                clearInterval(timer);
            }
        }, 1000)
    }

    //手机注册
    $('.phoneRegBtn').click(function () {
        var country_code = $('.selected-dial-code').text().split("+")[1];
        // Get user input
        var cellphone = $('#phone').val(),
            phoneCfmCode = $('#phoneCfmCode').val(),
            sms_code = $('#phoneSmsCode').val(),
            pass_word = $('#password').val(),
            again_pass_word = $('#confirm_password').val(),
            pass_word_hash = hex_sha1(pass_word),
            invit_code = $('#invitation').val();
        if (cellphone.length <= 0) {
            layer.msg("请输入手机号码");
            return;
        }
        if (again_pass_word.length <= 0) {
            layer.msg("请输入确认密码");
            return;
        }
        if (phoneCfmCode.length <= 0) {
            layer.msg("请输入图形验证码");
            return;
        }
        if (pass_word.length <= 0) {
            layer.msg("请输入密码");
            return;
        }
        if (again_pass_word.length <= 0) {
            layer.msg("请输入确认密码");
            return;
        }
        if (pass_word != again_pass_word) {
            layer.msg("两次密码必须相同");
            return;
        }
        if (sms_code.length <= 0) {
            layer.msg("请输入短信验证码");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        // ShowLoading("show");
        PhoneRegister(country_code, cellphone, sms_code, pass_word, pass_word_hash, invit_code, function (response) {
            ActiveClick($this, btnText);
            // ShowLoading("hide");
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCfmCode').val('');
                $('#phoneSmsCode').val('');
                $('#password').val('');
                $('#confirm_password').val('');
                $('#invitation').val('');
                layer.msg("注册成功,请登录");
                setTimeout(function () {
                    window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
                }, 1500);
            }
        }, function (response) {
            // ShowLoading("hide");
            ActiveClick($this, btnText);
            GetImgCode();
            layer(response.errmsg);
            return;
        });
    });

    //邮箱注册
    $('.emailRegBtn').click(function () {
        var email = $('#email').val(),
            pass_word = $('#password').val(),
            again_pass_word = $('#confirm_password').val(),
            pass_word_hash = hex_sha1(pass_word),
            invit_code = $('#invitation').val();
        if (email.length <= 0) {
            layer.msg("请输入邮箱");
            return;
        }
        if (!IsEmail(email)) {
            layer.msg("邮箱格式错误");
            return;
        }
        if (pass_word.length <= 0) {
            layer.msg("请输入密码");
            return;
        }
        if (again_pass_word.length <= 0) {
            layer.msg("请输入确认密码");
            return;
        }
        if (pass_word != again_pass_word) {
            layer.msg("两次密码必须相同");
            return;
        }

        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        // ShowLoading("show");
        EmailRegister(email, pass_word, pass_word_hash, invit_code, function (response) {
            ActiveClick($this, btnText);
            // ShowLoading("hide");
            if (response.errcode == '0') {
                $('#email').val("");
                $('#password').val("");
                $('#confirm_password').val("");
                $('#invitation').val("");
                alert("注册成功，请前往邮箱验证！");
                setTimeout(function () {
                    window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name) + "&reg_type=email";
                }, 500);
            }
        }, function (response) {
            // ShowLoading("hide");
            ActiveClick($this, btnText);
            layer.msg(response.errmsg);
            GetImgCode();
            return;
        });
    });
});