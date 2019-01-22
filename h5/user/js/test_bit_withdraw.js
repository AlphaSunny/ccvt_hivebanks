$(function () {
    //get token;
    let token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    let base_type = GetCookie('benchmark_type');

    //Get ba withdrawal list
    let api_url = 'us_get_withdraw_ba_list.php';
    GetBaRateList(api_url, token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows, tr = '';

            if (data == false) {
                GetDataEmpty('bit_withdraw_box', '3');
                return;
            }
            $.each(data, function (i, val) {
                tr += "<tr>" +
                    "<td class='bit_type'>" + data[i].bit_type.toUpperCase() + "</td>" +
                    "<td>" +
                    "<span>1<span>" + data[i].bit_type.toUpperCase() + "</span></span>" +
                    "<span>=<span>" + data[i].base_rate + "</span>" + base_type + "</span>" +
                    "</td>" +
                    "<td class='text-right'><button class='btn btn-success btn-sm withdraw_btn' name='withdraw'>提现</button></td>" +
                    "</tr>"
            });
            $('#bit_withdraw_box').html(tr);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Get user binding information
    let us_bind_type_name = '', us_bind_type_idNum = '', us_bind_type_file = '', us_bind_name_idPhoto = '';
    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            $.each(data, function (i, val) {
                if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto' && data[i].bind_flag == "1") {
                    us_bind_type_file = 'file';
                    us_bind_name_idPhoto = 'idPhoto';
                }
                if (data[i].bind_type == 'text' && data[i].bind_name == 'name' && data[i].bind_flag == "1") {
                    us_bind_type_name = 'name'
                }
                if (data[i].bind_type == 'text' && data[i].bind_name == 'idNum' && data[i].bind_flag == "1") {
                    us_bind_type_idNum = 'idNum'
                }
            });
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //Click to select cash
    $(document).on('click', '.withdraw_btn', function () {
        if (us_bind_type_name != 'name' || us_bind_type_idNum != 'idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        } else {
            let val = $(this).parents("tr").find(".bit_type").text();
            SetCookie('wi_bit_type', val);
            window.location.href = "../ba/BaWithdraw.html";
        }
    });

    //Get user account balance display
    let us_base_amount = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            us_base_amount = response.rows.base_amount;
            $('.us_base_amount').text(response.rows.base_amount);
            if (response.rows.base_amount <= 0) {
                $('.insufficientBalance').show().siblings('span').remove();
            } else {
                $('.fullWithdrawal').show().siblings('span').remove();
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    // BA withdrawal record
    let limit = 10, offset = 0, ba_api_url = 'log_ba_withdraw.php';

    function GetBaWithdrawCodeFun(limit, offset) {
        let tr = "", totalPage = "", count = "", ba_state = "";
        AllRecord(token, limit, offset, ba_api_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                let total = response.total;
                totalPage = Math.floor(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data == false) {
                    GetDataEmpty('baWithdrawCodesTable', '6');
                    return;
                }
                $.each(data, function (i, val) {
                    if (data[i].state == "1") {
                        ba_state = "<td class='i18n' name='processed'></td>"
                    } else {
                        ba_state = "<td class='i18n' name='unProcessed'></td>"
                    }
                    tr += '<tr>' +
                        '<td>' + data[i].asset_id + '</td>' +
                        '<td>' + data[i].base_amount + '</td>' +
                        '<td title=' + data[i].address + '>' + data[i].address.substr(0, 20) + '</td>' +
                        '<td>' + data[i].tx_time + '</td>' +
                        ba_state +
                        '<td title=' + data[i].transfer_tx_hash + '>' + data[i].transfer_tx_hash.substr(0, 20) + '</td>' +
                        '</tr>'
                });
                $("#baWithdrawCodesTable").html(tr);
                execI18n();
                $("#pagination_ba").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetBaWithdrawCodeFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            GetDataFail('baWithdrawCodesTable', '6');
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
        });
    }

    GetBaWithdrawCodeFun(limit, offset);
});
