$(function () {
    //获取token
    var token = GetCookie("total_robot_token");


    var url = getRootPath();

    function GetAmount(start_time, end_time, nickname) {
        $.ajax({
            "url": url + "/api/bot_web/admin/iss_records_list.php?token=" + encodeURIComponent(token) + "&start_time=" + start_time + "&end_time=" + end_time + "&nickname=" + nickname,
            "type": "GET",
            success: function (data) {
                $(".all_amount").text(data.all_amount);
                $(".all_chat").text(data.all_chat);
                $('#sendAmountTable').DataTable({
                    order: [[3, "desc"]],
                    destroy: true,
                    deferRender: true,
                    data: data.data,
                    columns: [
                        {"data": "wechat"},
                        {"data": "amount"},
                        {"data": "num"},
                        {"data": "send_time"}
                    ],
                });
            }
        });
    }

    var start_time = "", end_time = "", nickname = "";
    GetAmount(start_time, end_time, nickname);


    $(".searchBtn").click(function () {
        start_time = $("#startTime").val();
        end_time = $("#endTime").val();
        nickname = $("#nickname").val();
        GetAmount(start_time, end_time, nickname);
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