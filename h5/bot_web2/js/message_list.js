$(function () {
    //token
    var token = GetCookie("user_token");
    var group_id = GetCookie("group_id");
    var status = "1";
    //获取消息列表
    GetNewsRecord(token, group_id, status, function (response) {
        // if (response.errcode == "0") {
        console.log(response);
        // }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    })
});