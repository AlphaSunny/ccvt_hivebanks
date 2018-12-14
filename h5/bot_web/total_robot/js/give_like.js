$(function () {
    //获取token
    var token = GetCookie("total_robot_token");

    var limit = 10, offset = 0;

    function GiveLikeListFun(token, limit, offset) {
        var tr = "",totalPage = "", count = "";
        GiveLikeList(token, limit, offset, function (response) {
            ShowLoading("hide");
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
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>"
                } else {
                    $.each(data, function (i, val) {
                        tr += "<tr>" +
                            "<td>" + data[i].give_account + "</td>" +
                            "<td>" + data[i].receive_account + "</td>" +
                            "<td>" + data[i].tx_amount + "</td>" +
                            "<td>" + data[i].utime + "</td>" +
                            "</tr>"
                    })
                }
                $("#giveLike").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GiveLikeListFun(token, limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        });
    }
    GiveLikeListFun(token, limit, offset);
});