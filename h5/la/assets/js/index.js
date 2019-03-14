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
                {label: "Digital Currency Agents", value: ba_register_count},
                {label: "Legal Currency Agents", value: ca_register_count}],
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