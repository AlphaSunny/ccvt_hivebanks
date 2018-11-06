$(function () {
    //获取token
    var token = GetCookie("robot_token");


    var url = getRootPath();
    $('#sendAmountTable').DataTable({
        "ajax": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
        "order": [[3, "desc"]],
        "deferRender":true,
        "columns": [
            {"data": "wechat"},
            {"data": "amount"},
            {"data": "num"},
            {"data": "send_time"}
        ]
    });

    // $('#sendAmountTable').DataTable({
    //     "ajax": {
    //         "url": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
    //         "dataSrc": function (json) {
    //             console.log(json.all_amount);
    //         }
    //     }
    // "ajax": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
    // "columns": [
    //     {"data": "wechat"},
    //     {"data": "amount"},
    //     {"data": "num"},
    //     {"data": "send_time"}
    // ],
    // success:function (res) {
    //     console.log(res);
    // }
    // });
});