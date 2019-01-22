$(function () {
    GetUsAccount();
    var token = GetCookie("user_token");
    var is_pass_hash = "";

    //get bind info
    BindingInformation(token, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
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
        var account = $("#payee").val();
        var code = $("#invite_code").val();
        var ccvt_num = $("#amount").val();
        var pass_hash = hex_sha1($("#fun_pass").val());
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
            $("#transfer_success_modal").fadeIn(300);
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    $(".transform_ccvt_confirm_btn").click(()=>{
        window.location.href = "account.html";
    });

    //transfer list
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
                    GetDataEmpty('transfer_out_list', '3');
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
        layer.confirm('是否确定转账？', {
            btn: ['是','否'] //按钮
        }, function(){
            ShowLoading("show");
            TransferConfirmFun(qa_id, qa_flag,);
        }, function(){
        });
    });

    //cancel transfer
    $(document).on("click", ".transfer_cancel", function () {
        let qa_id = $(this).siblings(".qa_id").attr("name");
        let qa_flag = "2";
        layer.confirm('是否取消转账？', {
            btn: ['是','否'] //按钮
        }, function(){
            ShowLoading("show");
            TransferConfirmFun(qa_id, qa_flag,);
        }, function(){
        });
    });

    function TransferConfirmFun(qa_id, qa_flag) {
        TransferConfirm(token, qa_id, qa_flag, function (response) {
            SuccessPrompt("处理成功");
            ShowLoading("hide");
            TransferListFun(limit, offset, type);
        }, function (response) {
            ErrorPrompt(response.errmsg);
            ShowLoading("hide");
        })
    }

    //**********
    let _limit = 10, _offset = 0, _type = 2;

    function _TransferListFun(_limit, _offset, _type) {
        TransferList(token, _limit, _offset, _type, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                let data = response.rows, tr = "", count = "";
                let total = response.total;
                let totalPage = Math.ceil(total / _limit);
                let type = "";
                let status = "";
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
                    if (data[i].in_or_out == "in") {
                        type = "<span class='i18n' name='us_us_transfer_in'></span>"
                    } else if (data[i].in_or_out == "out") {
                        type = "<span class='i18n' name='us_us_transfer_out'></span>"
                    } else {
                        type = "<span class='i18n' name='invalidOrder'></span>"
                    }

                    if (data[i].qa_flag == "1") {
                        status = "<span class='i18n' name='confirmed'></span>"
                    } else if (data[i].status == "2") {
                        status = "<span class='i18n' name='canceled'></span>"
                    } else {
                        status = "<span class='i18n' name='invalidOrder'></span>"
                    }
                    tr += "<tr>" +
                        "<td>" + type + "</td>" +
                        "<td>" + data[i].tx_amount + "</td>" +
                        "<td>" + data[i].us_account + "</td>" +
                        "<td>" + data[i].tx_time + "</td>" +
                        "<td>" + status + "</td>" +
                        "</tr>"
                });
                $("#transfer_in_list").html(tr);
                execI18n();

                $("#pagination2").pagination({
                    currentPage: (_limit + _offset) / _limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        _TransferListFun(_limit, (current - 1) * _limit, type);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    _TransferListFun(_limit, _offset, _type);
});