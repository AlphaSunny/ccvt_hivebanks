$(function () {
    var login_us = GetQueryString('user');

    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var user_token = GetIndexCookie('user_token');

    if (user_token || login_us) {
        $('.usLogin').remove();
        $('.accountNone').removeClass('accountNone');
    }


    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
    });

    //chart
    function ChartLine(x_arr,y_arr) {
        var ctx = document.getElementById("canvas").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        // var data = {
        //     labels: x_arr,
        //     datasets: [
        //         {
        //             label: "日期",
        //             fillColor: "rgba(220,220,220,0.2)",
        //             strokeColor: "rgba(220,220,220,1)",
        //             pointColor: "rgba(220,220,220,1)",
        //             pointStrokeColor: "#fff",
        //             pointHighlightFill: "#fff",
        //             pointHighlightStroke: "rgba(220,220,220,1)",
        //             data: y_arr
        //         }
        //     ]
        // };
    }



    //获取群列表
    $.ajax({
        type: "GET",
        url: getRootPath() + "/api/group_info/group_list.php",
        dataType: "json",
        success: function (res) {
            if (res.errcode == "0") {
                var data = res.rows;
                var li = "";
                $.each(data, function (i, val) {
                    if (data[i].id == "1") {
                        li = "<li class='group_item active' name='" + data[i].id + "'>" + data[i].name + "</li>"
                    } else {
                        li += "<li class='group_item' name='" + data[i].id + "'>" + data[i].name + "</li>"
                    }
                });
                $(".group_item_box").html(li);
            }
        },
        error: function (res) {
            ErrorPrompt(res.errmsg);
        }
    });


    //获取群详细信息
    var group_id = 1;
    $(document).on("click", ".group_item", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        group_id = $(this).attr("name");
        GetGroupInfo(group_id);
    });

    function GetGroupInfo(group_id) {
        $.ajax({
            type: "GET",
            url: getRootPath() + "/api/group_info/group_info.php?group_id=" + group_id,
            dataType: "json",
            success: function (res) {
                if (res.errcode == "0") {
                    var data = res.row, bind_num = "", glory_number = "";
                    var bind_rows = res.bind_rows;
                    var y_arr = [], x_arr = [];
                    // var newArr = [];
                    $(".name").text(data.name);
                    $(".bind_count").text(data.bind_count);
                    $(".glory_number").text(data.glory_number);
                    $(".group_member_number").text(data.group_member_number);
                    $(".this_day_in").text(data.this_day_in);
                    $(".scale").text(data.scale);

                    if (data.is_top == 1) {
                        $(".scale_next_p").addClass("none");
                        $(".up_tips").attr("data-original-title", "已达该领域最高级");
                    } else {
                        $(".scale_next").text(parseInt(data.scale) + 1);
                        $(".scale_next_p").removeClass("none");
                        if ((parseInt(data.next_level_bind_number) - (parseInt(data.bind_count))) <= 0) {
                            bind_num = 0;
                        } else {
                            bind_num = parseInt(data.next_level_bind_number) - parseInt(data.bind_count);
                        }

                        if (((parseInt(data.next_level_glory_number)) - (parseInt(data.glory_number))) <= 0) {
                            glory_number = 0;
                        } else {
                            glory_number = parseInt(data.next_level_glory_number) - parseInt(data.glory_number);
                        }
                        $(".up_tips").attr("data-original-title", "距离下一级还需：" + bind_num + "个绑定用户 " + glory_number + "颗荣耀星数");
                    }
                    $(".up_tips").tooltip();


                    //chart line
                    $.each(bind_rows, function (i, val) {
                        // newArr.push({x: bind_rows[i].date, y: bind_rows[i].num});
                        x_arr.push(bind_rows[i].date);
                        y_arr.push(bind_rows[i].num);
                    });
                    // ChartLine(newArr);
                    ChartLine(x_arr, y_arr);

                }
            },
            error: function (res) {
                ErrorPrompt(res.errmsg);
            }
        });
    }

    GetGroupInfo(group_id);
});