$(function () {
    var token = GetCookie("robot_token");
    var is_audit = "1";

    function GetGroupListNav() {
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {

            }
        }, function (response) {
            layer.msg("请稍后再试");
        })
    }

    GetGroupListNav();
});