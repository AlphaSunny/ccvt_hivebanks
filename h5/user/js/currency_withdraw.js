$(function () {
    //get token;
    let token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    let base_type = GetCookie('benchmark_type');

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
    $(document).on('click', '.digital-inner-box li', function () {
        if (us_bind_type_name != 'name' || us_bind_type_idNum != 'idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        } else {
            let val = $(this).children("span").text().trim();
            SetCookie('wi_bit_type', val);
            window.location.href = "../ba/BaWithdraw.html";
        }
    });

    //Get the average exchange rate of Ca withdrawal
    let withdraw_rate = '', api_url = 'ca_withdraw_rate.php';
    GetAverageRate(api_url, token, function (response) {
        if (response.errcode == '0') {
            withdraw_rate = (response.withdraw_rate);
            $('.withdraw_rate').text(response.withdraw_rate);
            $('.bit_amount').val(response.withdraw_rate);
        }
    }, function (response) {
        LayerFun(response.errcode);
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

    //Enter the recharge amount binding input box
    $('.base_amount').bind('input porpertychange', function () {
        $('.bit_amount').val($(this).val() * withdraw_rate);
        $('.payWithdrawAmount').text($(this).val());
    });
    $('.bit_amount').bind('input porpertychange', function () {
        $('.base_amount').val($(this).val() / withdraw_rate);
        $('.payWithdrawAmount').text($('.base_amount').val());
    });

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
        let base_amount = $('.base_amount').val();
        if (base_amount > us_base_amount) {
            LayerFun('insufficientBalance');
            return;
        }

        if (base_amount <= 0) {
            LayerFun('pleaseEnterCorrectWithdrawAmount');
            return;
        }
        window.location.href = '../ca/ca_withdraw.html?us_ca_withdraw_amount=' + base_amount;
    });

    // CA withdrawal record
    // let limit = 10, offset = 0, ba_api_url = 'log_ba_withdraw.php';

    // function GetBaWithdrawCodeFun(limit, offset) {
    //     let tr = "", totalPage = "", count = "", ba_state = "";
    //     AllRecord(token, limit, offset, ba_api_url, function (response) {
    //         ShowLoading("hide");
    //         if (response.errcode == '0') {
    //             let data = response.rows;
    //             let total = response.total;
    //             totalPage = Math.floor(total / limit);
    //             if (totalPage <= 1) {
    //                 count = 1;
    //             } else if (1 < totalPage && totalPage <= 6) {
    //                 count = totalPage;
    //             } else {
    //                 count = 6;
    //             }
    //             if (data == false) {
    //                 GetDataEmpty('baWithdrawCodesTable', '6');
    //                 return;
    //             }
    //             $.each(data, function (i, val) {
    //                 if (data[i].state == "1") {
    //                     ba_state = "<td class='i18n' name='processed'></td>"
    //                 } else {
    //                     ba_state = "<td class='i18n' name='unProcessed'></td>"
    //                 }
    //                 tr += '<tr>' +
    //                     '<td>' + data[i].asset_id + '</td>' +
    //                     '<td>' + data[i].base_amount + '</td>' +
    //                     '<td title=' + data[i].address + '>' + data[i].address.substr(0, 20) + '</td>' +
    //                     '<td>' + data[i].tx_time + '</td>' +
    //                     ba_state +
    //                     '<td title=' + data[i].transfer_tx_hash + '>' + data[i].transfer_tx_hash.substr(0, 20) + '</td>' +
    //                     '</tr>'
    //             });
    //             $("#baWithdrawCodesTable").html(tr);
    //             execI18n();
    //             $("#pagination_ba").pagination({
    //                 currentPage: (limit + offset) / limit,
    //                 totalPage: totalPage,
    //                 isShow: false,
    //                 count: count,
    //                 prevPageText: "<<",
    //                 nextPageText: ">>",
    //                 callback: function (current) {
    //                     GetBaWithdrawCodeFun(limit, (current - 1) * limit);
    //                     ShowLoading("show");
    //                 }
    //             });
    //         }
    //     }, function (response) {
    //         ShowLoading("hide");
    //         GetDataFail('baWithdrawCodesTable', '6');
    //         if (response.errcode == '114') {
    //             window.location.href = 'login.html';
    //         }
    //     });
    // }

    // GetBaWithdrawCodeFun(limit, offset);

    // CA withdrawal record
    let limit_ca = 10, offset_ca = 0, ca_api_url = 'log_ca_withdraw.php';

    function GetCaWithdrawCodeFun(limit_ca, offset_ca) {
        let tr = "", totalPage = "", count = "", ba_state = "";
        AllRecord(token, limit_ca, offset_ca, ca_api_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                let total = response.total;
                totalPage = Math.floor(total / limit_ca);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data == false) {
                    GetDataEmpty('caWithdrawCodesTable', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    if (data[i].qa_flag == "0") {
                        ba_state = "<td class='i18n' name='processing'></td>";
                    } else if (data[i].qa_flag == "1") {
                        ba_state = "<td class='i18n color_green' name='processed'></td>";
                    } else {
                        ba_state = "<td class='i18n color_red' name='alreadyRefuse'></td>"
                    }
                    tr += '<tr>' +
                        '<td title=' + data[i].address + '>' + JSON.parse(data[i].tx_detail).id_card.replace(/(.{4})/g,"$1 ") + '</td>' +
                        '<td>' + data[i].base_amount + '</td>' +
                        '<td>' + data[i].tx_time + '</td>' +
                        ba_state +
                        '</tr>'
                });
                $("#caWithdrawCodesTable").html(tr);
                execI18n();
                $("#pagination_ca").pagination({
                    currentPage: (limit_ca + offset_ca) / limit_ca,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetCaWithdrawCodeFun(limit_ca, (current - 1) * limit_ca);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            GetDataFail('caWithdrawCodesTable', '4');
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
        });
    }

    GetCaWithdrawCodeFun(limit_ca, offset_ca);
});
