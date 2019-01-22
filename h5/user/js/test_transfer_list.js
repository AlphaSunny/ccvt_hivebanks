$(function () {
    GetUsAccount();
    let token = GetCookie("user_token");

    //transfer out list
    let limit = 10, offset = 0, type = 1;

    function TransferListFun(limit, offset, type) {
        TransferList(token, limit, offset, type, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                let data = response.rows, tr = "", count = "";
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                if (data == false) {
                    GetDataEmpty('transfer_out_list', '4');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].us_account + "</td>" +
                        "<td>" + data[i].tx_amount + "</td>" +
                        "<td>" + data[i].tx_time + "</td>" +
                        "<td>" +
                        "<span class='qa_id none' name='" + data[i].qa_id + "'></span>" +
                        "<button class='btn btn-success btn-sm transfer_confirm'>确认</button>" +
                        "<button class='btn btn-danger btn-sm transfer_cancel margin-left-10'>取消</button>" +
                        "</td>" +
                        "</tr>"
                });
                $("#transfer_out_list").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        TransferListFun(limit, (current - 1) * limit, type);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    TransferListFun(limit, offset, type);

    //confirm transfer
    $(document).on("click", ".transfer_confirm", function () {
        let qa_id = $(this).siblings(".qa_id").attr("name");
        let qa_flag = "1";
        TransferConfirmFun(qa_id, qa_flag,);
    });

    //cancel transfer
    $(document).on("click", ".transfer_cancel", function () {
        let qa_id = $(this).siblings(".qa_id").attr("name");
        let qa_flag = "2";
        TransferConfirmFun(qa_id, qa_flag,);
    });

    function TransferConfirmFun(qa_id, qa_flag) {
        TransferConfirm(token, qa_id, qa_flag, function (response) {
            if(qa_flag == "1"){
                layer.confirm('是否确定转账？', {
                    btn: ['是','否'] //按钮
                }, function(){
                    SuccessPrompt("处理成功");
                }, function(){
                });
            }else{
                layer.confirm('是否取消转账？', {
                    btn: ['是','否'] //按钮
                }, function(){
                    SuccessPrompt("处理成功");
                }, function(){
                });
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    }

    //transfer in list
    let limit_in = 10, offset_in = 0, type_in = 2;

    function TransferInListFun(limit_in, offset_in, type_in) {
        TransferList(token, limit_in, offset_in, type_in, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                let data = response.rows, tr = "", count = "";
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                if (data == false) {
                    GetDataEmpty('transfer_in_list', '3');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].us_account + "</td>" +
                        "<td>" + data[i].tx_amount + "</td>" +
                        "<td>" + data[i].tx_time + "</td>" +
                        "</tr>"
                });
                $("#transfer_out_list").html(tr);

                $("#pagination_in").pagination({
                    currentPage: (limit_in + offset_in) / limit_in,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        TransferListFun(limit_in, (current - 1) * limit_in, type_in);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    TransferInListFun(limit_in, offset_in, type_in);


});