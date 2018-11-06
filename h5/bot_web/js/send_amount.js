$(function () {
    //获取token
    var token = GetCookie("robot_token");


    var url = getRootPath();

    $.ajax({
        "url": url + "/api/bot_web/iss_records_list.php?token=" + encodeURIComponent(token),
            "type": "GET",
            success: function (data) {
            $(".all_amount").text(data.all_amount);
            $(".all_chat").text(data.all_chat);
                $('#sendAmountTable').DataTable({
                    order: [[3, "desc"]],
                    deferRender:true,
                    data:data.data,
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