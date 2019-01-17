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
    function ChartLine(newArrary) {
        var color = Chart.helpers.color;
        var config = {
            type: 'line',
            data: {
                labels : ["February","March","April","May","June","July"],
                datasets: [{
                    label: '注册人数增长趋势图',
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    fill: false,
                    data: newArrary,
                },
                    // {
                    //     label: '新增人数',
                    //     backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    //     borderColor: window.chartColors.blue,
                    //     fill: false,
                    //     data: [{
                    //         x: newDate(0),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(2),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(4),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(5),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(5),
                    //         y: randomScalingFactor()
                    //     }]
                    // },
                    // {
                    //     label: '退群人数',
                    //     backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    //     borderColor: window.chartColors.green,
                    //     fill: false,
                    //     data: [{
                    //         x: newDate(0),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(2),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(4),
                    //         y: randomScalingFactor()
                    //     }, {
                    //         x: newDate(5),
                    //         y: randomScalingFactor()
                    //     }]
                    // }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: '群成员变化图'
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        display: true,
                        time: {
                            // round: 'day'
                            tooltipFormat: 'll HH:mm'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '日期'
                        },
                        ticks: {
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#FF0000'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }]
                }
            }
        };
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);
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
                    var newArrary = [];
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
                        newArrary.push({x: bind_rows[i].date, y: bind_rows[i].num})
                    });
                    ChartLine(newArrary);

                }
            },
            error: function (res) {
                ErrorPrompt(res.errmsg);
            }
        });
    }

    GetGroupInfo(group_id);
});