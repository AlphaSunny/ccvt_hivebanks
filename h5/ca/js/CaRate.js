$(function () {
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    //get information
    GetCaInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //设置充值汇率
    $(".rechargeRateBtn").click(function () {
        var rate = $(".rechargeRateInput").val(), minAmount = $(".rechargeMinVal").val(),
            maxAmount = $(".rechargeMaxVal").val(), time = $("#rechargeRateTime").val(),
            level = $(".rechargeLevel").val(), ca_type = "RMB",
            pass_word_hash = hex_sha1($("#rechargePassword").val());
        SetRechargeRate(token, rate, minAmount, maxAmount, time, level, ca_type, pass_word_hash, function (response) {
            if(response.errcode == "0"){
                SuccessPrompt("设置成功");
                $(".rechargeRateNotSet").remove();
                $(".recharge_rate").text(response.recharge_rate);
                $(".recharge_set_time").text(response.limit_time);
                $(".recharge_max_amount").text(response.recharge_max_amount);
                $(".recharge_min_amount").text(response.recharge_min_amount);
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    });

    //设置提现汇率
    $(".withdrawRateBtn").click(function () {
        var rate = $(".withdrawRateInput").val(), minAmount = $(".withdrawMinVal").val(),
            maxAmount = $(".withdrawMaxVal").val(), time = $("#withdrawRateTime").val(),
            level = $(".withdrawLevel").val(), ca_type = "RMB",
            pass_word_hash = hex_sha1($("#withdrawPassword").val());
        SetWithdrawRate(token, rate, minAmount, maxAmount, time, level, ca_type, pass_word_hash, function (response) {
            if(response.errcode == "0"){
                SuccessPrompt("设置成功");
                $(".withdrawRateNotSet").remove();
                $(".withdraw_rate").text(response.withdraw_rate);
                $(".withdraw_set_time").text(response.limit_time);
                $(".withdraw_max_amount").text(response.withdraw_max_amount);
                $(".withdraw_min_amount").text(response.withdraw_min_amount);
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    });

    //get recharge withdraw rate list
    // GetRateList(token, function (response) {
    //     if (response.errcode == '0') {
    //         var data = response.rows;
    //         var recharge_base_rate = [];
    //         $.each(data, function (i, val) {
    //             recharge_base_rate.push(data[i].recharge_row.recharge_base_rate);
    //         });
    //         new Vue({
    //             el: '.content',
    //             data: {
    //                 differentBank: data,
    //                 recharge_base_rate: recharge_base_rate,
    //                 bl: true
    //             }
    //         })
    //     }
    // }, function (response) {
    //     LayerFun(response.errcode);
    // });

    //select recharge rate and withdraw rate
    // $(document).on('click', 'input[name=changeRate]', function () {
    //     $(this).attr('checked', true).parent().siblings().children('input[name=changeRate]').attr('checked', false);
    // });

    //confirm set rate
    // $(document).on('click', '.enableBtn', function () {
    //     var $this = $(this), btnText = $(this).text();
    //     var recharge_base_rate = $('.recharge_base_rate').text();
    //     var optRateType = $(this).parents('.setRateForm').siblings('.setRateType').find('input[type="radio"]:checked').val();
    //     if (!optRateType) {
    //         LayerFun('pleaseChooseRateType');
    //         return;
    //     }
    //     var rate = $(this).parent().siblings().find('.rate').val(),
    //         minAmount = $(this).parent().siblings().find('.minAmount').val(),
    //         maxAmount = $(this).parent().siblings().find('.maxAmount').val(),
    //         time = $(this).parent().siblings().find('.timeInput').val(),
    //         level = $(this).parent().siblings().find('.level').val(),
    //         password = $(this).parent().siblings().find('.password').val(),
    //         pass_word_hash = hex_sha1(password),
    //         ca_channel = $(this).parents('.differentRate').find('.ca_channel').text().toLowerCase();
    //
    //     if (optRateType == 'recharge') {
    //         //set recharge rate
    //         if (DisableClick($this)) return;
    //         ShowLoading("show");
    //         SetRechargeRate(token, rate, minAmount, maxAmount, time, level, ca_channel, pass_word_hash, function (response) {
    //             if (response.errcode == '0') {
    //                 ShowLoading("hide");
    //                 ActiveClick($this, btnText);
    //                 LayerFun('setSuccess');
    //                 location.reload();
    //                 return;
    //             }
    //         }, function (response) {
    //             ShowLoading("hide");
    //             ActiveClick($this, btnText);
    //             LayerFun(response.errcode);
    //             return;
    //         });
    //         return;
    //     }
    //
    //     if (optRateType == 'withdraw') {
    //         //set withdraw rate
    //         if (DisableClick($this)) return;
    //         ShowLoading("show");
    //         SetWithdrawRate(token, rate, minAmount, maxAmount, time, level, ca_channel, pass_word_hash, function (response) {
    //             if (response.errcode == '0') {
    //                 ShowLoading("hide");
    //                 ActiveClick($this, btnText);
    //                 LayerFun('setSuccess');
    //                 location.reload();
    //                 return;
    //             }
    //         }, function (response) {
    //             ShowLoading("hide");
    //             ActiveClick($this, btnText);
    //             LayerFun(response.errcode);
    //             return;
    //         });
    //     }
    //
    // });

    function SetTime() {
        $('.timeInput').datetimepicker({
            initTime: new Date(),
            format: 'Y/m/d H:i',
            value: new Date(),
            minDate: new Date(),//Set minimum date
            minTime: new Date(),//Set minimum time
            yearStart: 2018,//Set the minimum year
            yearEnd: 2050 //Set the maximum year
        });
    }

    $(document).on('click, focus', '.timeInput', function () {
        SetTime();
    })

});