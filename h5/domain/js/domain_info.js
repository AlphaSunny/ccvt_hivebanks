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
                    label: '成员增长趋势图',
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
        $.ajax({
            type: "GET",
            url: getRootPath() + "/api/domain/domain.php?group_id=" + group_id,
            dataType: "json",
            success: function (res) {
                if (res.errcode == "0") {
                    let data = res.row, bind_num = "", glory_number = "";
                    let bind_rows = res.bind_rows;
                    let y_arr = [], x_arr = [];
                    $(".name").text(data.name);
                    $(".bind_count").text(data.bind_count);
                    $(".glory_number").text(data.glory_number);
                    $(".group_member_number").text(data.group_member_number);
                    $(".this_day_in").text(data.this_day_in);
                    $(".scale").text(data.scale);

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


                    //chart line
                    $.each(bind_rows, function (i, val) {
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

    //查看聊天记录
    $(".look_chat_recode").click(function () {
        let group_id = GetQueryString("id");
        let group_name = $(".name").text();
        window.location.href = "../honor/chat_person.html?group_id=" + group_id + "&group_name=" + encodeURI(encodeURI(group_name)) + "&domain=1";
    })
});