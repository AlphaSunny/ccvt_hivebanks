$(function () {
    var wechat = GetQueryString("wechat");

    GetChatPerson(wechat, function (response) {
        console.log(response);
        if (response.errcode == "0") {
            var data = response.rows;
            if (data.length <= 0) {
                $('.chat_content').html("<h1>暂无聊天内容</h1>")
            }
        }
    }, function (response) {
        alert(response.errmsg);
    })
});