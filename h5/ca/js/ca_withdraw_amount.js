$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();

    //get us_level
    let us_level = GetCookie('us_level');

    // get base information
    let us_base_amount = '', us_account_id = "";
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            us_base_amount = data.base_amount;
            us_account_id = data.us_id;
            $('.base_amount').text(data.base_amount);
            if (data.base_amount <= 0) {
                $('.allWithdraw').remove();
                $('.no_base_amount').show();
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //fullWithdrawal
    $('.allWithdraw').click(function () {
        $('.base_amount_input').val(us_base_amount);
        $('.bit_amount_input').val(us_base_amount * rate);
    });

    //Get recharge channels
    let ca_channel = decodeURI(GetQueryString('ca_channel'));

    $(".ca_channel").text(ca_channel);
    //Assign recharge ca
    let api_url = 'assign_withdraw_ca.php', rate = '', ca_id = '', withdraw_max_amount = '', withdraw_min_amount = '';
    GetAssignCa(api_url, token, ca_channel, function (response) {
        if (response.errcode == '0') {
            $('.base_rate').text(response.base_rate);
            rate = response.base_rate;
            ca_id = response.ca_id;
            withdraw_max_amount = response.max_amount;
            withdraw_min_amount = response.min_amount;
            $('.withdraw_max_amount').text(response.max_amount);
            $('.withdraw_min_amount').text(response.min_amount);
            $('.base_amount_input').val(withdraw_min_amount);
            $('.withdraw_ctime').text(response.set_time);
            $('.bit_amount_input').val(withdraw_min_amount * rate);
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //lockRechargeAmount
    $('.lockAmountBtn').click(function () {
        let bit_amount = $('.bit_amount_input').val(),
            base_amount = $('.base_amount_input').val(),
            // us_account_id = $('.us_account_id').val(),
            id_card = $("#idNum").val(),
            name = $("#name").val();
        if (base_amount.length <= 0) {
            // LayerFun('pleaseEnterWithdrawAmount');
            WarnPrompt("请输入提现金额");
            return;
        }
        if (base_amount < withdraw_min_amount) {
            // LayerFun('notSmallAmount');
            WarnPrompt("不能低于最小提现额度");
            return;
        }
        if (base_amount > withdraw_max_amount) {
            // LayerFun('notLagAmount');
            WarnPrompt("不能高于最高提现额度");
            return;
        }
        if (id_card.length <= 0) {
            WarnPrompt("请输入银行卡号");
            return;
        }
        if (name.length <= 0) {
            WarnPrompt("请输入姓名");
            return;
        }
        if (base_amount > us_base_amount) {
            // LayerFun('notBalance');
            WarnPrompt("账户余额不足");
            return;
        }

        //询问框
        layer.confirm('是否确认锁定？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            confirmLockAmountFun(token, ca_id, base_amount, bit_amount, id_card, name, us_account_id);
        }, function () {
        });
    });


    function confirmLockAmountFun(token, ca_id, base_amount, bit_amount, id_card, name, us_account_id) {
        LockWithdrawAmount(token, ca_id, base_amount, bit_amount, id_card, name, us_account_id, function (response) {
            if (response.errcode == '0') {
                $('#lockWithdraw').modal('show');
                readingTime(8);
            }
        }, function (response) {
            LayerFun(response.errcode);
            return;
        })
    }

    //Input box listener
    $('.base_amount_input').bind('input', 'propertychange', function () {
        $('.bit_amount_input').val($(this).val() * rate);
    });
    $('.bit_amount_input').bind('input', 'propertychange', function () {
        $('.base_amount_input').val($(this).val() / rate);
    });

    //Reading rule time countdown
    function readingTime(time) {
        let timer = null;
        timer = setInterval(function () {
            if (time != 0) {
                time--;
                $('.ruleBtn').text(time + 's').css("color", "#ffffff");
            } else {
                clearInterval(timer);
                $('.ruleBtn').attr('disabled', false).css("color", "unset");
                execI18n();
            }
        }, 1000);
    }
});