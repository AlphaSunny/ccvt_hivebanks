$(function () {
    //获取token
    var token = GetCookie("robot_token");

    var limit = 10, offset = 0, loading = "";

    function GetAmountFun(start_time, end_time, nickname, limit, offset) {
        var tr = "", totalPage = "", count = "";
        GetAmount(token, start_time, end_time, nickname, limit, offset, function (response) {
            layer.close(loading);
            if (response.errcode == "0") {
                $(".all_amount").text(response.all_amount);
                $(".all_chat").text(response.all_chat);
                var data = response.rows;
                totalPage = Math.floor(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>";
                } else {
                    $.each(data, function (i, val) {
                        tr += "<tr>" +
                            "<td class='wechat'>" + data[i].wechat + "</td>" +
                            "<td class='amount'>" + data[i].amount + "</td>" +
                            "<td class='num'>" + data[i].num + "</td>" +
                            "<td class='send_time'>" + data[i].send_time + "</td>" +
                            "</tr>";
                    });
                }
                $("#sendBody").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetAmountFun(start_time, end_time, nickname, limit, (current - 1) * limit);
                        loading = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                        });
                    }
                });
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    var start_time = "", end_time = "", nickname = "";
    GetAmountFun(start_time, end_time, nickname, limit, offset);


    $(".searchBtn").click(function () {
        start_time = $("#startTime").val();
        end_time = $("#endTime").val();
        nickname = $("#nickname").val();
        GetAmountFun(start_time, end_time, nickname, limit, offset);
    });

    //Set time
    $('#startTime,#endTime').datetimepicker({
        initTime: new Date(),
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//Set minimum date
        // minTime: new Date(),//Set minimum time
        yearStart: 2018,//Set the minimum year
        yearEnd: 2050 //Set the maximum year
    });
});