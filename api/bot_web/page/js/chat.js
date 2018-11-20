$(function () {
    var target = document.getElementById("mySpin");
    var spinner = new Spinner({
        lines: 8, // The number of lines to draw
        length: 10, // The length of each line
        width: 2, // The line thickness
        radius: 10, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    });

    function ZanShowLogin(type) {
        if (type == "show") {
            spinner.spin(target);
        }
        if (type == "hide") {
            spinner.spin();
        }
    }

    //获取token
    var token = GetCookie("statistics_user_token");

    if (token) {
        $(".login").remove();
        $(".amount_box").fadeIn("fast");
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                SetCookie('statistics_user_id', data.us_id);
                $(".amount").text(data.base_amount);
            }
        }, function (response) {
            layer.msg("余额获取失败");
        })
    }

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    $(".filter_title").click(function () {
        $(".filter_box").slideToggle("fast");
    });

    //获取已经点赞和已经踩的数量
    var first_already_zan_count = parseInt($(".already_zan_count").text());
    var first_already_cai_count = parseInt($(".already_cai_count").text());

    //获取余额
    var user_amount = parseInt($(".amount").text());
    console.log(user_amount);

    //点赞
    var give_us_id = "", state = "";
    $(".zan_img_box").click(function () {
        give_us_id = $(this).parents(".zan_cai_box").children(".us_id").text();
        if (!token) {
            alert("登录之后才可以点赞哦");
            return;
        }
        $(".zan_title").fadeIn("fast");
        $(".zan_num").fadeIn("fast");
        $(".zan_text").fadeIn("fast");
        $(".zan_top").fadeIn("fast");

        $(".cai_title").fadeOut("fast");
        $(".cai_num").fadeOut("fast");
        $(".cai_text").fadeOut("fast");
        $(".cai_top").fadeOut("fast");

        $(".confirmMode").fadeIn("fast");
        state = "1";
    });

    //踩
    $(".cai_img_box").click(function () {
        give_us_id = $(this).parents(".zan_cai_box").children(".us_id").text();
        if (!token) {
            alert("登录之后才可以踩哦");
            return;
        }
        $(".cai_title").fadeIn("fast");
        $(".cai_text").fadeIn("fast");
        $(".cai_num").fadeIn("fast");
        $(".cai_top").fadeIn("fast");

        $(".zan_title").fadeOut("fast");
        $(".zan_num").fadeOut("fast");
        $(".zan_text").fadeOut("fast");
        $(".zan_top").fadeOut("fast");

        $(".confirmMode").fadeIn("fast");
        state = "2";
    });

    //确定点赞
    $(".ok").click(function () {
        var give_num = parseInt($(".confirm_input").val());
        ZanShowLogin("show");
        Give(token, give_us_id, give_num, state, function (response) {
            if (response.errcode == "0") {
                ZanShowLogin("hide");
                if (state == "1") {
                    first_already_zan_count += give_num;
                    $(".already_zan_count").text(first_already_zan_count);

                    user_amount -= give_num;
                    $(".amount").text(user_amount);
                    $('.web_toast_text').text("点赞成功!");

                    //点赞成功出现动画
                    $(".zan_cai_img").attr("src", $(".zan_cai_img").attr("zan_data_src"));
                    $(".suc_zan").fadeIn("fast");
                } else if (state == "2") {
                    first_already_cai_count += give_num;
                    $(".already_cai_count").text(first_already_cai_count);
                    $('.web_toast_text').text("踩成功!");

                    user_amount -= give_num;
                    $(".amount").text(user_amount);

                    //踩成功出现动画
                    $(".zan_cai_img").attr("src", $(".zan_cai_img").attr("cai_data_src"));
                    $(".suc_zan").fadeIn("fast");
                }

                $(".web_toast").fadeIn("fast");
                $(".confirmMode").fadeOut("fast");

                setTimeout(function () {
                    $(".web_toast").fadeOut("fast");
                    $(".suc_zan").fadeOut("fast");
                }, 2000);
            }
        }, function (response) {
            ZanShowLogin("hide");
            $('.web_toast_text').text(response.errmsg);
            $(".web_toast").fadeIn("fast");
            $(".confirmMode").fadeOut("fast");
            setTimeout(function () {
                $(".web_toast").fadeOut("fast");
            }, 2000);
        });
    });

    //取消按钮
    $(".cancel").click(function () {
        $(".confirm_input").val("5");
        $(".confirmMode").fadeOut("fast");
        state = "";
    });

    //获取当前域名
    var url = getRootPath();
    $(".backStatistics").click(function () {
        window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //scroll top
    //scroll top
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height >= 300) {
            $("#top").fadeIn("fast");
        } else {
            $("#top").fadeOut("fast");
        }
    });
    $("#top").click(function () {
        $("body, html").animate({scrollTop: 0}, 500);
    });

    //jump login
    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name) + "&chat=chat";
    });
});