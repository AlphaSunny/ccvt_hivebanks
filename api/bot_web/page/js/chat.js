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
    var token = GetCookie("user_token");

    //获取余额
    var user_amount = "";
    if (token) {
        $(".login").remove();
        $(".amount_box").fadeIn("fast");
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                SetCookie('statistics_user_id', data.us_id);
                $(".amount").text(data.base_amount);
                user_amount = parseInt(data.base_amount);
            }
        }, function (response) {
            layer.msg("余额获取失败");
        })
    }

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");
    var status = GetQueryString("status");

    $(".filter_title").click(function () {
        $(".filter_box").slideToggle("fast");
    });

    //获取已经点赞和已经踩的数量
    var first_already_zan_count = parseInt($(".already_zan_count").text());
    var first_already_cai_count = parseInt($(".already_cai_count").text());

    //点赞
    var give_us_id = "", state = "", chat = "",
        bottom_zan_num = "", _this_bottom_zan_button = "",
        bottom_cai_num = "", _this_bottom_cai_button = "";
    $(".zan_img_box, .chat_zan_btn").click(function () {
        give_us_id = $(this).parents(".com_zan_cai_box").children(".us_id").text();
        if (!token) {
            alert("登录之后才可以点赞哦");
            return;
        }
        chat = "bottom_zan";
        bottom_zan_num = parseInt($(this).parents(".com_zan_cai_box").find(".bottom_zan_num").text());
        _this_bottom_zan_button = $(this).parents(".com_zan_cai_box").find(".bottom_zan_num");
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
    $(".cai_img_box, .chat_cai_btn").click(function () {
        give_us_id = $(this).parents(".com_zan_cai_box").children(".us_id").text();
        if (!token) {
            alert("登录之后才可以踩哦");
            return;
        }
        chat = "bottom_cai";
        bottom_cai_num = parseInt($(this).parents(".com_zan_cai_box").find(".bottom_cai_num").text());
        _this_bottom_cai_button = $(this).parents(".com_zan_cai_box").find(".bottom_cai_num");
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
        var give_num = $(".confirm_input").val();
        if (!(/^[1-9]\d*$/.test(give_num))) {
            alert("请输入正确的数值");
            return;
        }
        ZanShowLogin("show");
        Give(token, give_us_id, give_num, state, function (response) {
            if (response.errcode == "0") {
                ZanShowLogin("hide");
                if (state == "1") {
                    //判断如果是在底部统计点赞
                    if (chat == "bottom_zan") {
                        bottom_zan_num += parseInt(give_num);
                        _this_bottom_zan_button.text(bottom_zan_num);
                    }

                    first_already_zan_count += parseInt(give_num);
                    $(".already_zan_count").text(first_already_zan_count);

                    user_amount -= parseInt(give_num);
                    $(".amount").text(user_amount);
                    $('.web_toast_text').text("点赞成功!");

                    //点赞成功出现动画
                    $(".zan_cai_img").attr("src", $(".zan_cai_img").attr("zan_data_src"));
                    $(".suc_zan").fadeIn("fast");
                } else if (state == "2") {
                    //判断如果是在底部统计踩
                    if (chat == "bottom_cai") {
                        bottom_cai_num += parseInt(give_num);
                        _this_bottom_cai_button.text(bottom_cai_num);
                    }

                    first_already_cai_count += parseInt(give_num);
                    $(".already_cai_count").text(first_already_cai_count);
                    $('.web_toast_text').text("踩成功!");

                    user_amount -= parseInt(give_num);
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
        window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name) + "&status=" + encodeURIComponent(status);
    });

    //scroll top
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height > 0) {
            $("#chat .title").css("border-bottom", "1px solid #dadada");
        } else {
            $("#chat .title").css("border-bottom", "unset");
        }
        if (height >= 300) {
            $("#top").fadeIn("fast");
        } else {
            $("#top").fadeOut("fast");
        }

        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            $("#bottom").fadeOut();
        } else {
            $("#bottom").fadeIn();
        }
    });
    $("#top").click(function () {
        $("body, html").animate({scrollTop: 0}, 500);
    });

    //scroll bottom
    $("#bottom").click(function () {
        var bottom = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        $("body, html").animate({scrollTop: bottom}, 500);
    });

    //jump login
    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name) + "&chat=chat" + "&status=" + status;
    });
});