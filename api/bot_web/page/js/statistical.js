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
    $(".zan_img").click(function () {
        if (!token) {
            alert("登录之后才可以点赞哦");
        } else {
            $(this).attr("src", "img/zan2.svg");
        }
    });
    $(document).on("click", ".alert_login", function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    })
});