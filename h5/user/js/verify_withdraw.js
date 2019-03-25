$(function () {
    let token = GetCookie('user_token');
    let scale = GetCookie('scale');
    if (!scale) {
        verifyWithdraw("show_none");
    } else {
        if (scale < 2) {
            $(".withdraw_content_nav").remove();
        } else {
            $(".withdraw_content_nav").removeClass("none");
        }
    }

    function verifyWithdraw(type) {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                let base_amount = response.rows.base_amount;
                scale = parseInt(response.rows.scale);
                if (base_amount <= 0) {
                    WarnPrompt("账户余额不足，无法进行提现");
                    return;
                }
                if (scale < 2) {
                    $(".withdraw_content_nav").remove();
                } else {
                    $(".withdraw_content_nav").removeClass("none");
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

//withdraw
    $('.nav_ba_withdraw').click(function () {
        verifyWithdraw("ba_withdraw");
    });
    $('.nav_ca_withdraw').click(function () {
        verifyWithdraw("ca_withdraw");
    });
});