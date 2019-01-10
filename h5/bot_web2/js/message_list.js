$(function () {
    //token
    var token = GetCookie("user_token");
    var group_id = GetCookie("group_id");
    var status = "4";
    //获取消息列表
    GetNewsRecord(token, group_id, status, function (response) {
    }, function (response) {
        console.log(response.data);
        var data = response.data;
        if (!data) {
            $(".no_data").text("暂无数据");
            return;
        }
    })
});