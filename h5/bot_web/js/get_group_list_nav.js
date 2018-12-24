$(function () {
    var token = GetCookie("robot_token"), is_audit = "";

    function GetGroupListNav() {
        var li = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    li += "<li>" +
                        "<a class='app-menu__item to_group_link' id='" + data[i].id + "' is_admin_del='" + data[i].is_admin_del + "' is_del='" + data[i].is_del + "' is_flirt='" + data[i].is_flirt + "' is_give_ccvt='" + data[i].is_give_ccvt + "' is_welcome='" + data[i].is_welcome + "' send_address='" + data[i].send_address + "' href='group_member.html'>" +
                        "<i class='app-menu__icon fa fa-circle-o'></i>" +
                        "<span class='app-menu__label'>" + data[i].name + "</span>" +
                        "</a>" +
                        "</li>"
                });
                $(".app-menu").append(li);
            }
        }, function (response) {
            layer.msg("请稍后再试");
        })
    }

    GetGroupListNav();

    //检查是否是group_member页面
    $(document).on("click", ".to_group_link", function () {
        var is_group_member = window.location.href;
        var reg = new RegExp("group_member.html");
        if (reg.test(is_group_member)) {
            var is_admin_del = $(this).attr("is_admin_del"),//总后台是否开启群运行
                id = $(this).attr("id"),//群id
                is_del = $(this).attr("is_del"),//是否开启运行状态
                is_flirt = $(this).attr("is_flirt"),//是否开启调戏状态
                is_welcome = $(this).attr("is_welcome"),//是否开启欢迎语
                bind_account_notice = $(this).attr("bind_account_notice"),//是否开启未绑定ccvt通知
                send_address = $(this).attr("send_address");//是否开启早八晚十推送

        }
    });
});