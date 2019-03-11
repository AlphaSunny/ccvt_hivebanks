$(function () {
    //Get token
    let token = GetCookie('la_token');
    let limit = 10, offset = 0;

    //Get ca transaction history
    function ShowDataFun(rechargeList, totalPage, count) {
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
                GetCaTransactionFun(limit, (current - 1) * limit);
                ShowLoading("show");
            }
        });
    }

    function GetCaTransactionFun(limit, offset) {
        let totalPage = "", count = "", type = "1";
        GetCaTransaction(token, type, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let rechargeList = response.rows.recharge;
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
                if (data == false) {
                    GetDataEmpty('userList', '4');
                }

                ShowDataFun(rechargeList, totalPage, count);
            }
        }, function (response) {
            ShowLoading("hide");
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
    $('.searchBtn').click(function () {
        let from_time = "", to_time = "", tx_time = "";
        let totalPage = "", count = "", type = "1";

        if ($('.from_time').hasClass('none')) {
            from_time = "";
        } else {
            from_time = $('#from_time').val()
        }
        if ($('.to_time').hasClass('none')) {
            to_time = "";
        } else {
            to_time = $('#to_time').val()
        }
        if ($('.tx_time').hasClass('none')) {
            tx_time = "";
        } else {
            tx_time = $('#tx_time').val()
        }
        let qa_id = $('#qa_id').val(), us_id = $('#us_id').val(), us_account_id = $('#us_account_id').val(),
            asset_id = $('#asset_id').val(), ba_account_id = $('#ba_account_id').val(), tx_hash = $('#tx_hash').val(),
            base_amount = $('#base_amount').val(), bit_amount = $('#bit_amount').val(),
            tx_detail = $('#tx_detail').val(),
            tx_fee = $('#tx_fee').val(), tx_type = $('#tx_type').val(), qa_flag = $('#qa_flag').val(),
            ba_id = $('#ba_id').val();
        $(".preloader-wrapper").addClass("active");
        ShowLoading("show");
        SearchCaTransaction(token,from_time, to_time, tx_time, qa_id, us_id, us_account_id, asset_id, ba_account_id, tx_hash,
            base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id,type, function (response) {
                ShowLoading("hide");
                if (response.errcode == '0') {
                    $(".preloader-wrapper").removeClass("active");
                    let rechargeList = response.rows.recharge;
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
                    ShowDataFun(rechargeList, totalPage, count);
                }
            }, function (response) {
                ShowLoading("hide");
                $(".preloader-wrapper").removeClass("active");
                LayerFun(response.errcode);
                return;
            })
    });

    //Set start time
    $('#from_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//Set minimum date
        // minTime: new Date(),//Set minimum time
        // yearStart: 2018,//Set the minimum year
        yearEnd: 3000 //Set the maximum year
    });

    //Set end time
    $('#to_time, #tx_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//Set minimum date
        // minTime: new Date(),//Set minimum time
        // yearStart: 2018,//Set the minimum year
        yearEnd: 3000 //Set the maximum year
    });
});