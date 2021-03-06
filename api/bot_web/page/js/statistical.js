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

    //获取首次已赞和已踩的数量
    var first_already_zan_count = parseInt($(".already_zan_count").text());
    var first_already_cai_count = parseInt($(".already_cai_count").text());


    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //获取 user_token
    var token = GetCookie("user_token");
    if (token) {
        $(".login").remove();
        $(".amount_box").fadeIn("fast");
        GetUserInfo();
    } else {
        $(".logOut").remove();
    }

    //点击退出
    $(".logOut").click(function () {
       DelCookie("user_token");
       DelCookie("statistics_user_id");
       window.location.reload();
    });

    function GetUserInfo() {
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

    //点击logo
    $(".logo_img").click(function () {
        window.location.href = url;
    });

    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name) + "&statistical=statistical";
    });

    //点赞
    var give_us_id = "", state = "", zan_count = "", integral = "", zan_cai_this = "", integral_this = "";
    $(".zan_btn").click(function () {
        give_us_id = $(this).children(".us_id").text();
        zan_count = parseInt($(this).children(".zan_count").text());
        zan_cai_this = $(this).children(".zan_count");

        integral = parseInt($(this).parents(".item").find(".integral").text());
        integral_this = $(this).parents(".item").find(".integral");
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
    var cai_count = "";
    $(".cai_btn").click(function () {
        give_us_id = $(this).children(".us_id").text();
        cai_count = parseInt($(this).children(".cai_count").text());
        zan_cai_this = $(this).children(".cai_count");
        integral = parseInt($(this).parents(".item").find(".integral").text());
        integral_this = $(this).parents(".item").find(".integral");
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
        if (!(/^[1-9]\d*$/.test(give_num))) {
            alert("请输入正确的数值");
            return;
        }
        ZanShowLogin("show");
        Give(token, give_us_id, give_num, state, function (response) {
            if (response.errcode == "0") {
                ZanShowLogin("hide");
                if (state == "1") {
                    first_already_zan_count += parseInt(give_num);
                    $(".already_zan_count").text(first_already_zan_count);//当前用户已经使用多少次赞

                    zan_count += parseInt(give_num);
                    zan_cai_this.text(zan_count);//被赞用户被赞多少次

                    integral += parseInt(give_num);
                    integral_this.text(integral);//被赞用户剩余积分

                    $('.web_toast_text').text("点赞成功!");
                    GetUserInfo();
                    //点赞成功出现动画
                    $(".zan_cai_img").attr("src", $(".zan_cai_img").attr("zan_data_src"));
                    $(".suc_zan").fadeIn("fast");

                } else if (state == "2") {
                    first_already_cai_count += parseInt(give_num);
                    $(".already_cai_count").text(first_already_cai_count);//当前用户已经使用多少次踩

                    cai_count += parseInt(give_num);
                    zan_cai_this.text(cai_count);//被踩用户被踩多少次

                    integral -= parseInt(give_num);
                    integral_this.text(integral);//被踩用户剩余积分

                    $('.web_toast_text').text("踩成功!");
                    GetUserInfo();
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
});