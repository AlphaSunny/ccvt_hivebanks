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
            TransferCCVTFun(token, account, ccvt_num, pass_hash);
        }, function () {

        });
    });

    function TransferCCVTFun(token, account, ccvt_num, pass_hash) {
        ShowLoading("show");
        TransferCCVT(token, account, ccvt_num, pass_hash, function (response) {
            ShowLoading("hide");
            layer.msg("转账成功", {icon: 1});
            window.location.href = "account.html";
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        });
    }
});