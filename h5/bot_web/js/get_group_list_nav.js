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
    var is_group_member = window.location.href;
    var reg = new RegExp("group_member.html");
    if (reg.test(is_group_member)) {
        var is_admin_del = $(this).attr("is_admin_del"), id = $(this).attr("id"),
            is_del = $(this).attr("is_del"), is_flirt = $(this).attr("is_flirt"),
            is_give_ccvt = $(this).attr("is_give_ccvt"), is_give_ccvt = $(this).attr("is_give_ccvt"),
            is_welcome = $(this).attr("is_welcome"), send_address = $(this).attr("send_address");
    }
});