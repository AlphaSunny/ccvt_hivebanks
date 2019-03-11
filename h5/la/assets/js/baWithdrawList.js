$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Get ba transaction history
    let limit = 10, offset = 0;
    let _limit = 10, _offset = 0;

    //渲染ba提现记录
    function ShowDataFun(withdrawList, totalPage, count, limit, offset, show_type) {
        let tr = "", ba_id_arr = [], us_id_arr = [], tx_hash_arr = [], qa_flag_span = '';
        $.each(withdrawList, function (i, val) {
            ba_id_arr.push(withdrawList[i].ba_id.substring(0, 10) + '...');
            us_id_arr.push(withdrawList[i].us_id.substring(0, 10) + '...');
            tx_hash_arr.push(withdrawList[i].tx_hash.substring(0, 10) + '...');
            if (withdrawList[i].qa_flag == '0') {
                qa_flag_span = '<span class="i18n" name="unprocessed"></span>';
            }
            if (withdrawList[i].qa_flag == '1') {
                qa_flag_span = '<span class="i18n" name="processed"></span>';
            }
            if (withdrawList[i].qa_flag == '2') {
                qa_flag_span = '<span class="i18n" name="notRejected"></span>';
            }
            tr += '<tr>' +
                '<td><a href="javascript:;" class="ba_id" title="' + withdrawList[i].ba_id + '">' + ba_id_arr[i] + '</a></td>' +
                '<td><a href="javascript:;" class="us_id" title="' + withdrawList[i].us_id + '">' + us_id_arr[i] + '</a></td>' +
                '<td><span class="asset_id">' + withdrawList[i].asset_id + '</span></td>' +
                '<td><span class="base_amount">' + withdrawList[i].base_amount + '</span></td>' +
                '<td><span class="bit_amount">' + withdrawList[i].bit_amount + '</span></td>' +
                '<td><span class="tx_hash" title="' + withdrawList[i].tx_hash + '">' + tx_hash_arr[i] + '</span></td>' +
                '<td><span class="tx_time">' + withdrawList[i].tx_time + '</span></td>' +
                '<td><span class="qa_flag">' + qa_flag_span + '</span></td>' +
                '</tr>';
        });
        $('#baWithdraw').html(tr);
        execI18n();
        $("#pagination").pagination({
            currentPage: (limit + offset) / limit,
            totalPage: totalPage,
            isShow: false,
            count: count,
            prevPageText: "<<",
            nextPageText: ">>",
            callback: function (current) {
                if (show_type == "1") {
                    GetBaTransactionFun(limit, (current - 1) * limit);
                } else {
                    GetSearchListFun(limit, (current - 1) * limit);
                }
                ShowLoading("show");
            }
        });
    }

    //ba提现记录
    function GetBaTransactionFun(limit, offset) {
        let totalPage = "", count = "", api_url = "ba_withdraw_transaction.php";
        GetBaTransaction(token, api_url, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let withdrawList = response.rows;
                if (withdrawList == false) {
                    GetDataEmpty('baWithdraw', '8');
                    return;
                }
                let total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                let show_type = "1";
                ShowDataFun(withdrawList, totalPage, count, limit, offset, show_type);
            }
        }, function (response) {
            ShowLoading("hide");
            GetDataFail('baRecharge', '8');
            LayerFun(response.errcode);
            return;
        });
    }

    GetBaTransactionFun(limit, offset);

    //Jump ba details
    $(document).on('click', '.ba_id', function () {
        let ba_id = $(this).attr('title');
        window.location.href = 'baInfo.html?ba_id=' + ba_id;
    });
    //Jump user details
    $(document).on('click', '.us_id', function () {
        let us_id = $(this).attr('title');
        window.location.href = 'userInfo.html?us_id=' + us_id;
    });

    //Conditional screening
    $("input[type=checkbox]").click(function () {
        let className = $(this).val();
        if ($(this).prop('checked')) {
            $('.' + className).fadeIn();
            $('.' + className).children('div').css('display', 'flex');
        } else {
            $('.' + className).fadeOut();
        }
    });

    //Click the search button to filter
    let from_time = "", to_time = "", tx_time = "",
        qa_id = "", _us_id = "", us_account_id = "",
        tx_hash = "", asset_id = "", ba_account_id = "",
        base_amount = "", bit_amount = "", tx_detail = "",
        tx_fee = "", tx_type = "", qa_flag = "", ba_id = "";
    let search_api_url = "transaction_select_ba_withdraw.php";
    $('.searchBtn').click(function () {
        from_time = $('#from_time').val();
        to_time = $('#to_time').val();
        tx_time = $('#tx_time').val();
        qa_id = $('#qa_id').val();
        _us_id = $('#us_id').val();
        us_account_id = $('#us_account_id').val();
        asset_id = $('#asset_id').val();
        ba_account_id = $('#ba_account_id').val();
        tx_hash = $('#tx_hash').val();
        base_amount = $('#base_amount').val();
        bit_amount = $('#bit_amount').val();
        tx_detail = $('#tx_detail').val();
        tx_fee = $('#tx_fee').val();
        tx_type = $('#tx_type').val();
        qa_flag = $('#qa_flag').val();
        ba_id = $('#ba_id').val();
        ShowLoading("show");
        GetSearchListFun(_limit, _offset);
    });

    function GetSearchListFun(_limit, _offset) {
        let totalPage = "", count = "";
        SearchBaTransaction(token, search_api_url, from_time, to_time, tx_time, qa_id, _us_id, us_account_id, asset_id, ba_account_id, tx_hash,
            base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, _limit, _offset, function (response) {
                ShowLoading("hide");
                if (response.errcode == '0') {
                    let withdrawList = response.rows;
                    if (withdrawList == false) {
                        GetDataEmpty('baWithdraw', '8');
                        return;
                    }
                    let total = response.total;
                    totalPage = Math.ceil(total / _limit);
                    if (totalPage <= 1) {
                        count = 1;
                    } else if (1 < totalPage && totalPage <= 6) {
                        count = totalPage;
                    } else {
                        count = 6;
                    }
                    let show_type = "2";
                    ShowDataFun(withdrawList, totalPage, count, _limit, _offset, show_type);
                }
            }, function (response) {
                ShowLoading("hide");
                LayerFun(response.errcode);
                return;
            })
    }

    //Set start time
    function activeTimeInput() {
        $('#from_time').datetimepicker({
            format: 'Y/m/d H:i',
            value: new Date(),
            // minDate: new Date(),//Set minimum date
            // minTime: new Date(),//Set minimum time
            // yearStart: 2018,//Set the minimum year
            yearEnd: 3000 //Set the maximum year
        });
    }

    $("#from_time").focus(function () {
        activeTimeInput();
    });

    //Set end time
    function otherTimeInput(type) {
        $('#' + type + '').datetimepicker({
            format: 'Y/m/d H:i',
            value: new Date(),
            // minDate: new Date(),//Set minimum date
            // minTime: new Date(),//Set minimum time
            // yearStart: 2018,//Set the minimum year
            yearEnd: 3000 //Set the maximum year
        });
    }

    $("#to_time").focus(function () {
        otherTimeInput("to_time");
    });
    $("#tx_time").focus(function () {
        otherTimeInput("tx_time");
    });
});