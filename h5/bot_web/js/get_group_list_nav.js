$(function () {
    var token = GetCookie("robot_token"), is_audit = "";

    GetGroupList(token, is_audit, function (response) {
        console.log(response);
    }, function (response) {
        layer.msg("请稍后再试");
    })
});