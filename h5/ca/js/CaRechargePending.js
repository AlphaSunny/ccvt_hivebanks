$(function () {
    let token = GetCookie('ca_token'), limit = 10, offset = 0;
    GetCaAccount();
    // get Basic user information
    GetCaInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        return;
    });
    //Get a list of user refill pending orders
    let api_url = 'log_us_recharge.php', type = '1', tr = '', bit_address = [], tx_hash = [];

    function GetRechargeWithdrawListFun() {
        GetRechargeWithdrawList(api_url, token, type, function (response) {
            if (response.errcode == '0') {
                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('rechargePendingTable', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr class="rechargePendingList">' +
                        '<td><span>' + data[i].us_id + '</span></td>' +
                        '<td><span>' + data[i].base_amount + '</span></td>' +
                        '<td><span class="ca_currency">' + GetCookie("ca_currency") + '</span>/<span class="base_type">' + GetCookie("benchmark_type") + '</span></td>' +
                        // '<td><span>' + data[i].bit_address + '</span></td>' +
                        '<td><span>' + data[i].tx_time + '</span></td>' +
                        '<td>' +
                        '<a class="btn btn-success btn-sm confirmBtn">' +
                        '<span class="i18n" name="handle"></span>' +
                        '</a>' +
                        '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                        '<a class="btn btn-danger btn-sm cancelBtn">' +
                        '<span class="i18n" name="refuse"></span>' +
                        '</a>' +
                        '<span class="tx_hash none">' + data[i].tx_hash + '</span>' +
                        '</td>' +
                        '</tr>'
                });
                $('#rechargePendingTable').html(tr);
                execI18n();
            }
        }, function (response) {
            GetDataFail('rechargePendingTable', '5');
            LayerFun(response.errcode);
            return;
        });
    }

    GetRechargeWithdrawListFun();

    //recharge confirm process
    $(document).on('click', '.confirmBtn', function () {
        // $('#confirmModal').modal('show');
        let qa_id = $(this).next('.qa_id').text();
        let _this = $(this);
        let type = '1';

        layer.confirm('确定处理此笔充值请求？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            ShowLoading("show");
            RechargeConfirm(token, qa_id, type, function (response) {
                if (response.errcode == '0') {
                    ShowLoading("hide");
                    _this.closest('.rechargePendingList').remove();
                    $('.lock_amount').text(response.lock_amount);
                    $('.base_amount').text(response.base_amount);
                    LayerFun("successfulProcessing");
                }
            }, function (response) {
                ShowLoading("hide");
                ErrorPrompt(response.errmsg);
                // LayerFun("processingFailure");
                // LayerFun(response.errcode);
                return;
            })
        }, function () {
        });


    });

    $(document).on("click", ".cancelBtn", function () {
        let type = '2';
        let _this = $(this);
        let qa_id = $(this).siblings(".qa_id").text();
        layer.confirm('拒绝此笔充值请求？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            RechargeRefuse(token, type, qa_id, function (response) {
                if (response.errcode == "0") {
                    SuccessPrompt("处理成功");
                    _this.closest('.rechargePendingList').remove();
                }
            }, function (response) {
                ErrorPrompt(response.errmsg);
            });
        }, function () {
        });
    })
});

