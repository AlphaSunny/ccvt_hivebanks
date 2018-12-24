$(function () {
    var token = GetCookie("robot_token"), is_audit = "";

    function GetGroupListNav() {
        var li = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    li += "<li>" +
                        "<a class='app-menu__item to_group_link' id='" + data[i].name + "' is_admin_del='" + data[i].is_admin_del + "' id_del = '" + data[i].is_del + "' is_flirt='" + data[i].is_flirt + "' bind_account_notice='" + data[i].bind_account_notice + "' send_address='" + data[i].send_address + "' is_welcome='" + data[i].is_welcome + "' href='javascript:;'>" +
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

    //前往群
    $(document).on("click", ".to_group_link", function () {
        var id = $(this).attr("id"), is_admin_del = $(this).attr("is_admin_del"),
            is_del = $(this).attr("is_del"), is_flirt = $(this).attr("is_flirt"),
            bind_account_notice = $(this).attr("bind_account_notice"), send_address = $(this).attr("send_address"),
            is_welcome = $(this).attr("is_welcome");
        console.log(encodeURI(id));
        console.log(encodeURI(encodeURI(id)));
        return;
        window.location.href = "group_member.html?id=" + id + "&is_admin_del=" + is_admin_del + "&is_del=" + is_del + "&is_flirt=" + is_flirt + is_del + "&bind_account_notice=" + bind_account_notice + "&send_address=" + send_address + bind_account_notice + "&is_welcome=" + is_welcome;
    })

});