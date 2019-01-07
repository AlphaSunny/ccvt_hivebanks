$(function () {
    GetImgCode();

    var target = document.getElementById("mySpin");
    var spinner = new Spinner({
        lines: 8, // The number of lines to draw
        length: 10, // The length of each line
        width: 2, // The line thickness
        radius: 10, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    });

    function RegShowLogin(type) {
        if (type == "show") {
            spinner.spin(target);
        }
        if (type == "hide") {
            spinner.spin();
        }
    }

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");
    var status = GetQueryString("status");

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
        $("input").val("");
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
        if (!((/^[1-9]\d*$/).test(cellphone))) {
            layer.msg("手机号码格式错误");
            return;
        }
        if (cfm_code.length <= 0) {
            layer.msg("请输入图形验证码");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        RegShowLogin("show");
        GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
            RegShowLogin("hide");
            if (response.errcode == '0') {
                CountDown($this);
                layer.msg("发送成功");
            }
        }, function (response) {
            RegShowLogin("hide");
            ActiveClick($this, btnText);
            layer.msg(response.errmsg);
            GetImgCode();
        });
    });

    //倒计时60秒
    function CountDown(_this) {
        var count = 60;
        var timer = setInterval(function () {
            if (count > 0) {
                _this.text(count + "s").attr("disabled", true);
                count--;
            } else {
                _this.text("获取验证码").attr("disabled", false);
                clearInterval(timer);
                GetImgCode();
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
        if (!((/^[1-9]\d*$/).test(cellphone))) {
            layer.msg("手机号码格式错误");
            return;
        }
        if (phoneCfmCode.length <= 0) {
            layer.msg("请输入图形验证码");
            return;
        }
        if (sms_code.length <= 0) {
            layer.msg("请输入短信验证码");
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

        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        RegShowLogin("show");
        PhoneRegister(country_code, cellphone, sms_code, pass_word, pass_word_hash, invit_code, function (response) {
            ActiveClick($this, btnText);
            RegShowLogin("hide");
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCfmCode').val('');
                $('#phoneSmsCode').val('');
                $('#password').val('');
                $('#confirm_password').val('');
                $('#invitation').val('');
                layer.msg("注册成功,请登录");
                setTimeout(function () {
                    window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name)+ "&status=" + encodeURIComponent(status);
                }, 1500);
            }
        }, function (response) {
            RegShowLogin("hide");
            ActiveClick($this, btnText);
            GetImgCode();
            layer.msg(response.errmsg);
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
        RegShowLogin("show");
        EmailRegister(email, pass_word, pass_word_hash, invit_code, function (response) {
            ActiveClick($this, btnText);
            RegShowLogin("hide");
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
            RegShowLogin("hide");
            ActiveClick($this, btnText);
            layer.msg(response.errmsg);
            GetImgCode();
            return;
        });
    });
});