$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if(response.errcode == '0'){
            var data =response.rows;
            if(data.qa_flag == '0'){
                $('.enablePending').attr('name', 'enablePending');
                execI18n();
            }
            $('.tx_hash').text(data.tx_hash);
            $('.caWithdrawAmount').text(data.lgl_amount);
            $('.handlingFee').text(data.tx_fee);
            $('.time').text(data.tx_time);
        }
    }, function (response) {
        LayerFun(response.errcode);
    })

});