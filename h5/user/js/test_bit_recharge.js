$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    let base_type = GetCookie('benchmark_type');

    //get ba recharge list
    let api_url = 'us_get_recharge_ba_list.php';
    GetBaRateList(api_url, token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows, tr = '';
            if (data == false) {
                $('.bitAgentTitle').attr('name', 'noDigitalCurrencyAgent');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                tr += "<tr>" +
                    "<td>" + data[i].bit_type.toUpperCase() + "</td>" +
                    "<td>" +
                    "<span>1<span>" + data[i].bit_type.toUpperCase() + "</span></span>" +
                    "<span>=<span>" + data[i].base_rate + "</span>" + base_type + "</span>" +
                    "</td>" +
                    "<td> > </td>" +
                    "</tr>"
            });
            $('#bit_recharge_box').html(tr);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Click to select recharge
    $(document).on('click', '.digital-inner-box li', function () {
        let val = $(this).children("span").text().trim();
        SetCookie('re_bit_type', val);
        window.location.href = "../ba/BaRecharge.html";
    });

    // BA recharge recode
    let limit = 10, offset = 0,
        ba_api_url = 'log_ba_recharge.php';
    AllRecord(token, limit, offset, ba_api_url, function (response) {
        if (response.errcode == '0') {
            let data = response.rows, tr = '';
            if (data == false) {
                GetDataEmpty('baRechargeCodeTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr>' +
                    '<td><span>' + data[i].tx_hash + '</span></td>' +
                    '<td><span>' + data[i].asset_id + '</span></td>' +
                    '<td><span>' + data[i].base_amount + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '</tr>'
            });
            $("#baRechargeCodeTable").html(tr);
        }
    }, function (response) {
        GetDataFail('baRechargeCodeTable', '4');
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });
});
