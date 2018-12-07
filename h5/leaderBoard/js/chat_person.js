$(function () {
    var wechat = GetQueryString("wechat");
    console.log(wechat);
    console.log(decodeURI(wechat));
    $(".person_name").text(decodeURI(wechat));

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