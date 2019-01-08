$(function () {
    //获取token
    var token = GetCookie("total_robot_token");

    //获取对应id
    var group_id = GetQueryString("group_id");
    var _group_name = GetQueryString("group_name");
    var group_name = decodeURI(_group_name);
    $(".group_name").text(group_name);

    //查看聊天记录
    $(".lookChatCode").click(function () {
        window.location.href = "chat_record.html?group_id=" + group_id;
    });

    //获取群成员列表
    var limit = 10, offset = 0, status = "-1", loading = "";

    function GetGroupMemberFun(token, limit, offset, status) {
        var tr = "", totalPage = "", count = "";
        GetGroupMember(token, group_id, limit, offset, status, function (response) {
            layer.close(loading);
            if (response.errcode == "0") {
                var data = response.rows;
                totalPage = Math.floor(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].name + "</td>" +
                        "<td>" + data[i].chat_num + "</td>" +
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
                        GetGroupMemberFun(token, limit, (current - 1) * limit, status);
                        loading = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                        });
                    }
                });
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg);
        })
    }

    GetGroupMemberFun(token, limit, offset, status);

    //查看某一段/天
    $(".click_day").click(function () {
        status = $(this).attr("name");
        loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        GetGroupMemberFun(token, limit, offset, status);
    })

});