$(function () {
    let token = GetCookie('user_token');

    function verifyWithdraw(type) {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let base_amount = response.rows.base_amount;
                console.log(base_amount);
                if (base_amount <= 0) {
                    // $('#noBalanceModal').modal('show');
                    WarnPrompt("账户余额不足，无法进行提现");
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
        verifyWithdraw("ca_withdraw");
    });
});