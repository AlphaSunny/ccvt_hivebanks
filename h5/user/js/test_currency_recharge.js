$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    let base_type = GetCookie('benchmark_type');


    //CA recharge to get the average exchange rate
    let recharge_rate = '', api_url = 'average_ca_recharge_rate.php';
    GetAverageRate(api_url, token, function (response) {
        if (response.errcode == '0') {
            if (response.recharge_rate == '0') {
                $('.currentRechargeRateBox, .legalRechargeBox').remove();
                $('.legalTitle').attr('name', 'noLegalCurrencyAgent');
                execI18n();
                return;
            }
            $('.recharge_rate').text(response.recharge_rate);
            recharge_rate = (response.recharge_rate);
            $('.bit_amount').val(response.recharge_rate);
        }
    }, function (response) {
        // LayerFun(response.errcode);
        ErrorPrompt(response.errmsg);
    });

    //Enter the recharge amount binding input box
    $('.bit_amount').bind('input porpertychange', function () {
        $('.base_amount').val($(this).val() / recharge_rate);
        $('.payRechargeAmount').text($(this).val());
    });
    $('.base_amount').bind('input porpertychange', function () {
        $('.bit_amount').val($(this).val() * recharge_rate);
        $('.payRechargeAmount').text($('.bit_amount').val());
    });

    //Ca recharge the next step
    $('.enableAmount').click(function () {
        if ($('.bit_amount').val().length <= 0) {
            LayerFun('rechargeAmountNotEmpty');
            return
        }
        let base_amount = $('.base_amount').val();
        let us_recharge_bit_amount = $('.bit_amount').val();
        window.location.href = '../ca/CaRecharge.html?base_amount=' + base_amount + '&bit_amount=' + us_recharge_bit_amount;
    });

    // CA recharge recode
    let ca_api_url = 'log_ca_recharge.php';
    let limit = 10, offset = 0;

    function CurrencyRechargeList(token, limit, offset, ca_api_url) {
        AllRecord(token, limit, offset, ca_api_url, function (response) {
            if (response.errcode == '0') {
                let data = response.rows, tr = '', count = "";
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data == false) {
                    GetDataEmpty('caRechargeCodeTable', '4');
                    return;
                }
                $.each(data, function (i, val) {
                    // ca_tx_hash_arr.push(data[i].tx_hash.substr(0, 20) + '...');
                    tr += '<tr>' +
                        '<td title=' + data[i].tx_hash + '>' + data[i].tx_hash + '</td>' +
                        '<td>' + data[i].lgl_amount + '</td>' +
                        '<td>' + data[i].base_amount + '</td>' +
                        '<td>' + data[i].tx_time + '</td></tr>';
                });
                $('#caRechargeCodeTable').html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        CurrencyRechargeList(token, limit, (current - 1) * limit, ca_api_url);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
            GetDataEmpty('caRechargeCodeTable', '4');
        });
    }

    CurrencyRechargeList(token, limit, offset, ca_api_url);
});
