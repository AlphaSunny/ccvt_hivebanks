$(function () {
    GetImgCode();

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    $(".login_btn").click(function () {
        ShowLogin("show");
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $("#phone").val(),
            cfm_code = $(".phoneCfmCode").val(),
            phonePassword = $(".phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);

        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, function (response) {
            ActiveClick($this, _text);
            ShowLogin("hide");
            if (response.errcode == '0') {
                $('#phone').val('');
                $('.phoneCfmCode').val('');
                $('.phonePassword').val('');
                var token = response.token;
                SetCookie('user_token', token);
                window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "group_name=" + encodeURIComponent(group_name);
            }
        }, function (response) {
            ShowLogin("hide");
            GetImgCode();
            ActiveClick($this, _text);
            if(response.errcode == "116"){
                layer.msg("<p>登录失败，请<span>"+ response.errmsg +"</span>秒后重试</p>");
            }
        });
    })
});