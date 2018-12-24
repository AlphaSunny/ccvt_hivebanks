$(function () {
    var token = GetCookie("robot_token"), is_audit = "";

    function GetGroupListNav() {
        var li = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    li += "<li>" +
                        "<a class='app-menu__item' href='javascript:;'>" +
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

});