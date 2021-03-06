$(function () {
    function GetIndexCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    let user_token = GetIndexCookie('user_token');

    if (user_token) {
        $('.usLogin,.usRegister').remove();
        $('.accountNone').removeClass('none');
    } else {
        $('.accountNone').remove();
    }


    $('.toAccountBtn').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        }
    });

    //chart
    function ChartLine(x_arr, y_arr) {
        let ctx = document.getElementById("canvas").getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                labels: x_arr,
                datasets: [{
                    label: 'CCVT发放趋势图',
                    // data: [12, 19, 3, 5, 2, 3],
                    data: y_arr,
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
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    //获取群详细信息
    let group_id = GetQueryString("id");
    $(document).on("click", ".group_item", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        group_id = $(this).attr("name");
        GetGroupInfo(group_id);
    });

    function GetGroupInfo(group_id) {
        GetDoMainInfo(group_id, function (response) {
            if (response.errcode == "0") {
                let data = response.row, bind_num = "", glory_number = "";
                let bind_rows = response.bind_rows;
                let y_arr = [], x_arr = [];
                $(".group_title").text(data.name);
                $(".bind_count").text(data.bind_count);
                $(".glory_number").text(data.glory_number);
                $(".group_member_number").text(data.group_member_number);
                $(".this_day_in").text(data.this_day_in);
                $(".scale").text(data.scale);
                $(".type_name").text(data.type_name);
                $(".group_lord").text(data.group_lord);

                let next_bind_number = parseInt(data.next_level_bind_number) - parseInt(data.bind_count);
                let next_glory_number = parseInt(data.next_level_glory_number) - parseInt(data.glory_number);

                if (data.is_top == 1) {
                    $(".scale_next_p").addClass("none");
                    $(".up_tips").attr("data-original-title", "已达该领域最高级");
                    $(".progress-bar").css("width", "100%");
                } else {
                    $(".scale_next").text(parseInt(data.scale) + 1);
                    $(".scale_next_p").removeClass("none");
                    if (next_bind_number <= 0) {
                        bind_num = 0;
                    } else {
                        bind_num = next_bind_number;
                    }

                    if (next_glory_number <= 0) {
                        glory_number = 0;
                    } else {
                        glory_number = next_glory_number;
                    }
                    $(".up_tips").attr("data-original-title", "距离下一级还需：" + bind_num + "个绑定用户 " + glory_number + "颗荣耀星数");
                    let width = 100 - (bind_num + glory_number);
                    $(".progress-bar").css("width", width + "%");
                }
                $(".up_tips").tooltip();

                if (!data.dis) {
                    $(".group_introduction").text("暂无介绍");
                } else {
                    $(".group_introduction").text(data.dis);
                }

                if (data.qr_code_address) {
                    $(".qr_img").attr("src", data.qr_code_address)
                }


                //chart line
                $.each(bind_rows, function (i, val) {
                    x_arr.push(bind_rows[i].date);
                    y_arr.push(bind_rows[i].num);
                });
                // ChartLine(newArr);
                ChartLine(x_arr, y_arr);

            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        });
    }

    GetGroupInfo(group_id);

    //获取分配情况
    let c_limit = 10, c_offset = 0;
    let start_time = "",
        end_time = "",
        nickname = "";
    $("#search_btn").click(() => {
        start_time = $("#start_time").val().replace(/\//, "-");
        end_time = $("#end_time").val().replace(/\//, "-");
        nickname = $("#name").val();
        ShowLoading("show");
        GetCCVTListFun(group_id, start_time, end_time, nickname, c_limit, c_offset);
    });

    function GetCCVTListFun(group_id, start_time, end_time, nickname, c_limit, c_offset) {
        let tr = "", total = "", totalPage = "", count = "";
        GetCCVTList(group_id, start_time, end_time, nickname, c_limit, c_offset, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                let data = response.rows;
                console.log(data);
                if (data.length <= 0) {
                    tr = "<tr><td class='text-center' colspan='3'>暂无数据</td></tr>"
                }

                total = response.total;
                totalPage = Math.ceil(total / c_limit);

                if (totalPage <= 1) {
                    count = 1;
                } else if (totalPage > 1 && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].wechat + "</td>" +
                        "<td class='text-center'>" + data[i].amount + "</td>" +
                        "<td class='text-center'>" + data[i].send_time + "</td>" +
                        "</tr>"
                });
                $("#CCVTList").html(tr);

                $("#c_pagination").pagination({
                    currentPage: (c_limit + c_offset) / c_limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        ShowLoading("show");
                        GetCCVTListFun(group_id, start_time, end_time, nickname, c_limit, (current - 1) * c_limit);
                    }
                });

            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }

    GetCCVTListFun(group_id, start_time, end_time, nickname, c_limit, c_offset);

    //绑定人数
    let limit = 30, offset = 0;
    $(".bind_count_box").click(function () {
        BindNumFun(group_id, limit, offset)
    });

    function BindNumFun(group_id, limit, offset) {
        let li = "", wechat = "", scale = "", total = "", totalPage = "", count = "";
        ShowLoading("show");
        BindNum(group_id, limit, offset, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                $(".bind_num_box").removeClass("none");
                let data = response.rows;
                if (data.length <= 0) {
                    li = "<li><td class='text-center'>暂无数据</td></li>"
                }
                total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (totalPage > 1 && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    if (parseInt(data[i].scale) != 0) {
                        scale = "<svg class='icon icon_grade' aria-hidden='true'><use xlink:href='#icon-v" + data[i].scale + "'></use></svg>";
                    } else {
                        scale = "<span></span>"
                    }

                    if (data[i].wechat != null) {
                        wechat = "<span class='wechat'>" + data[i].wechat + "</span>";
                    }else{
                        wechat = "<span class='wechat'></span>";
                    }
                    li += "<li>" +
                        scale +
                        wechat +
                        "</li>";
                });
                $(".bind_list_ul").html(li);

                //显示页码
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        BindNumFun(group_id, limit, (current - 1) * limit);
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }

    $(".bind_num_close").click(() => {
        $(".bind_num_box").addClass("none");
    });

    //选择时间
    function SetTime(type) {
        if(type == "start_time"){
            console.log("开始时间");
            $('#start_time').datetimepicker({
                initTime: new Date(),
                format: 'Y/m/d H:i',
                value: new Date(),
                // minDate: new Date(),//Set minimum date
                // minTime: new Date(),//Set minimum time
                yearStart: 2000,//Set the minimum year
                yearEnd: 2050 //Set the maximum year
            });
        }else{
            console.log("结束时间");
            $('#end_time').datetimepicker({
                initTime: new Date(),
                format: 'Y/m/d H:i',
                value: new Date(),
                minDate: new Date(),//Set minimum date
                minTime: new Date(),//Set minimum time
                yearStart: 2018,//Set the minimum year
                yearEnd: 2050 //Set the maximum year
            });
        }
    }

    $(document).on('click, focus', '#start_time', function () {
        SetTime("start_time");
    });
    $(document).on('click, focus', '#end_time', function () {
        SetTime("end_time");
    })
});

/**
 * Initialization page loading loading
 */
window.onload = function () {
    if (document.readyState === 'loading') {
        document.body.style.overflow = "hidden";
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        let loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};