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

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //获取 statistics_user_token
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

    //获取当前域名
    var url = getRootPath();

    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });

    //点赞
    var give_us_id = "", state = "";
    $(".zan_btn").click(function () {
        give_us_id = $(this).children(".us_id").text();
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
    $(".cai_btn").click(function () {
        give_us_id = $(this).children(".us_id").text();
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
        var give_num = $(".confirm_input").val();
        ZanShowLogin("show");
        Give(token, give_us_id, give_num, state, function (response) {
            if (response.errcode == "0") {
                ZanShowLogin("hide");
                if (state == "1") {
                    $('.web_toast_text').text("点赞成功!");
                } else if (state == "2") {
                    $('.web_toast_text').text("踩成功!");
                }

                $(".web_toast").fadeIn("fast");
                $(".confirmMode").fadeOut("fast");

                //点赞成功出现动画
                $(".suc_zan").fadeIn("fast");
                setTimeout(function () {
                    $(".web_toast").fadeOut("fast");
                }, 2000);
                window.location.reload();
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
});