$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if(response.errcode == '0'){
            let data =response.rows;
            if(data.qa_flag == '0'){
                $('.enablePending').attr('name', 'enablePending');
                execI18n();
            }
            $('.tx_hash').text(data.tx_hash);
            $('.caWithdrawAmount').text(data.lgl_amount);
            $('.handlingFee').text(data.tx_fee);
            $('.time').text(data.tx_time);
            console.log(data.tx_time);
            console.log(new Date(parseInt(data.tx_time) * 1000).toLocaleString());
        }
    }, function (response) {
        LayerFun(response.errcode);
    })

});