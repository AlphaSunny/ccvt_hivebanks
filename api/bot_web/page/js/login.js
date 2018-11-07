$(function () {
    GetImgCode();

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //切换手机/邮箱登录
    $(".toggle_login_btn").click(function () {
        $(this).addClass("active").siblings(".toggle_login_btn").removeClass("active");
    });

    //切换验证码
    $("#phone_imgCode").click(function () {
        GetImgCode();
    });

    $(".login_btn").click(function () {
        ShowLogin("show");
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $("#phone").val(),
            cfm_code = $("#phoneCfmCode").val(),
            phonePassword = $("#phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);

        if(cellphone.length <= 0){
            layer.msg("请输入手机号码");
            return;
        }
        if(phonePassword.length <= 0){
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
            if(response.errcode == "116"){
                layer.msg("<p>登录失败，请<span>"+ response.errmsg +"</span>秒后重试</p>");
            }
        });
    })
});