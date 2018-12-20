$(function () {

    var limit = 50, offset = 0, search_content = "";

    function GetWeChatFun(wechat, group_id, search_content, limit, offset) {
        var bot_content = "", li = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetChatPerson(wechat, group_id, search_content, limit, offset, function (response) {
            $("#chat_box").fadeIn(300);
            $("html, body").css("overflow", "hidden");
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
                var total = response.total;
                if (total <= limit + offset) {
                    $(".none_weChat").text("下拉刷新加载更多内容");
                } else {
                    $(".none_weChat").text("暂无更多聊天内容");
                }
                $.each(data, function (i, val) {
                    if (data[i].type == "Text" || data[i].type == "Sharing") {
                        bot_content = "<span>" + data[i].bot_content + "</span>";
                    }
                    if (data[i].type == "Picture") {
                        bot_content = "<img src='" + data[i].bot_content + "' alt=''>";
                    }
                    if (data[i].type == "Video") {
                        bot_content = "<video src='" + data[i].bot_content + "' controls='controls'></video>";
                    }

                    li += "<li class='chat_item'>" +
                        "<p class='chat_item_name'>" + data[i].bot_nickname.substr(0, 1) + "</p>" +
                        "<div class='chat_item_content_box'>" +
                        "<p class='name'><span>" + data[i].bot_nickname + "</span>&nbsp;&nbsp;<span>" + data[i].bot_send_time + "</span></p>" +
                        "<div class='chat_item_content'>" + bot_content + "</div>" +
                        "</div>" +
                        "</li>";
                });
                var pre_height = $("#chat_content")[0].scrollHeight;
                // console.log($("#chat_content")[0].scrollHeight);

                $(".chat_item_ul").prepend(li);
                var now_height = $("#chat_content")[0].scrollHeight;
                // console.log("now_height=" + now_height);
                //默认在最底部
                if (offset == 0) {
                    $("#chat_box").scrollTop($("#chat_content")[0].scrollHeight);
                } else {
                    $("#chat_box").scrollTop(now_height - pre_height);
                }
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    //显示搜索
    $(".search_icon").click(function () {
        $(".title_search_box").fadeOut();
        $(".search_box").fadeIn();
    });

    //进行搜索
    $(".search_btn").click(function () {
        search_content = $(".chat_search_input").val();
        if (search_content.length <= 0) {
            layer.msg("请输入搜索内容");
            return;
        }
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //隐藏搜索
    $(".close_icon").click(function () {
        $(".search_box").fadeOut();
        $(".title_search_box").fadeIn();
        $(".search_input").val("");
        search_content = "";
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //scroll
    $("#chat_box").scroll(function () {
        var pre_height = $(this).scrollTop();
        if (pre_height <= 0) {
            offset += limit;
            GetWeChatFun(wechat, group_id, search_content, limit, offset);
        }
    })
});