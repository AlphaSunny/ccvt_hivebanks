$(function () {
    //获取机器人运行状态
    var us_id = GetCookie("us_id");
    var url = getRootPath();
        $.get({
            url: url + "/api/bot/get_qrcode.php?us_id=" + us_id,
            async: false,
            success: function (response) {
                if (response.rows.robot_alive == "1") {
                    $(".login_time").text(response.rows.login_time);
                    $(".elapsed_time").text(response.rows.elapsed_time);
                    $(".count").text(response.rows.count);
                }
            }
        });
});