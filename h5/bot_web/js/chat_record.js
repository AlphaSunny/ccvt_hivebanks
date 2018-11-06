$(function () {
    //token
    var token = GetCookie("robot_token");

    //group_id
    var group_id = GetQueryString("group_id");

    //click into news record
    var status = "1";
    var url = getRootPath();
    $(".weChatBtn").click(function () {
       $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");
       status = $(this).attr("title");
        GetNewsRecordFun(status);
   });

    function GetNewsRecordFun(status) {
        $("#chatRecordTable").DataTable({
            "ajax":url + "/api/bot_web/group_message_list.php?token=" + encodeURIComponent(token) + "&group_id=" + group_id + "&status=" + status,
            destroy:true,
            "deferRender":true,
            "columns": [
                {"data": "bot_nickname", "class": "bot_nickname"},
                {"data": "bot_content", "class": "bot_content"},
                {"data": "bot_send_time", "class": "bot_send_time"}
            ],
        });
    }
    //     GetNewsRecord(token, group_id, status, function (response) {
    //         console.log(response);
    //     }, function (response) {
    //         layer.msg("获取失败,请稍后重试！");
    //     });
    // }
    GetNewsRecordFun(status);
});