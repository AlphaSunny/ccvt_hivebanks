$(function () {
    //token
    var token = GetCookie("robot_token");

    //group_id
    var group_id = GetQueryString("group_id");

    //click into news record
    var status = "1";
    $(".weChatBtn").click(function () {
       $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");
       status = $(this).attr("title");
        GetNewsRecordFun(status);
   });

    function GetNewsRecordFun(status) {
        var tr = "";
        $("#chatRecordTable").DataTable({
            ajax: {
                type:"GET",
                url:"http://ccvt_test.fnying.com/api/bot_web/group_message_list.php?token=" + encodeURIComponent(token) + "&group_id=" + group_id + "&status=" + status,
                // success:function (response) {
                //     var data = response.data;
                //     $.each(data, function (i, val) {
                //         tr+="<tr>" +
                //             "<td>"+ data[i].bot_nickname +"</td>" +
                //             "<td>"+ data[i].bot_content +"</td>" +
                //             "<td>"+ data[i].bot_send_time +"</td>" +
                //             "</tr>"
                //     });
                //     $("#chatRecordTbody").html(tr);
                // },
                // fnDrawCallback:function (res) {
                //     console.log(res);
                // }
            },

            destroy:true,
            "columns": [
                {"success": "bot_nickname", "class": "bot_nickname"},
                {"success": "bot_content", "class": "bot_content"},
                {"success": "bot_send_time", "class": "bot_send_time"}
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