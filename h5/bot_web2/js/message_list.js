$(function () {
    //token
    var token = GetCookie("user_token");
    var status = "1";
    //获取消息列表
    GetNewsRecord(token, status, function (response) {
        if (response.errcode == "0") {
            console.log(response);
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    })
});