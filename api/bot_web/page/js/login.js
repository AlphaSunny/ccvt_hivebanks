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

    function ShowLogin(type) {
        if (type == "show") {
            spinner.spin(target);
        }
        if (type == "hide") {
            spinner.spin();
        }
    }

    //返回奖励统计
    $(".back_statistics").click(function () {
        window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //前往注册
    $(".register_text").click(function () {
        window.location.href = url + "/api/bot_web/page/register.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name)+ "&status=" + encodeURIComponent(status);
    });

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");
    var reg_type = GetQueryString("reg_type");
    var statistical = GetQueryString("statistical");
    var chat = GetQueryString("chat");
    var status = GetQueryString("status");

    if (reg_type) {
        $(".intl-tel-input").fadeOut("fast");
        $(".phoneLoginBtn").fadeOut("fast");
        $("#email").fadeIn("fast");
        $(".emailLoginBtn").fadeIn("fast");
    }

    //切换手机/邮箱登录
    $(".toggle_login_btn").click(function () {
        GetImgCode();
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
        $("input").val("");
    });

    //切换验证码
    $("#phone_imgCode").click(function () {
        GetImgCode();
    });

    //手机登录
    $(".phoneLoginBtn").click(function () {
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
        ShowLogin("show");
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
                SetCookie('user_token', token);
                if (statistical) {
                    window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
                } else if (chat) {
                    window.location.href = url + "/api/bot_web/page/chat.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name)+ "&status=" + encodeURIComponent(status);
                }
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
        ShowLogin("show");
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
                SetCookie('user_token', token);
                if (statistical) {
                    window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
                } else if (chat) {
                    window.location.href = url + "/api/bot_web/page/chat.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name)+ "&status=" + encodeURIComponent(status);
                }
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
    });
});