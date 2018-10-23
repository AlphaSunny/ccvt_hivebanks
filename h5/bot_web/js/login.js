$(function () {
    $(".loginBtn").click(function () {
        var username = $("#email").val();
        var password = $("#password").val();
        var pass_word_hash = hex_sha1(password);
        if (username.length <= 0) {
            layer.msg("请输入账号");
            return;
        }
        if (password.length <= 0) {
            layer.msg("请输入密码");
            return;
        }
        RobotEmailLogin(username, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                var token = response.token;
                SetCookie('robot_token', token);
                SetCookie('robot_username', username);
                window.location.href = 'groupMasterList.html';
            }
        }, function (response) {
            layer.msg("登录失败，请重新登录")
        })
    });
});