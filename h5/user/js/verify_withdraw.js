$(function () {
    let token = GetCookie('user_token');

    function verifyWithdraw(type) {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let base_amount = response.rows.base_amount;
                let scale = parseInt(response.rows.scale);
                if (base_amount <= 0) {
                    // $('#noBalanceModal').modal('show');
                    WarnPrompt("账户余额不足，无法进行提现");
                    return;
                }
                if(scale < 2){
                    WarnPrompt("荣耀等级不足2级，无法进行提现");
                    return;
                }
                if (type == "ba_withdraw") {
                    window.location.href = "bit_withdraw.html";
                }
                if (type == "ca_withdraw") {
                    window.location.href = "currency_withdraw.html";
                }

            }
        }, function (response) {
            ErrorPrompt(response);
        });
    }

//withdraw
    $('.nav_ba_withdraw').click(function () {
        verifyWithdraw("ba_withdraw");
    });
    $('.nav_ca_withdraw').click(function () {
        // WarnPrompt("Ca提现功能暂未开通");
        // return;
        verifyWithdraw("ca_withdraw");
    });
});