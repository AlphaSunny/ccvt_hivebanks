$(function () {
    //获取token
    var token = GetCookie("total_robot_token");

    function GiveLikeListFun() {
        var tr = "";
        GiveLikeList(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>"
                } else {
                    $.each(data, function (i, val) {
                        tr += "<tr>" +
                            "<td>" + data[i].give_account + "</td>" +
                            "<td>" + data[i].receive_account + "</td>" +
                            "<td>" + data[i].tx_amount + "</td>" +
                            "<td>" + data[i].utime + "</td>" +
                            "</tr>"
                    })
                }
                $("#giveLike").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
        //         $.ajax({
        //             "url": url + "/api/bot_web/admin/glory_integral_list.php?token=" + encodeURIComponent(token),
        //             "type": "GET",
        //             success: function (data) {
        //                 // $(".all_amount").text(data.all_amount);
        //                 // $(".all_chat").text(data.all_chat);
        //                 $('#giveLikeTable').DataTable({
        //                     order: [[3, "desc"]],
        //                     destroy: true,
        //                     deferRender: true,
        //                     data: data.data,
        //                     columns: [
        //                         {"data": "give_account"},
        //                         {"data": "receive_account"},
        //                         {"data": "tx_amount"},
        //                         {"data": "utime"}
        //                     ],
        //                 });
        //             }
        //         });
    }

    GiveLikeListFun();

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