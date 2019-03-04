$(function () {
    //get token
    let token = GetCookie('la_token');

    //get reward
    let type = "5", limit = 10, offset = 0;

    function GetRewardFun(type, limit, offset) {
        let total = "", totalPage = "", count = "", tr = "";
        GetRewardList(token, type,limit,offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td class='text-center' colspan='4'>暂无数据</td></tr>"
                }
                total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (totalPage > 1 && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].us_account + "</td>" +
                        "<td>" + data[i].tx_detail + "</td>" +
                        "<td>" + data[i].amount + "</td>" +
                        "<td>" + data[i].gift_time + "</td>" +
                        "</tr>"
                });
                $("#rewardTransfer").html(tr);
                // $('#rewardTable').DataTable({
                //     order: [[2, "desc"]],
                //     destroy: true,
                //     deferRender: true,
                //     data: response.rows,
                //     columns: [
                //         {"data": "us_account"},
                //         {"data": "tx_detail"},
                //         {"data": "amount"},
                //         {"data": "gift_time"},
                //     ],
                // });
                //显示页码
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        ShowLoading("show");
                        GetRewardFun(type, limit, (current - 1) * limit);
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
        })
    }

    GetRewardFun(type, limit, offset);

    $("#filter_send").on("change", function () {
        var type = $(this).find("option:selected").val();
        GetRewardFun(type, limit, offset);
    })
});