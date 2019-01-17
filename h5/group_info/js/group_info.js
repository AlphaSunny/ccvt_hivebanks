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
        url: getRootPath() + "/api/group_info/group_info.php",
        dataType: "json",
        success: function (res) {
            if (res.errcode == "0") {
                var data = res.rows;
                $.each(data, function (i, val) {

                })
            }
        },
        error: function (res) {
            ErrorPrompt(res.errmsg);
        }
    });


    //获取群详细信息
    $(".group_item").click(function () {
        var group_id = 1;
        GetGroupInfo(group_id);
    });

    function GetGroupInfo(group_id) {
        $.ajax({
            type: "GET",
            url: getRootPath() + "/api/group_info/group_info.php",
            data:{
                "group_id":group_id
            },
            dataType: "json",
            success: function (res) {
                if (res.errcode == "0") {
                    var data = res.rows;
                    console.log(data);
                }
            },
            error: function (res) {
                ErrorPrompt(res.errmsg);
            }
        });
    }
});