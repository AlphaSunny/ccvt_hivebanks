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
    })
});