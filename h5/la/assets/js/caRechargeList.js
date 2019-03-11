$(function () {
    //Get token
    let token = GetCookie('la_token');
    let limit = 10, offset = 0;
    let _limit = 10, _offset = 0;

    //Get ca transaction history
    function ShowDataFun(rechargeList, totalPage, count, limit, offset, show_type) {
        let tr = '', ca_id_arr = [], us_id_arr = [], tx_hash_arr = [], qa_flag_span = '';
        $.each(rechargeList, function (i, val) {
            ca_id_arr.push(rechargeList[i].ca_id.substring(0, 10) + '...');
            us_id_arr.push(rechargeList[i].us_id.substring(0, 10) + '...');
            tx_hash_arr.push(rechargeList[i].tx_hash.substring(0, 10) + '...');
            if (rechargeList[i].qa_flag == '0') {
                qa_flag_span = '<span class="i18n" name="unprocessed"></span>';
            }
            if (rechargeList[i].qa_flag == '1') {
                qa_flag_span = '<span class="i18n" name="processed"></span>';
            }
            if (rechargeList[i].qa_flag == '2') {
                qa_flag_span = '<span class="i18n" name="notRejected"></span>';
            }
            tr += '<tr>' +
                '<td><a href="javascript:;" class="ba_id" title="' + rechargeList[i].ba_id + '">' + ca_id_arr[i] + '</a></td>' +
                '<td><a href="javascript:;" class="us_id" title="' + rechargeList[i].us_id + '">' + us_id_arr[i] + '</a></td>' +
                '<td><span class="base_amount">' + rechargeList[i].base_amount + '</span></td>' +
                '<td><span class="tx_hash" title="' + rechargeList[i].tx_hash + '">' + tx_hash_arr[i] + '</span></td>' +
                '<td><span class="tx_time">' + rechargeList[i].tx_time + '</span></td>' +
                '<td>' + qa_flag_span + '</td>' +
                '</tr>'
        });
        $('#caRecharge').html(tr);
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
                    GetCaTransactionFun(limit, (current - 1) * limit);
                } else {
                    GetSearchListFun(limit, (current - 1) * limit);
                }
                ShowLoading("show");
            }
        });
    }

    function GetCaTransactionFun(limit, offset) {
        let totalPage = "", count = "", api_url = "ca_recharge_transaction.php";
        GetCaTransaction(token, api_url, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let rechargeList = response.rows;
                if (rechargeList == '') {
                    GetDataEmpty('caRecharge', '6');
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
                ShowDataFun(rechargeList, totalPage, count,limit, offset,show_type);
            }
        }, function (response) {
            ShowLoading("hide");
            GetDataFail('caRecharge', '8');
            LayerFun(response.errcode);
            return;
        });
    }

    GetCaTransactionFun(limit, offset);

    //Jump ba details
    $(document).on('click', '.ca_id', function () {
        let ca_id = $(this).attr('title');
        window.location.href = 'caInfo.html?ba_id=' + ca_id;
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
            console.log('empty');
            $('.' + className).fadeOut();
        }
    });

    //Click the search button to filter
    let from_time = "", to_time = "", tx_time = "",
        qa_id = "", _us_id = "", us_account_id = "",
        tx_hash = "", asset_id = "", ba_account_id = "",
        base_amount = "", bit_amount = "", tx_detail = "",
        tx_fee = "", tx_type = "", qa_flag = "", ba_id = "";
    let search_api_url = "transaction_select_ca_recharge.php";
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
        SearchCaTransaction(token, search_api_url, from_time, to_time, tx_time, qa_id, _us_id, us_account_id, asset_id, ba_account_id, tx_hash,
            base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, _limit, _offset, function (response) {
                ShowLoading("hide");
                if (response.errcode == '0') {
                    let withdrawList = response.rows;
                    if (withdrawList == false) {
                        GetDataEmpty('caRecharge', '6');
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