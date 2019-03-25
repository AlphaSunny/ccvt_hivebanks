$(function () {
    let token = GetCookie('user_token');

    function verifyWithdraw(type) {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let base_amount = response.rows.base_amount;
                let scale = parseInt(response.rows.scale);
                if (base_amount <= 0) {
                    WarnPrompt("账户余额不足，无法进行提现");
                    return;
                }
                if (scale < 2) {
                    //     WarnPrompt("荣耀等级不足2级，无法进行提现");
                    //     return;
                    $("#withdraw_dropdown").remove();
                    $("#withdraw_menu").remove();
                }
                if (type == "ba_withdraw") {
                    window.location.href = getRootPath() + "/h5/user/bit_withdraw.html";
                }
                if (type == "ca_withdraw") {
                    window.location.href = getRootPath() + "/h5/user/currency_withdraw.html";
                }

            }
        }, function (response) {
            ErrorPrompt(response);
        });
    }

    verifyWithdraw("show_none");

//withdraw
    $('.nav_ba_withdraw').click(function () {
        verifyWithdraw("ba_withdraw");
    });
    $('.nav_ca_withdraw').click(function () {
        verifyWithdraw("ca_withdraw");
    });
});