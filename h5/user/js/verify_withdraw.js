$(function () {
    let base_amount = "";
    function verifyWithdraw(token) {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let data = response.rows;
                base_amount = data.base_amount;
            }
        }, function (response) {
            ErrorPrompt(response);
        });
    }

//withdraw
    $('.nav_ba_withdraw').click(function () {
        let token = GetCookie('user_token');
        verifyWithdraw(token);
        if (base_amount <= 0) {
            // $('#noBalanceModal').modal('show');
            WarnPrompt("账户余额不足，无法进行提现");
            return;
        }
        window.location.href = "bit_withdraw.html";
    });
    $('.nav_ca_withdraw').click(function () {
        let token = GetCookie('user_token');
        verifyWithdraw(token);
        if (base_amount <= 0) {
            // $('#noBalanceModal').modal('show');
            WarnPrompt("账户余额不足，无法进行提现");
            return;
        }
        window.location.href = "currency_withdraw.html";
    });
});