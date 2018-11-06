$(function () {
    //get token
    var token = GetCookie("ba_token");

    var account = "", ccvt_num = "", why = "";
    $(".confirmTransfer").click(function () {
        ShowLoading("show");
        account = $("#userNickName").val();
        ccvt_num = $("#send_amount").val();
        why = $("#sendWhy").val();
        if (account.length <= 0) {
            LayerFun("pleaseEnterOtherNickName");
            ShowLoading("hide");
            return;
        }
        if (ccvt_num.length <= 0) {
            LayerFun("pleaseEnterTransferAmount");
            ShowLoading("hide");
            return;
        }
        if (why.length <= 0) {
            LayerFun("pleaseEnterTransferReason");
            ShowLoading("hide");
            return;
        }
        $("#transferModal").modal("show");
        ShowLoading("hide");
    });

    $(".confirmTransferBtn").click(function () {
        ShowLoading("show");
        Transfer_CCVT(token, account, ccvt_num, why, function (response) {
            if(response.errcode == "0"){
                ShowLoading("hide");
                $("#transferModal").modal("hide");
                layer.msg("转账成功");
                window.location.href="BaAccount.html";
            }
        }, function (response) {
            ShowLoading("hide");
            $("#transferModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });
});