$(function () {
    let token = GetCookie("user_token");
    let group_id = GetCookie("group_id");

    //获取群成员列表
    let limit = 10, offset = 0, status = "-1", loading = "";

    function GetGroupMemberFun(token, limit, offset, status) {
        let tr = "", totalPage = "", count = "";
        GetGroupMember(token, group_id, limit, offset, status, function (response) {
            layer.close(loading);
            if (response.errcode == "0") {
                let data = response.rows;
                if(data==""){
                    $("#groupMember").html("<tr><td colspan='2'>暂无数据</td></tr>");
                    return;
                }
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
                        "<td style='text-align: left'>" + data[i].name + "</td>" +
                        "<td style='text-align: left'>" + data[i].chat_num + "</td>" +
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
});