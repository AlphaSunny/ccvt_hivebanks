$(function () {
    function verifyWithdraw(token) {
        let base_amount = "";
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let data = response.rows;
                base_amount = data.base_amount;
            }
        }, function (response) {
            ErrorPrompt(response);
        });
        return base_amount;
    }

//withdraw
    $('.nav_ba_withdraw').click(function () {
        let token = GetCookie('user_token');
        let base_amount = verifyWithdraw(token);
        if (base_amount <= 0) {
            // $('#noBalanceModal').modal('show');
            WarnPrompt("账户余额不足，无法进行提现");
            return;
        }
        window.location.href = "bit_withdraw.html";
    });
    $('.nav_ca_withdraw').click(function () {
        let token = GetCookie('user_token');
        let base_amount = verifyWithdraw(token);
        if (base_amount <= 0) {
            // $('#noBalanceModal').modal('show');
            WarnPrompt("账户余额不足，无法进行提现");
            return;
        }
        window.location.href = "currency_withdraw.html";
    });
});