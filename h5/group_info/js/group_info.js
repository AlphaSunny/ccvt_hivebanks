$(function () {
    $('[data-toggle="tooltip"]').tooltip();
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
    function newDate(days) {
        return moment().add(days, 'd').toDate();
    }

    function newDateString(days) {
        return moment().add(days, 'd').format();
    }

    var color = Chart.helpers.color;
    var config = {
        type: 'line',
        data: {
            datasets: [{
                label: '注册人数增长趋势图',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                fill: false,
                data: [{
                    x: newDateString(0),
                    y: randomScalingFactor()
                }, {
                    x: newDateString(2),
                    y: randomScalingFactor()
                }, {
                    x: newDateString(4),
                    y: randomScalingFactor()
                }, {
                    x: newDateString(5),
                    y: randomScalingFactor()
                }],
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
                    scaleLabel: {
                        display: true,
                        labelString: '时间'
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

    window.onload = function () {
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);
    };


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
                    var data = res.row;
                    $(".name").text(data.name);
                    $(".bind_count").text(data.bind_count);
                    $(".glory_number").text(data.glory_number);
                    $(".group_member_number").text(data.group_member_number);
                    $(".this_day_in").text(data.this_day_in);
                    $(".scale").text(data.scale);

                    if (data.is_top == 1) {
                        $(".scale_next_p").addClass("none");
                        $(".up_tips").attr("title","距离下一级还需："+ data.next_level_bind_number +"个绑定用户 "+ data.next_level_glory_number +"颗荣耀星数");
                    } else {
                        $(".scale_next").text(parseInt(data.scale) + 1);
                        $(".scale_next_p").removeClass("none");
                        $(".up_tips").attr("title","已达该领域最高级");
                    }

                }
            },
            error: function (res) {
                ErrorPrompt(res.errmsg);
            }
        });
    }

    GetGroupInfo(group_id);
});