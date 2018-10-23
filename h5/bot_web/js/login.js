$(function () {
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
        RobotEmailLogin(email, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                var token = response.token;
                SetCookie('robot_token', token);
                layer.msg("success");
                // SetCookie('robot_username', username);
                setTimeout(function () {
                    window.location.href = 'groupMasterList.html';
                },1000);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    });
});