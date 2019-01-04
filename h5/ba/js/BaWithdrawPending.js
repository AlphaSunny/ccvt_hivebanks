$(function () {
    var token = GetCookie('ba_token'), limit = 50, offset = 0;
    GetBaAccount();

    //Get the baseline type
    var base_type = GetCookie('benchmark_type');

    //Download order
    //Get configuration file
    var url = getRootPath();
    var config_api_url = '', config_h5_url = '';
    $.ajax({
        url: url+"/h5/assets/json/config_url.json",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            config_api_url = data.api_url;
            config_h5_url = data.h5_url;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });

    $('.download').click(function () {
        window.location.href = config_api_url + '/api/ba/transaction_order_download.php?token=' + encodeURIComponent(token);
    });

    // get Basic user information
    GetBasicInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        // LayerFun(response.errcode);
        ErrorPrompt("获取用户信息失败");
        return;
    });

    //Get a list of user withdrawal pending orders
    var api_url = 'log_us_withdraw.php', type = '1', bit_address = [];
    function RechargeWithdrawCodeQueryFun(limit,offset){
        var tr = '', count = "";
        RechargeWithdrawCodeQuery(token, api_url, type,limit,offset, function (response) {
            if (response.errcode == '0') {
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
                if(data == ''){
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
                        '<td><input type="text" class="form-control transfer_tx_hash"></td>' +
                        '<td>' +
                        '<a class="btn btn-success btn-sm confirmBtn">' +
                        '<span class="i18n" name="handle">handle</span>' +
                        '</a>' +
                        '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                        '</td>' +
                        '</tr>';
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
        }, function (response) {
            GetDataFail('withdrawPendingTable', '7');
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
            return;
        });
    }
    RechargeWithdrawCodeQueryFun(limit,offset);


    //Withdrawal request confirmation processing
    var qa_id = '', _this = '', transfer_tx_hash = '';
    $(document).on('click', '.confirmBtn', function () {
        transfer_tx_hash = $(this).parents('.withdrawPendingList').find('.transfer_tx_hash').val();
        qa_id = $(this).next('.qa_id').text();
        _this = $(this);

        if (transfer_tx_hash.length <= 0) {
            // LayerFun('inputHash');
            WranPrompt("请输入Hash");
            return;
        }
        $('#confirmModal').modal('show');
    });

    //again confirm
    $('.againConfirmBtn').click(function () {
        var type = '1';
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        WithdrawConfirm(token, qa_id, type, transfer_tx_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#confirmModal').modal('hide');
                _this.closest('.withdrawPendingList').remove();
                $('.lock_amount').text(response.lock_amount);
                LayerFun('suc_processing');
                SuccessPrompt("处理成功");
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            ErrorPrompt("处理失败:"+response.errmsg);
            // LayerFun('err_processing');
            // LayerFun(response.errcode);
            return;
        })
    })
});

