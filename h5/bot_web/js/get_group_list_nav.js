$(function () {
    var token = GetCookie("robot_token"), is_audit = "", send_address = "", bind_account_notice = "", is_welcome = "",
        welcome = "", group_name = "", is_admin_del = "", is_del = "", is_flirt = "";

    function GetGroupListNav() {
        var li = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                send_address = data[0].send_address;
                bind_account_notice = data[0].bind_account_notice;
                is_welcome = data[0].is_welcome;
                welcome = data[0].welcome;
                is_admin_del = data[0].is_admin_del;
                is_del = data[0].is_del;
                is_flirt = data[0].is_flirt;
                group_name = data[0].group_name;
                $.each(data, function (i, val) {
                    li += "<li>" +
                        "<a class='app-menu__item to_group_link' id='" + data[i].id + "' is_admin_del='" + data[i].is_admin_del + "' is_del='" + data[i].is_del + "' is_flirt='" + data[i].is_flirt + "' is_give_ccvt='" + data[i].is_give_ccvt + "' bind_account_notice='" + data[i].bind_account_notice + "' is_welcome='" + data[i].is_welcome + "' send_address='" + data[i].send_address + "' welcome='" + data[i].welcome + "' href='group_info.html'>" +
                        "<i class='app-menu__icon fa fa-circle-o'></i>" +
                        "<span class='app-menu__label'>" + data[i].name + "</span>" +
                        "</a>" +
                        "</li>"
                });
                $(".app-menu").append(li);
                check_is_group();
            }
        }, function (response) {
            layer.msg("请稍后再试");
        })
    }

    GetGroupListNav();

    function check_is_group() {
        //是否为当前页面
        var is_group_info = window.location.href;
        var reg = new RegExp("group_info.html");
        if (reg.test(is_group_info)) {
            $(".group_name").text(group_name);
            if (is_admin_del == "1") {//运行状态
                $("#runSwitch").addClass("active").val("1");
                $("#trickSwitch").addClass("active").val("1");
            } else {
                $("#runSwitch").removeClass("active").val("2");
                $("#trickSwitch").addClass("active").val("2");
            }

            if (is_del == "1") {//运行状态
                $("#runSwitch").addClass("active").val("1");
            } else {
                $("#runSwitch").removeClass("active").val("2");
            }
            if (is_flirt == "1") {//调戏状态
                $("#trickSwitch").addClass("active").val("1");
            } else {
                $("#trickSwitch").removeClass("active").val("2");
            }
            if (send_address == "1") {//是否开启早晚推送
                $("#pushSwitch").addClass("active").val("1");
            } else {
                $("#pushSwitch").removeClass("active").val("2");
            }
            if (bind_account_notice == "1") {//是否开启未绑定ccvt提示
                $("#bindSwitch").addClass("active").val("1");
            } else {
                $("#bindSwitch").removeClass("active").val("2");
            }
            if (is_welcome == "1") {//是否开启欢迎
                $("#welcomeSwitch").addClass("active").val("1");
                $("#welcomeText").val(welcome);
                $(".welcomeTextBox").removeClass("none");
            } else {
                $("#welcomeSwitch").removeClass("active").val("2");
                $(".welcomeTextBox").addClass("none");
            }
        }
    }

    // $(document).on("click", ".to_group_link", function () {
    //     var group_name = $(this).text();
    //     var is_admin_del = $(this).attr("is_admin_del"),//总后台是否开启群运行
    //         id = $(this).attr("id"),//群id
    //         is_del = $(this).attr("is_del"),//是否开启运行状态
    //         is_flirt = $(this).attr("is_flirt"),//是否开启调戏状态
    //         is_welcome = $(this).attr("is_welcome"),//是否开启欢迎语
    //         bind_account_notice = $(this).attr("bind_account_notice"),//是否开启未绑定ccvt通知
    //         send_address = $(this).attr("send_address"),//是否开启早八晚十推送
    //         welcome = $(this).attr("welcome");//是否开启早八晚十推送
    //     window.location.href = "group_info.html?group_name=" + encodeURI(encodeURI(group_name)) + "&is_admin_del=" + encodeURI(is_admin_del) + "&id=" + encodeURI(id) + "&is_del=" + encodeURI(is_del) + "&is_flirt=" + encodeURI(is_flirt) + "&is_welcome=" + encodeURI(is_welcome) + "&bind_account_notice=" + encodeURI(bind_account_notice) + "&send_address=" + encodeURI(send_address) + "&welcome=" + encodeURI(encodeURI(welcome));
    // });

    //监听开关按钮状态
    $(".switch").on("change", function () {
        var id = $(this).attr("id");
        SwitchChangeFun(id);
    });

    function SwitchChangeFun(id) {
        if ($("#" + id).val() == "1") {
            $("#" + id).removeClass("active").val("2");
            if (id == "welcomeSwitch") {
                console.log("true 1");
                $(".welcomeTextBox").addClass("none");
            }
        } else {
            $("#" + id).addClass("active").val("1");
            if (id == "welcomeSwitch") {
                console.log("true 2");
                $(".welcomeTextBox").removeClass("none");
            }
        }
    }

});