$(function () {
    //获取token
    var token = GetCookie("total_robot_token");


    var url = getRootPath();

    // function GiveLikeListFun(start_time, end_time, nickname) {
    //     GiveLikeList(function (response) {
    //
    //     }, function (response) {
    //         layer.msg(response.errmsg, {icon: 2});
    //     });
            $.ajax({
                "url": url + "/api/bot_web/admin/glory_integral_list.php?token=" + encodeURIComponent(token),
                "type": "GET",
                success: function (data) {
                    // $(".all_amount").text(data.all_amount);
                    // $(".all_chat").text(data.all_chat);
                    $('#giveLikeTable').DataTable({
                        order: [[3, "desc"]],
                        destroy: true,
                        deferRender: true,
                        data: data.data,
                        columns: [
                            {"data": "give_account"},
                            {"data": "receive_account"},
                            {"data": "tx_amount"},
                            {"data": "utime"}
                        ],
                    });
                }
            });
    // }

    // var start_time = "", end_time = "", nickname = "";
    // GetAmount(start_time, end_time, nickname);
    //
    //
    // $(".searchBtn").click(function () {
    //     start_time = $("#startTime").val();
    //     end_time = $("#endTime").val();
    //     nickname = $("#nickname").val();
    //     GetAmount(start_time, end_time, nickname);
    // });
    //
    // //Set time
    // $('#startTime,#endTime').datetimepicker({
    //     initTime: new Date(),
    //     format: 'Y/m/d H:i',
    //     value: new Date(),
    //     // minDate: new Date(),//Set minimum date
    //     // minTime: new Date(),//Set minimum time
    //     yearStart: 2018,//Set the minimum year
    //     yearEnd: 2050 //Set the maximum year
    // });
});