$(function () {
    //token
    var token = GetCookie("user_token");
    var group_id = GetCookie("group_id");
    var status = "1";
    //获取消息列表
    GetNewsRecord(token, group_id, status, function (response) {
        console.log(response);
        if (!response) {
            $(".no_data").text("暂无数据");
            return;
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    })
});