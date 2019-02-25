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

    $("#payee").blur(() => {
        let account = $("#payee").val();
        console.log(account);
        let code = "";
        if (account.length <= 0) {
            ErrorPrompt("请输入对方账户昵称");
            return;
        } else {
            UsTransferSelInfoFun(account, code);
        }
    });

    $("#invite_code").blur(() => {
        let code = $("#invite_code").val();
        console.log(code);
        let account = "";
        if (code.length <= 0) {
            ErrorPrompt("请输入对方邀请码");
            return;
        } else {
            UsTransferSelInfoFun(account, code);
        }
    });

    function UsTransferSelInfoFun(account, code) {
        ShowLoading("show");
        UsTransferSelInfo(token, account, code, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                if (account.length > 0) {
                    $("#invite_code").val(response.result);
                }
                if (code.length > 0) {
                    $("#payee").val(response.result);
                }
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    //transfer
    $(".transfer_btn").click(() => {
        let account = $("#payee").val();
        let code = $("#invite_code").val();
        let ccvt_num = $("#amount").val();
        let pass_hash = hex_sha1($("#fun_pass").val());
        if (account.length <= 0) {
            WarnPrompt("请输入收款账号");
            return;
        }
        if (ccvt_num.length <= 0) {
            WarnPrompt("请输入转账金额");
            return;
        }
        if (parseInt(ccvt_num) > 1000000) {
            WarnPrompt("转账金额最大1000000");
            return;
        }
        if (pass_hash.length <= 0) {
            WarnPrompt("请输入资金密码");
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
            if (response.errcode == "0") {
                ShowLoading("hide");
                layer.closeAll('dialog');
                $(".transfer_account").text(account);
                $(".transfer_amount").text(ccvt_num);
                $("#transfer_success_modal").removeClass("none");
            }
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    $(".transform_ccvt_confirm_btn").click(() => {
        window.location.href = "transfer_list.html";
    });
});