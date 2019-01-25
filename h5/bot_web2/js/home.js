$(function () {
    let scan = GetQueryString("scan");
    if(scan == "1"){

    }

    //获取机器人运行状态
    let us_id = GetCookie("us_id");
    let url = getRootPath();
        $.get({
            url: url + "/api/bot/get_qrcode.php?us_id=" + us_id,
            async: false,
            success: function (response) {
                // if (response.rows.robot_alive == "1") {
                    $(".login_time").text(response.rows.login_time);
                    $(".elapsed_time").text(response.rows.elapsed_time);
                    $(".count").text(response.rows.count);
                // }
            }
        });
});