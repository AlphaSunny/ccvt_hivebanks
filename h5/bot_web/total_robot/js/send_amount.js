$(function () {
    //获取token
    var token = GetCookie("total_robot_token");


    // var url = getRootPath();
    var limit = 10, offset = 0;

    function GetAmountFun(start_time, end_time, nickname) {
        var tr = "";
        GetAmount(token, start_time, end_time, nickname, limit, offset, function (response) {
            console.log(response);
            if(response.errcode == "0"){
                $(".all_amount").text(response.all_amount);
                $(".all_chat").text(response.all_chat);
                // $("#pagination").pagination({
                //     currentPage: (limit + offset) / limit,
                //     totalPage: totalPage,
                //     isShow: false,
                //     count: count,
                //     prevPageText: "<<",
                //     nextPageText: ">>",
                //     callback: function (current) {
                //         GetGroupMemberFun(token, limit, (current - 1) * limit, status);
                //         loading = layer.load(1, {
                //             shade: [0.1, '#fff'] //0.1透明度的白色背景
                //         });
                //     }
                // });
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    var start_time = "", end_time = "", nickname = "";
    GetAmountFun(start_time, end_time, nickname);


    $(".searchBtn").click(function () {
        start_time = $("#startTime").val();
        end_time = $("#endTime").val();
        nickname = $("#nickname").val();
        GetAmountFun(start_time, end_time, nickname);
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