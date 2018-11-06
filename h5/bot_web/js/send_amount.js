$(function () {
    //获取token
    var token = GetCookie("robot_token");


    var url = getRootPath();
    // $('#sendAmountTable').DataTable({
    //     "ajax": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
    //     "order": [[3, "desc"]],
    //     "deferRender":true,
    //     "columns": [
    //         {"data": "wechat"},
    //         {"data": "amount"},
    //         {"data": "num"},
    //         {"data": "send_time"}
    //     ]
    // });
    $.ajax({
        "url": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
            "type": "GET",
            success: function (data) {
            console.log(data.data);
            console.log(JSON.stringify(data));
                $('#sendAmountTable').DataTable({
                    ajax:data,
                    order: [[3, "desc"]],
                    deferRender:true,
                    data:JSON.stringify(data.data),
                    columns: [
                        {"data": "wechat"},
                        {"data": "amount"},
                        {"data": "num"},
                        {"data": "send_time"}
                    ],
                });
        }
    });
});