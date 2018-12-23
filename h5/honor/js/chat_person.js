$(function () {
    var wechat = "", group_id = "", group_name = "", limit = 50, offset = 0, search_content = "";

    //显示个人聊天内容
    $(document).on("click", ".message_icon", function () {
        wechat = $(this).parents("tr").find(".wechat").text();
        group_id = null;
        group_name = null;
        $(".person_name").text(wechat);
        offset = 0;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //显示群聊内容
    $(document).on("click", ".look_chat_recode_btn", function () {
        wechat = null;
        group_id = $("#title").val();
        group_name = $("#title option:selected").text();
        $(".person_name").text(group_name);
        offset = 0;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    var is_content = 1;

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
                console.log(data.length);
                var total = response.total;
                if (total <= limit + offset) {
                    $(".none_weChat").text("暂无更多聊天内容");
                    is_content = 0;
                } else {
                    $(".none_weChat").text("下拉刷新加载更多内容");
                }

                if (data.length <= 0 && offset <= 0) {
                    console.log(data.length + "ggg");
                    $(".no_more_chat").fadeIn();
                    // $(".chat_content").css("height", "100%");
                    $(".none_weChat,.chat_item_ul").fadeOut();
                } else {
                    $(".no_more_chat").fadeOut();
                    // $(".chat_content").css("height", "auto");
                    $(".none_weChat,.chat_item_ul").fadeIn();
                }
                if (data.length <= 9) {
                    // $('.chat_content').css("height", "100%");
                }else {
                    // $('.chat_content').css("height", "auto");
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

                if (offset <= 0) {
                    $(".chat_item_ul").html(li);
                } else {
                    $(".chat_item_ul").prepend(li);
                }

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
    $(".chat_search_icon").click(function () {
        $(".title_search_box").fadeOut();
        $(".chat_search_box").fadeIn();
    });

    //进行搜索
    $(".chat_search_input").bind("input porpertychange", function () {
        console.log("输入框在变");
        search_content = $(".chat_search_input").val();
        offset = 0;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    $(".chat_search_btn").click(function () {
        search_content = $(".chat_search_input").val();
        if (search_content.length <= 0) {
            layer.msg("请输入搜索内容");
            return;
        }
        offset = 0;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //隐藏搜索
    $(".close_icon").click(function () {
        $(".chat_search_box").fadeOut();
        $(".title_search_box").fadeIn();
        $(".chat_search_input").val("");
        search_content = "";
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //scroll
    $("#chat_box").scroll(function () {
        if (is_content == 0) {
            return;
        }
        var height = $(this).scrollTop();
        if (height <= 0) {
            offset += limit;
            GetWeChatFun(wechat, group_id, search_content, limit, offset);
        }
    })
});