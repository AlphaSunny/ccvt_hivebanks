$(function () {
    let token = GetCookie('la_token');

    //转到user ba ca列表
    // $(".to_user").click(function () {
    //     window.location.href = "userList.html";
    // });
    // $(".to_ba").click(function () {
    //     window.location.href = "baList.html";
    // });
    // $(".to_ca").click(function () {
    //     window.location.href = "caList.html";
    // });

    // toFixed兼容方法
    // Number.prototype.toFixed = function (n) {
    //     if (n > 20 || n < 0) {
    //         throw new RangeError('toFixed() digits argument must be between 0 and 20');
    //     }
    //     const number = this;
    //     if (isNaN(number) || number >= Math.pow(10, 21)) {
    //         return number.toString();
    //     }
    //     if (typeof (n) == 'undefined' || n == 0) {
    //         return (Math.round(number)).toString();
    //     }
    //
    //     let result = number.toString();
    //     const arr = result.split('.');
    //
    //     // 整数的情况
    //     if (arr.length < 2) {
    //         result += '.';
    //         for (let i = 0; i < n; i += 1) {
    //             result += '0';
    //         }
    //         return result;
    //     }
    //
    //     const integer = arr[0];
    //     const decimal = arr[1];
    //     if (decimal.length == n) {
    //         return result;
    //     }
    //     if (decimal.length < n) {
    //         for (let i = 0; i < n - decimal.length; i += 1) {
    //             result += '0';
    //         }
    //         return result;
    //     }
    //     result = integer + '.' + decimal.substr(0, n);
    //     const last = decimal.substr(n, 1);
    //
    //     // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    //     if (parseInt(last, 10) >= 5) {
    //         const x = Math.pow(10, n);
    //         result = (Math.round((parseFloat(result) * x)) + 1) / x;
    //         result = result.toFixed(n);
    //     }
    //
    //     return result;
    // };

    //获取user ba ca la资金
    let sum_us_base_amount = "", sum_ba_base_amount = "", sum_ca_base_amount = "", sum_la_base_amount = "",
        sum_total_base_amount = "";
    let ba_register_count = "", ca_register_count = "", us_register_count = "";
    GetAssetsReport(token, function (response) {
        let data = response.rows;
        sum_us_base_amount = data.sum_us_base_amount + data.sum_us_lock_amount;
        sum_ba_base_amount = data.sum_ba_base_amount;
        sum_ca_base_amount = data.sum_ca_base_amount;
        sum_la_base_amount = data.sum_la_base_amount;
        sum_total_base_amount = Number(sum_us_base_amount) + Number(sum_ba_base_amount) + Number(sum_ca_base_amount) + Number(sum_la_base_amount);
        $(".user_sum_amount").text(sum_us_base_amount);
        $(".ba_sum_amount").text(sum_ba_base_amount);
        $(".ca_sum_amount").text(sum_ca_base_amount);
        $(".la_sum_amount").text(sum_la_base_amount);
        $(".sum_total_base_amount").text(sum_total_base_amount);

        //user ba ca la资产比例
        let user_scale = (Math.round((sum_us_base_amount / sum_total_base_amount).toFixed(3) * 100));
        let ba_scale = (Math.round((sum_ba_base_amount / sum_total_base_amount).toFixed(3) * 100));
        let ca_scale = (Math.round((sum_ca_base_amount / sum_total_base_amount).toFixed(3)* 100));
        let la_scale = (Math.round((sum_la_base_amount / sum_total_base_amount).toFixed(3)* 100));

        console.log((sum_us_base_amount / sum_total_base_amount).toFixed(3) * 100);
        console.log(parseInt((sum_us_base_amount / sum_total_base_amount).toFixed(3) * 100));


        $('#user_percent').attr('data-percent', user_scale);
        $('#ba_percent').attr('data-percent', ba_scale);
        $('#ca_percent').attr('data-percent', ca_scale);
        $('#la_percent').attr('data-percent', la_scale);
        $('#user_percent .percent').text(user_scale + "%");
        $('#ba_percent .percent').text(ba_scale + "%");
        $('#ca_percent .percent').text(ca_scale + "%");
        $('#la_percent .percent').text(la_scale + "%");

        $("#user_percent").data('easyPieChart').update(user_scale);
        $("#ba_percent").data('easyPieChart').update(ba_scale);
        $("#ca_percent").data('easyPieChart').update(ca_scale);
        $("#la_percent").data('easyPieChart').update(la_scale);
        //user ba ca la资产比例--结束

        ba_register_count = data.ba_register_count;
        ca_register_count = data.ca_register_count;
        us_register_count = data.us_register_count;
        if (ba_register_count == 0) {
            ba_register_count = 0;
        }
        if (ca_register_count == 0) {
            ca_register_count = 0;
        }
        if (us_register_count == 0) {
            us_register_count = 0;
        }
        DonutFun(us_register_count, ba_register_count, ca_register_count);
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //获取用户 ba ca注册人数
    // 扇形图-用户 ba ca注册人数
    function DonutFun(us_register_count, ba_register_count, ca_register_count) {
        Morris.Donut({
            element: 'morris-donut-chart',
            data: [{label: "Users", value: us_register_count},
                {label: "BA", value: ba_register_count},
                {label: "CS", value: ca_register_count}],
            colors: ['#A6A6A6', '#414e63', '#e96562'],
            resize: true
            // formatter: function (y) { return y + "%" }
        });
    }

    GetAssetsReport(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            let ba_register_count = data.ba_register_count;
            let ca_register_count = data.ca_register_count;
            let us_register_count = data.us_register_count;
            if (ba_register_count == 0) {
                ba_register_count = 0;
            }
            if (ca_register_count == 0) {
                ca_register_count = 0;
            }
            if (us_register_count == 0) {
                us_register_count = 0;
            }
            $(".us_register_count").text(us_register_count);
            $(".ba_register_count").text(ba_register_count);
            $(".ca_register_count").text(ca_register_count);
        }
    });
    //获取每天用户增长趋势图
    let day = "7", user_data = "";

    function GetDayUserFun(day) {
        GetDayUserUp(token, day, function (response) {
            if (response.errcode == "0") {
                user_data = response.rows;
                //用户增长趋势图
                Morris.Line({
                    element: 'user-line-chart',
                    data: response.rows,
                    xkey: "date",
                    ykeys: ["num"],
                    labels: ['注册数'],
                    xLabels: "day",
                    fillOpacity: 0.6,
                    hideHover: 'auto',
                    smooth: true,// 是否平滑显示
                    parseTime: false,
                    behaveLikeLine: true,
                    resize: true,
                    pointFillColors: ['#ffffff'],
                    pointStrokeColors: ['black'],
                    lineColors: ['green']
                });
            }
        }, function (response) {
            LayerFun(response.errcode);
        });
    }

    GetDayUserFun(day);

    $(".day_7").click(function () {
        $("#user-line-chart").empty();
        day = 7;
        GetDayUserFun(day);
    });

    $(".day_15").click(function () {
        $("#user-line-chart").empty();
        day = 15;
        GetDayUserFun(day);
    });
    $(".day_30").click(function () {
        $("#user-line-chart").empty();
        day = 30;
        GetDayUserFun(day);
    });

    //资产变动
    //获取user ba ca每天资产变动
    function GetAmountLineFun(day) {
        GetAmountLine(token, day, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                LineFun(data);
            }
        }, function (response) {
            LayerFun(response.errcode);
        });
    }

    GetAmountLineFun(day);

    //折线图
    function LineFun(data) {
        Morris.Line({
            element: 'morris-line-chart',
            data: data,
            xkey: 'day',
            ykeys: ['us_sum', 'ba_rest', 'ca_rest'],
            labels: ['User 资产', 'Ba 资产', 'Ca 资产'],
            fillOpacity: 0.6,
            hideHover: 'auto',
            smooth: true,
            behaveLikeLine: true,
            resize: true,
            pointFillColors: ['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors: ['green', 'red', 'blue']
        });
    }
});