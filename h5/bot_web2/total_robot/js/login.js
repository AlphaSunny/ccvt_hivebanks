$(function () {
    function GetLoginCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
    }

    let total_robot_token = GetLoginCookie("total_robot_token");
    if (total_robot_token) {
        window.location.href = 'kyc_group_list.html';
    }
    $('#login_btn').click(function () {
        let _this = $(this), _text = $(this).text();
        let user = $('#user').val(),
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if (user.length <= 0) {
            // LayerFun('accountNotEmpty');
            layer.msg("请输入账号", {icon: 0});
            return;
        }

        if (password.length <= 0) {
            // LayerFun('passwordNotEmpty');
            layer.msg("请输入密码", {icon: 0});
            return;
        }
        if (DisableClick(_this)) return;
        LaLogin(user, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick(_this, _text);
                // LayerFun('loginSuccessful');
                layer.msg("登录成功");
                SetCookie('total_robot_token', response.token);
                // SetCookie('la_name', response.rows.user_info.user);
                window.location.href = 'kyc_group_list.html';
            }
        }, function (response) {
            ActiveClick(_this, _text);
            layer.msg(response.errmsg, {icon: 2});
            // LayerFun('loginFailed');
            // LayerFun(response.errcode);
        })
    })
});