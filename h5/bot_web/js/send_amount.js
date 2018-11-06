$(function () {
    //获取token
    var token = GetCookie("robot_token");


    var url = getRootPath();
    $('#sendAmountTable').DataTable({
        "ajax": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
        "columns": [
            {"data": "wechat", "orderData" : false},
            {"data": "amount"},
            {"data": "num"},
            {"data": "send_time", "orderData": true}
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