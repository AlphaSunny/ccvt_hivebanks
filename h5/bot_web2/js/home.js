$(function () {
    var us_id = GetCookie("us_id");
    var url = getRootPath();
    var search_pory = "", robot_alive = "", timer = "";

    // function GetQr() {
        $.get({
            url: url + "/api/bot/get_qrcode.php?us_id=" + us_id,
            async: false,
            success: function (response) {
                // search_pory = response.rows.ip_address;
                // us_id = response.rows.us_id;
                // robot_alive = response.rows.robot_alive;
                // $("#port").val(us_id);
                // $("#form").attr("action", "http://" + search_pory + "/search");
                // $("#qr_img").attr("src", response.rows.qr_path);
                if (response.rows.robot_alive == "1") {

                    // window.location.href = url+"/h5/bot_web2/home.html";
                    // $(".robot_qr,.form_box").remove();
                    // $(".success_box").fadeIn();
                    // $(".login_time").text(response.rows.login_time);
                    // $(".elapsed_time").text(response.rows.elapsed_time);
                    // $(".count").text(response.rows.count);
                }
            }
        });
    // }
});