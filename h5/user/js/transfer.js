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
        var payee = $("#payee").val();
        var amount = $("#amount").val();
        var fun_pass = $("#fun_pass").val();
        if (payee.length <= 0) {
            layer.msg("请输入首款账号");
            return;
        }
        if (amount.length <= 0) {
            layer.msg("请输入转账金额");
            return;
        }
        if (fun_pass.length <= 0) {
            layer.msg("请输入资金密码");
            return;
        }

        layer.msg("即将开通转账功能");
        //loading层
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });

        layer.close(loading);
    })
});