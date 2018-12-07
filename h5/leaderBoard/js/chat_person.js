$(function () {
    var wechat_url = GetQueryString("wechat");
    var wechat = decodeURI(wechat_url);
    $(".person_name").text(wechat);

    GetChatPerson(wechat, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            if (data.length <= 0) {
                $('.chat_content').html("<h1 style='text-align: center'>暂无聊天内容</h1>")
            }
        }
    }, function (response) {
        alert(response.errmsg);
    })
});