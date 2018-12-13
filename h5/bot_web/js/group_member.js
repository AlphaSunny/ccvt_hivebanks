$(function () {
    //获取token
    var token = GetCookie("robot_token");

    //获取对应id
    var group_id = GetQueryString("group_id");
    var _group_name = GetQueryString("group_name");
    var group_name = decodeURI(_group_name);
    $(".group_name").text(group_name);

    // var url = getRootPath();
    // $('#groupMemberTable').DataTable({
    //     "ajax": url + "/api/bot_web/group_members_list.php?token=" + encodeURIComponent(token) + "&group_id=" + group_id+ "&status=" + status,
    //     "deferRender":true,
    //     "columns": [
    //         {"data": "name"}
    //     ]
    // });

    //查看聊天记录
    $(".lookChatCode").click(function () {
        window.location.href = "chat_record.html?group_id=" + group_id;
    });

    //获取群成员列表
    var limit = 10, offset = 0, status = "-1";

    function GetGroupMemberFun(token, limit, offset, status) {
        var tr = "", totalPage = "", count = "";
        GetGroupMember(token, group_id, limit, offset, status, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                totalPage = response.total;
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    console.log(data);
                    tr += "<tr>" +
                        "<td>" + data[i].name + "</td>" +
                        "</tr>"
                });
                $("#groupMember").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetGroupMemberFun(token, limit, (current - 1) * limit,status)
                    }
                });
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetGroupMemberFun(token, limit, offset, status);

});