$(function () {
    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //获取 statistics_user_token
    var token = GetCookie("statistics_user_token");
    if (token) {
        $(".login").remove();
        $(".amount_box").fadeIn("fast");
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $(".amount").text(data.base_amount);
            }
        }, function (response) {
            layer.msg("余额获取失败");
        })
    }

    //获取当前域名
    var url = getRootPath();

    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //点赞
    var give_us_id = "";
    $(".zan_btn").click(function () {
        give_us_id = $(this).children(".us_id").text();
        if (!token) {
            alert("登录之后才可以点赞哦");
            return;
        }
        $(".confirmMode").fadeIn("fast");
    });

    //确定点赞
    $(".ok").click(function () {
        var give_num = $(".confirm_input").val();

        Give(token, give_us_id, give_num, function (response) {
            if(response.errcode == "0"){
                $('.web_toast_text').text("点赞成功!");
                $(".web_toast").fadeIn("fast");
                $(".confirmMode").fadeOut("fast");
                setTimeout(function () {
                    $(".web_toast").fadeOut("fast");
                }, 2000);
            }
        }, function (response) {
            $('.web_toast_text').text("点赞失败");
            $(".web_toast").fadeIn("fast");
            $(".confirmMode").fadeOut("fast");
            setTimeout(function () {
                $(".web_toast").fadeOut("fast");
            }, 2000);
        });
    });

    //取消按钮
    $(".cancel").click(function () {
        $(".confirm_input").val("5");
        $(".confirmMode").fadeOut("fast");
    });
});