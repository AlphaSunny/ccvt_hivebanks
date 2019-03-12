$(function () {
    //get token
    var token = GetCookie('la_token');

    //get benchmark_type
    var benchmark_type = GetCookie("benchmark_type");

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    //Get Asset Balance Report
    function GetAssetsReportFun() {
        var sum_la_base_amount = '', sum_us_base_amount = '', sum_ba_base_amount = '', sum_ca_base_amount = '',
            ba_register_count, ca_register_count, us_register_count, tr = '';
        GetAssetsReport(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                sum_us_base_amount = data.sum_us_base_amount + data.sum_us_lock_amount;
                sum_ba_base_amount = data.sum_ba_base_amount;
                sum_ca_base_amount = data.sum_ca_base_amount;
                sum_la_base_amount = Number(sum_us_base_amount) + Number(sum_ba_base_amount) + Number(sum_ca_base_amount);
                ba_register_count = data.ba_register_count;
                ca_register_count = data.ca_register_count;
                us_register_count = data.us_register_count;
                if (sum_us_base_amount == null) {
                    sum_us_base_amount = 0;
                }
                if (sum_ba_base_amount == null) {
                    sum_ba_base_amount = 0;
                }
                if (sum_ca_base_amount == null) {
                    sum_ca_base_amount = 0;
                }
                if (sum_la_base_amount == null) {
                    sum_la_base_amount = 0;
                }
                if (ba_register_count == 0) {
                    ba_register_count = 0;
                }
                if (ca_register_count == 0) {
                    ca_register_count = 0;
                }
                if (us_register_count == 0) {
                    us_register_count = 0;
                }
                tr += '<tr>' +
                    '<td><span class="sum_la_base_amount">' + sum_la_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_us_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_ba_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_ca_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '</tr>';
                $('#amount_report').html(tr);
                var trInfo = '';
                var sum_us_recharge_base_amount = data.sum_us_recharge_base_amount,
                    sum_us_withdraw_base_amount = data.sum_us_withdraw_base_amount,
                    sum_ba_recharge_base_amount = data.sum_ba_recharge_base_amount,
                    sum_ba_withdraw_base_amount = data.sum_ba_withdraw_base_amount,
                    sum_ca_recharge_base_amount = data.sum_ca_recharge_base_amount,
                    sum_ca_withdraw_base_amount = data.sum_ca_withdraw_base_amount;

                if (sum_us_recharge_base_amount == null) {
                    sum_us_recharge_base_amount = 0
                }
                if (sum_us_withdraw_base_amount == null) {
                    sum_us_withdraw_base_amount = 0
                }
                if (sum_ba_recharge_base_amount == null) {
                    sum_ba_recharge_base_amount = 0
                }
                if (sum_ba_withdraw_base_amount == null) {
                    sum_ba_withdraw_base_amount = 0
                }
                if (sum_ca_recharge_base_amount == null) {
                    sum_ca_recharge_base_amount = 0
                }
                if (sum_ca_withdraw_base_amount == null) {
                    sum_ca_withdraw_base_amount = 0
                }

                trInfo += '<tr>' +
                    '<td><span class="sum_us_recharge_base_amount">' + sum_us_recharge_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_us_withdraw_base_amount">' + sum_us_withdraw_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_ba_recharge_base_amount">' + sum_ba_recharge_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_ba_withdraw_base_amount">' + sum_ba_withdraw_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_ca_recharge_base_amount">' + sum_ca_recharge_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_ca_withdraw_base_amount">' + sum_ca_withdraw_base_amount + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '</tr>';
                $('#amount_reportInfo').html(trInfo);

                var trGift = '';
                var G = (data.gift_row[0].t),
                    IG = (data.gift_row[1].IG),
                    NDG = (data.gift_row[2].NDG),
                    NDBG = (data.gift_row[3].NDBG),
                    NDAG = (data.gift_row[4].NDAG);
                var giftRegister = Number(NDG) + Number(NDBG) + Number(NDAG);


                trGift += '<tr>' +
                    '<td><span class="sum_us_recharge_base_amount">' + G + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_us_withdraw_base_amount">' + IG + '</span><span class="base_type">' + benchmark_type + '</span></td>' +
                    '<td><span class="sum_us_recharge_base_amount">' + giftRegister + '</span><span class="base_type">' + benchmark_type + '</span></td>' +

                    '</tr>';
                $('#amount_gift').html(trGift);

                //邀请排名海报
                var data = response.rows.gift_detail;

                DonutFun(us_register_count, ba_register_count, ca_register_count);

            }
        }, function (response) {
            LayerFun(response.errcode);
        });
    }

    GetAssetsReportFun();

    // setInterval(GetAssetsReportFun, 5000);

    //获取每天用户增长趋势图
    var day = "7", user_data = "";

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

    /* MORRIS DONUT CHART
			----------------------------------------*/

    //扇形图
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

    //折线图
    // var user = 2000, ba = 3000, ca = 4000;
    //     var dataChart = [{ y: '2018', u: user,  b: ba, c: ca}];
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

    //邀请排名
    let _limit = 10,_offset = 0;
    function GiftDetailFun(_limit,_offset){
        let tr = "",totalPage = "", count = "";
        GiftDetail(token,_limit,_offset,function (response) {
            ShowLoading("hide");
            if(response.errcode == "0"){
                let data = response.rows;
                if(!data){
                    GetDataEmpty('ranking', '6');
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
                $.each(data,function (i,va) {
                   tr+="<tr>" +
                       "<td>"+ data[i].rank +"</td>" +
                       "<td>"+ data[i].us_account +"</td>" +
                       "<td>"+ data[i].wechat +"</td>" +
                       "<td>"+ data[i].count +"</td>" +
                       "<td>"+ data[i].sub_count +"</td>" +
                       "<td>"+ data[i].base_amount +"</td>" +
                       "</tr>";
                    $("#ranking").html(tr);
                });

                $("#rankingPage").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GiftDetailFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        },function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg);
        });
    }
    GiftDetailFun(_limit,_offset);

    //荣耀积分
    let limit = 10, offset = 0;

    function GloryPointsFun(limit, offset) {
        let tr = "", totalPage = "", count = "";
        GloryPoints(token, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                if(!data){
                    GetDataEmpty('gloryPoints', '3');
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
                $.each(data,function (i,val) {
                    tr+="<tr>" +
                        "<td>"+ data[i].ranking +"</td>" +
                        "<td>"+ data[i].wechat +"</td>" +
                        "<td>"+ data[i].base_amount +"</td>" +
                        "</tr>"
                });
                $("#gloryPoints").html(tr);
                $("#gloryPointsRanking").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GloryPointsFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg);
        })
    }

    GloryPointsFun(limit, offset)
});