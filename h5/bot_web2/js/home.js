$(function () {
    let scan = GetQueryString("scan");
    if (scan == "1") {
        $("#robot_qr_modal").modal("show");
    }

    //获取机器人运行状态
    let us_id = GetCookie("us_id");
    let url = getRootPath();
    $.get({
        url: url + "/api/bot/get_qrcode.php?us_id=" + us_id,
        async: false,
        success: function (response) {
            $(".login_time").text(response.rows.login_time);
            $(".elapsed_time").text(response.rows.elapsed_time);
            $(".count").text(response.rows.count);
        }
    });
});