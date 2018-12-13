$(function () {
    //获取token
    var token = GetCookie("robot_token");

    //获取对应id
    var group_id = GetQueryString("group_id");

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

    function GetGroupMemberFun() {
        var tr = "";
        GetGroupMember(token, group_id,limit, offset,status, function (response) {
            console.log(response);
                var data = response.data;
                $.each(data, function (i, val) {
                    console.log(data);
                    tr += "<tr>" +
                        "<td>" + data[i].name + "</td>" +
                        "</tr>"
                });
                $("#groupMember").html(tr);
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetGroupMemberFun();

});