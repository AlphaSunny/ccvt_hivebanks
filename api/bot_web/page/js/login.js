$(function () {
    GetImgCode();

    //前往注册
    $(".register_text").click(function () {
        window.location.href = url + "/api/bot_web/page/register.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //切换手机/邮箱登录
    $(".toggle_login_btn").click(function () {
        $(this).addClass("active").siblings(".toggle_login_btn").removeClass("active");
        if ($(this).hasClass("email_login_btn")) {
            $(".intl-tel-input").fadeOut("fast");
            $(".phoneLoginBtn").fadeOut("fast");
            $("#email").fadeIn("fast");
            $(".emailLoginBtn").fadeIn("fast");
        } else {
            $("#email").fadeOut("fast");
            $(".emailLoginBtn").fadeOut("fast");
            $(".intl-tel-input").fadeIn("fast");
            $(".phoneLoginBtn").fadeIn("fast");
        }
    });

    //切换验证码
    $("#phone_imgCode").click(function () {
        GetImgCode();
    });

    //手机登录
    $(".phoneLoginBtn").click(function () {
        GetImgCode();
        ShowLogin("show");
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $("#phone").val(),
            cfm_code = $("#phoneCfmCode").val(),
            phonePassword = $("#phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);

        if (cellphone.length <= 0) {
            layer.msg("请输入手机号码");
            return;
        }
        if (phonePassword.length <= 0) {
            layer.msg("请输入密码");
            return;
        }
        if (cfm_code.length <= 0) {
            layer.msg("请输入验证码");
            return;
        }

        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, function (response) {
            ActiveClick($this, _text);
            ShowLogin("hide");
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCfmCode').val('');
                $('#phonePassword').val('');
                var token = response.token;
                SetCookie('statistics_user_token', token);
                window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
            }
        }, function (response) {
            ShowLogin("hide");
            GetImgCode();
            ActiveClick($this, _text);
            layer.msg(response.errmsg);
            if (response.errcode == "116") {
                layer.msg("<p>登录失败，请<span>" + response.errmsg + "</span>秒后重试</p>");
                return;
            }
        });
    });

    //邮箱登录
    $(".emailLoginBtn").click(function () {
        GetImgCode();
        ShowLogin("show");
        var email = $("#email").val(),
            emailPassword = $("#phonePassword").val(),
            pass_word_hash = hex_sha1(emailPassword),
            cfm_code = $("#phoneCfmCode").val();

        if (email.length <= 0) {
            layer.msg("请输入邮箱");
            return;
        }
        if (!IsEmail(email)) {
            layer.msg("邮箱格式错误");
            return;
        }
        if (emailPassword.length <= 0) {
            layer.msg("请输入密码");
            return;
        }

        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        EmailLogin(email, pass_word_hash, cfm_code, function (response) {
            ShowLogin("hide");
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('#email').val('');
                $('#phonePassword').val('');
                $('#phoneCfmCode').val('');
                layer.msg("登录成功");
                var token = response.token;
                SetCookie('statistics_user_token', token);
                window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
            }
        }, function (response) {
            ShowLogin("hide");
            GetImgCode();
            ActiveClick($this, _text);
            layer.msg(response.errmsg);
            if (response.errcode == '116') {//Login Failed
                layer.msg("<p>登录失败，请<span>" + response.errmsg + "</span>秒后重试</p>");
                return;
            }
        });
    })
});