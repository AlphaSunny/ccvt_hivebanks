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
                GetDataEmpty('bit_recharge_box', '3');
                return;
            }
            $.each(data, function (i, val) {
                tr += "<tr>" +
                    "<td class='bit_type'>" + data[i].bit_type.toUpperCase() + "</td>" +
                    "<td>" +
                    "<span>1<span>" + data[i].bit_type.toUpperCase() + "</span></span>" +
                    "<span>=<span>" + data[i].base_rate + "</span>" + base_type + "</span>" +
                    "</td>" +
                    "<td class='text-right'><button class='btn btn-success btn-sm recharge_btn' name='recharge'>充值</button></td>" +
                    "</tr>"
            });
            $('#bit_recharge_box').html(tr);
            // execI18n();
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Click to select recharge
    $(document).on('click', '.recharge_btn', function () {
        let val = $(this).parents("tr").find(".bit_type").text();
        SetCookie('re_bit_type', val);
        window.location.href = "../ba/BaRecharge.html";
    });

    // BA recharge recode
    let limit = 10, offset = 0,
        ba_api_url = 'log_ba_recharge.php';
    function BitRechargeList(token, limit, offset, ba_api_url){
        AllRecord(token, limit, offset, ba_api_url, function (response) {
            if (response.errcode == '0') {
                let data = response.rows, tr = '',count = "";
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

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        BitRechargeList(token, limit, (current - 1) * limit, ba_api_url);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            GetDataFail('baRechargeCodeTable', '4');
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
        });
    }
    BitRechargeList(token, limit, offset, ba_api_url)
});
