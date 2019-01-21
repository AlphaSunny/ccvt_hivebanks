$(function () {
    GetUsAccount();
    let token = GetCookie("user_token");
    let is_pass_hash = "";

    //get bind info
    BindingInformation(token, function (response) {
        if (response.errcode == "0") {
            let data = response.rows;
            $.each(data, function (i, val) {
                if (data[i].bind_name == "pass_hash" && data[i].bind_flag == "1") {
                    is_pass_hash = "is_pass_hash";
                }
            });
            if (!is_pass_hash) {
                $("#not_bind_funPass_modal").fadeIn();
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    $(".exchange_confirm_btn").click(function () {
        window.location.href = "./fundPasswordBind.html?transfer_funPass=transfer_funPass";
    });

    //transfer
    $(".transfer_btn").click(() => {
        let account = $("#payee").val();
        let code = $("#invite_code").val();
        let ccvt_num = $("#amount").val();
        let pass_hash = hex_sha1($("#fun_pass").val());
        if (account.length <= 0) {
            layer.msg("请输入收款账号");
            return;
        }
        if (ccvt_num.length <= 0) {
            layer.msg("请输入转账金额");
            return;
        }
        if (pass_hash.length <= 0) {
            layer.msg("请输入资金密码");
            return;
        }

        //是否确认转账
        layer.confirm('是否确定向' + account + '转账?', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            TransferCCVTFun(token, account, code, ccvt_num, pass_hash);
        }, function () {

        });
    });

    function TransferCCVTFun(token, account, code, ccvt_num, pass_hash) {
        ShowLoading("show");
        TransferCCVT(token, account, code, ccvt_num, pass_hash, function (response) {
            ShowLoading("hide");
            layer.closeAll('dialog');
            $(".transfer_account").text(account);
            $(".transfer_amount").text(ccvt_num);
            $("#transfer_success_modal").removeClass("none");
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    $(".transform_ccvt_confirm_btn").click(() => {
        window.location.href = "test_account.html";
    });

    //transfer list
    let limit = 10, offset = 0, type = 1;
    function TransferListFun(limit, offset, type) {
        TransferList(token, limit, offset, type, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                let data = response.rows, tr = "",count = "";
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
                    GetDataEmpty('transfer_out_list', '3');
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

    TransferListFun(limit, offset, type)

});