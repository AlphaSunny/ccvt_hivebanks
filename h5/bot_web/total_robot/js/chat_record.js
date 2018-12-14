$(function () {
    //token
    var token = GetCookie("total_robot_token");

    //group_id
    var group_id = GetQueryString("group_id");

    //click into news record
    var status = "1";
    // var url = getRootPath();
    $(".weChatBtn").click(function () {
        $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");
        status = $(this).attr("title");
        GetNewsRecordFun(status);
    });

    function GetNewsRecordFun(status) {
        // $("#chatRecordTable").DataTable({
        //     "ajax":url + "/api/bot_web/admin/group_message_list.php?token=" + encodeURIComponent(token) + "&group_id=" + group_id + "&status=" + status,
        //     destroy:true,
        //     "deferRender":true,
        //     "columns": [
        //         {"data": "bot_nickname", "class": "bot_nickname"},
        //         {"data": "bot_content", "class": "bot_content"},
        //         {"data": "bot_send_time", "class": "bot_send_time"}
        //     ],
        // });
        var tr = "";
        GetNewsRecord(token, group_id, status, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    tr="<tr><td colspan='3'>暂无数据</td></tr>"
                }else {
                    $.each(data,function (i, val) {
                        tr+="<tr>" +
                            "<td>"+ data[i].bot_nickname +"</td>" +
                            "<td>"+ data[i].bot_content +"</td>" +
                            "<td>"+ data[i].bot_send_time +"</td>" +
                            "</tr>"
                    })
                }
                $("#chatRecordT").html(tr);
                // $("#pagination").pagination({
                //     currentPage: (limit + offset) / limit,
                //     totalPage: totalPage,
                //     isShow: false,
                //     count: count,
                //     prevPageText: "<<",
                //     nextPageText: ">>",
                //     callback: function (current) {
                //         GetGroupMemberFun(token, limit, (current - 1) * limit, status);
                //         loading = layer.load(1, {
                //             shade: [0.1, '#fff'] //0.1透明度的白色背景
                //         });
                //     }
                // });
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    GetNewsRecordFun(status);
})
;