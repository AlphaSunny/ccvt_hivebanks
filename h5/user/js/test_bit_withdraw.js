$(function () {
    //get token;
    var token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    var base_type = GetCookie('benchmark_type');

    //Get ba withdrawal list
    var api_url = 'us_get_withdraw_ba_list.php';
    GetBaRateList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, li = '';

            if (data == false) {
                $('.bitAgentTitle').attr('name', 'noDigitalCurrencyAgent');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                li += '<li>' +
                    '<p>' +
                    '<svg class="icon" aria-hidden="true">' +
                    '<use xlink:href="#icon-' + data[i].bit_type.toUpperCase() + '"></use>' +
                    '</svg>' +
                    '</p>' +
                    '<span>' + data[i].bit_type + '</span>' +
                    '<div class="mask">' +
                    '<p class="parities">1' +
                    '<span class="bit_type">' + data[i].bit_type + '</span>=' +
                    '<span class="base_rate">' + data[i].base_rate + '</span>' +
                    '<span class="base_type">' + base_type + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</li>'
            });
            $('#baWithdrawList').html(li);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Get user binding information
    var us_bind_type_name = '', us_bind_type_idNum = '', us_bind_type_file = '', us_bind_name_idPhoto = '';
    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
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
    $(document).on('click', '.digital-inner-box li', function () {
        if (us_bind_type_name != 'name' || us_bind_type_idNum != 'idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        } else {
            var val = $(this).children("span").text().trim();
            SetCookie('wi_bit_type', val);
            window.location.href = "../ba/BaWithdraw.html";
        }
    });

    //Get user account balance display
    var us_base_amount = '';
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

    //Enter the recharge amount binding input box
    // $('.base_amount').bind('input porpertychange', function () {
    //     $('.bit_amount').val($(this).val() * withdraw_rate);
    //     $('.payWithdrawAmount').text($(this).val());
    // });
    // $('.bit_amount').bind('input porpertychange', function () {
    //     $('.base_amount').val($(this).val() / withdraw_rate);
    //     $('.payWithdrawAmount').text($('.base_amount').val());
    // });

    //fullWithdrawal
    $('.fullWithdrawal').click(function () {
        $('#withdrawAmount').val(us_base_amount);
        $('#payAmount').val(us_base_amount * withdraw_rate);
    });

    //Ca recharge the next step
    $('.enableAmount').click(function () {
        if (us_bind_type_name != 'name' || us_bind_type_idNum != 'idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        }

        if ($('.base_amount').val().length <= 0) {
            LayerFun('withdrawalAmountNotEmpty');
        }

        if (us_base_amount <= 0) {
            LayerFun('insufficientBalance');
            return;
        }
        var base_amount = $('#withdrawAmount').val();
        if (base_amount > us_base_amount) {
            LayerFun('insufficientBalance');
            return;
        }

        if (base_amount <= 0) {
            LayerFun('pleaseEnterCorrectWithdrawAmount');
            return;
        }
        window.location.href = '../ca/CaWithdraw.html?us_ca_withdraw_amount=' + base_amount;
    });

    // BA withdrawal record
    var limit = 10, offset = 0, ba_api_url = 'log_ba_withdraw.php';

    function GetBaWithdrawCodeFun(limit, offset) {
        var tr = "", totalPage = "", count = "", ba_state = "";
        AllRecord(token, limit, offset, ba_api_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                var data = response.rows;
                var total = response.total;
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
