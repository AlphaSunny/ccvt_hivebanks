$(function(){
    let token = GetCookie('ca_token');
    let benchmark_type = GetUsCookie('benchmark_type');
    let ca_currency = GetUsCookie('ca_currency');
    GetCaAccount();

    //Get user recharged processed order list
    let api_url = 'log_us_withdraw.php', type = '2', tr = '', bit_address=[], tx_hash = [], limit = 10, offst = 0;
    GetRechargeWithdrawList(api_url, token, type, function (response){

        if(response.errcode == '0'){
            let data = response.rows;
            if(data == false){
                GetDataEmpty('withdrawPendingTable', '6');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="withdrawPendingList">' +
                    '<td>' + data[i].us_id + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td><span>' + benchmark_type + '</span>/<span>'+ ca_currency +'</span></td>' +
                    // '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><span>'+ data[i].tx_hash +'</span></td>' +
                    '<td><span class="i18n" name="processed"></span></td>' +
                    '</tr>'
            });
            $('#withdrawPendingTable').html(tr);
            execI18n();
        }
    },function (response){
        GetDataFail('withdrawPendingTable', '6');
        LayerFun(response.errcode);
        return;
    });
});