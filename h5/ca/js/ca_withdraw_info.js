$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            if (data.qa_flag == '0') {
                $('.enablePending').attr('name', 'enablePending');
                execI18n();
            }
            $('.tx_hash').text(data.tx_hash);
            $('.caWithdrawAmount').text(data.lgl_amount);
            $('.handlingFee').text(data.tx_fee);
            $('.id_card').text(data.id_card.replace(/(.{4})/g, "$1-"));
            $('.time').text(ToHour(data.tx_time));
        }
    }, function (response) {
        LayerFun(response.errcode);
    })

});