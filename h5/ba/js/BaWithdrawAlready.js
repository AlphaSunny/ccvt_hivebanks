$(function(){
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //Get the baseline type
    var base_type = GetCookie('benchmark_type');

    //Get user recharged processed order list
    var api_url = 'log_us_withdraw.php', type = '2', tx_hash = [], limit = 10, offst = 0;
    function RechargeWithdrawCodeQueryFun(limit, offset){
        var tr = '', count = "";
        RechargeWithdrawCodeQuery(token, api_url, type,limit, offset, function (response){
            if(response.errcode == '0'){
                var data = response.rows;
                var total = response.total;
                var totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if(data.length <= 0){
                    GetDataEmpty('withdrawPendingTable', '7');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr class="withdrawPendingList">' +
                        '<td>' + data[i].us_id + '</td>' +
                        '<td>' + data[i].base_amount + '</td>' +
                        '<td><span>' + data[i].asset_id + '</span>/<span>' + base_type + '</span></td>' +
                        '<td><span>' + data[i].bit_address + '</span></td>' +
                        '<td><span>' + data[i].tx_time + '</span></td>' +
                        '<td><span class="" name="">' + data[i].tx_hash + '</span></td>' +
                        '<td><span class="i18n" name="processed">processed</span></td>' +
                        '</tr>'
                });
                $('#withdrawPendingTable').html(tr);
                execI18n();
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        RechargeWithdrawCodeQueryFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        },function (response){
            GetDataFail('withdrawPendingTable');
            LayerFun(response.errcode);
            return;
        });
    }
    RechargeWithdrawCodeQueryFun(limit, offset);

});