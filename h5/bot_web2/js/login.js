$(function () {
    function GetCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        if (arr == null) {
            return;
        }
    }

    var user_token = GetCookie("user_token");
    if (user_token) {
        window.location.href = "home.html";
    }

    //图形验证码
    GetImgCode();
    $("#phone_imgCode").click(() => {
        GetImgCode();
    });

    $(".loginBtn").click(function () {
        var cellphone = $("#phone").val();
        var password = $("#password").val();
        var cfm_code = $("#cfm_code").val();
        var pass_word_hash = hex_sha1(password);
        var country_code = $('.selected-dial-code').text().split("+")[1];
        if (cellphone.length <= 0) {
            layer.msg("请输入账号");
            return;
        }
        if (password.length <= 0) {
            layer.msg("请输入密码");
            return;
        }

        //loading层
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });

        RobotPhoneLogin(cellphone, country_code, pass_word_hash, cfm_code, function (response) {
            if (response.errcode == '0') {
                layer.close(loading);
                var token = response.token;
                SetCookie('user_token', token);
                SetCookie('wechat', response.wechat);
                SetCookie('us_id', response.us_id);
                layer.msg("success");
                window.location.href = 'home.html';
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg);
            GetImgCode();
        })

        // RobotEmailLogin(email, pass_word_hash, function (response) {
        //     if (response.errcode == '0') {
        //         layer.close(loading);
        //         var token = response.token;
        //         SetCookie('robot_token', token);
        //         layer.msg("success");
        //         SetCookie('robot_username', email);
        //         setTimeout(function () {
        //             window.location.href = 'robot_login.html';
        //         }, 1000);
        //     }
        // }, function (response) {
        //     layer.close(loading);
        //     layer.msg(response.errmsg);
        // })
    })
});