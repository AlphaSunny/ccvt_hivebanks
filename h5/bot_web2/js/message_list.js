$(function () {
    //token
    var token = GetCookie("user_token");
    var group_id = GetCookie("group_id");
    var status = "4";
    //获取消息列表
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
    GetNewsRecordFun(status);

    // GetNewsRecord(token, group_id, status, function (response) {
    // }, function (response) {
    //     console.log(response.data);
    //     var data = response.data;
    //     if (!data) {
    //         $(".no_data").text("暂无数据");
    //         return;
    //     }
    //
    //     $.each(data, function (i, val) {
    //
    //     })
    // })
});