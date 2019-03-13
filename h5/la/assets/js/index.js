$(function () {
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
});