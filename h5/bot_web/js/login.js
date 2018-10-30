$(function () {
    function GetCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        if (arr == null) {
            return;
        }
    }

    var robot_token = GetCookie("robot_token");
    if (robot_token) {
        window.location.href = "robot_login.html";
    } else {
        return;
    }

    $(".loginBtn").click(function () {
        var email = $("#email").val();
        var password = $("#password").val();
        var pass_word_hash = hex_sha1(password);
        if (email.length <= 0) {
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
        RobotEmailLogin(email, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                layer.close(loading);
                var token = response.token;
                SetCookie('robot_token', token);
                layer.msg("success");
                SetCookie('robot_username', email);
                setTimeout(function () {
                    window.location.href = 'robot_login.html';
                }, 1000);
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg);
        })
    })
});