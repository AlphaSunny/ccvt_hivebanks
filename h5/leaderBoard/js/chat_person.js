$(function () {
    var wechat_url = GetQueryString("wechat");
    var wechat = decodeURI(wechat_url);
    $(".person_name").text(wechat);

    function GetWeChatFun() {
        var li = "";
        GetChatPerson(wechat, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    $('.chat_content').html("<h1 style='text-align: center'>暂无聊天内容</h1>")
                }
                $.each(data, function (i, val) {
                    if (data[i].type == "Text") {
                        li += "<li class='chat_item'>" +
                            "<p class='chat_item_name'>" + data[i].bot_nickname.substr(0,1) + "</p>" +
                            "<div class='chat_item_content_box'>" +
                            "<p class='name'><span>" + data[i].bot_nickname + "</span>&nbsp;&nbsp;<span>" + data[i].bot_send_time + "</span></p>" +
                            "<p class='chat_item_content'>" + data[i].bot_content + "</p>" +
                            "</div>" +
                            "</li>";
                    }
                    if (data[i].type == "Picture") {
                        li += "<li class='chat_item'>" +
                            "<p class='chat_item_name'>" + data[i].bot_nickname.substr(0,1) + "</p>" +
                            "<div class='chat_item_content_box'>" +
                            "<p class='name'><span>" + data[i].bot_nickname + "</span>&nbsp;&nbsp;<span>" + data[i].bot_send_time + "</span></p>" +
                            "<p class='chat_item_content'><img src='" + data[i].bot_content + "' alt=''></p>" +
                            "</div>" +
                            "</li>";
                    }
                });
                $(".chat_item_ul").html(li);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetWeChatFun();

});