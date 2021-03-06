$(function () {
    let token = GetCookie('ca_token'), limit = 10, offset = 0;
    let benchmark_type = GetUsCookie('benchmark_type');
    let ca_currency = GetUsCookie('ca_currency');
    GetCaAccount();

    // get Basic user information
    GetCaInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Get a list of user withdrawal pending orders
    let api_url = 'log_us_withdraw.php', type = '1', bit_address = [], tr = '';
    GetRechargeWithdrawList(api_url, token, type, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            if (data == false) {
                GetDataEmpty('withdrawPendingTable', '5');
                return;
            }
            $.each(data, function (i, val) {
                let tx_detail = JSON.parse(data[i].tx_detail);
                tr += '<tr class="withdrawPendingList">' +
                    '<td>' + tx_detail.name + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td>' + tx_detail.id_card.replace(/(.{4})/g,"$1 ") + '</td>' +
                    '<td><span>' + benchmark_type + '</span>/<span class="ca_currency">' + ca_currency + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="handle"></span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '<a class="btn btn-danger btn-sm refuseBtn">' +
                    '<span class="i18n" name="refuse"></span>' +
                    '</a>' +
                    '<span class="tx_hash none">' + data[i].tx_hash + '</span>' +
                    '</td>' +
                    '</tr>';
            });
            $('#withdrawPendingTable').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('withdrawPendingTable', '5');
        LayerFun(response.errcode);
        return;
    });
    //Withdrawal request confirmation processing
    $(document).on('click', '.confirmBtn', function () {
        $('#confirmModal').modal('show');
        let qa_id = $(this).next('.qa_id').text();
        let type = '1';
        let _this = $(this);
        layer.confirm('确定处理此笔提现请求？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            ShowLoading("show");
            WithdrawRefuse(token, qa_id, type, function (response) {
                if (response.errcode == "0") {
                    SuccessPrompt("处理成功");
                    ShowLoading("hide");
                    _this.closest('.withdrawPendingList').remove();
                }
            }, function (response) {
                ErrorPrompt(response.errmsg);
                ShowLoading("hide");
            });
        }, function () {
        });
    });

    //refuse withdraw
    $(document).on("click", ".refuseBtn", function () {
        let qa_id = $(this).siblings(".qa_id").text();
        let type = '2';
        let _this = $(this);
        layer.confirm('拒绝此笔提现请求？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            ShowLoading("show");
            WithdrawRefuse(token, qa_id, type, function (response) {
                if (response.errcode == "0") {
                    SuccessPrompt("处理成功");
                    ShowLoading("hide");
                    _this.closest('.withdrawPendingList').remove();
                }
            }, function (response) {
                ErrorPrompt(response.errmsg);
                ShowLoading("hide");
            });
        }, function () {
        });
    })
});

