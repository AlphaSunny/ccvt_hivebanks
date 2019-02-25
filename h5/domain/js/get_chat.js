$(function () {
    let wechat = "", limit = 50, offset = 0, search_content = "";
    //
    // let group_id = GetQueryString("group_id");
    // let group_info = GetQueryString("domain");
    // let group_name = decodeURI(GetQueryString("group_name"));
    // if (group_info == "1") {
    //     $(".person_name").text(group_name);
    //     GetWeChatFun(wechat, group_id, search_content, limit, offset);
    // }
    let group_id = "", group_name = "";

    //显示群聊内容
    $(".look_chat_recode").click( function () {
        wechat = null;
        group_id = $(this).attr("name");
        group_name = $(this).text();
        $(".person_name").text(group_name);
        offset = 0;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    let is_content = 1;

    function GetWeChatFun(wechat, group_id, search_content, limit, offset) {
        let bot_content = "", li = "";
        let index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetChatPerson(wechat, group_id, search_content, limit, offset, function (response) {
            // if (group_info != "1") {
                $("#chat_box").fadeIn(300);
            //     $("html, body").css("overflow", "hidden");
            // }
            layer.close(index);
            if (response.errcode == "0") {
                let data = response.rows;
                let total = response.total;
                if (total <= limit + offset) {
                    $(".none_weChat").text("暂无更多聊天内容");
                    is_content = 0;
                } else {
                    $(".none_weChat").text("加载更多内容").css({"color": "blue", "cursor": "pointer"});
                }

                if (data.length <= 0 && offset <= 0) {
                    $(".no_more_chat").fadeIn();
                    $(".none_weChat,.chat_item_ul").fadeOut();
                } else {
                    $(".no_more_chat").fadeOut();
                    $(".none_weChat,.chat_item_ul").fadeIn();
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
                        "<p class='name'>" +
                        "<span>" + data[i].bot_nickname + "</span>&nbsp;&nbsp;" +
                        "<span>" + data[i].bot_send_time + "</span>" +
                        "<span class='none us_id'>" + data[i].us_id + "</span>&nbsp;&nbsp;" +
                        "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                        "<span class='zan_num'>"+ data[i].all_praise +"</span>&nbsp;|&nbsp;" +
                        "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                        "<span class='cai_num'>"+ data[i].all_point_on +"</span>" +
                        "</p>" +
                        "<div class='chat_item_content'>" + bot_content + "</div>" +
                        "</div>" +
                        "</li>";
                });
                let pre_height = $("#chat_content")[0].scrollHeight;

                if (offset <= 0) {
                    $(".chat_item_ul").html(li);
                } else {
                    $(".chat_item_ul").prepend(li);
                }

                let now_height = $("#chat_content")[0].scrollHeight;
                //默认在最底部
                if (offset == 0) {
                    $("#chat_box").scrollTop($("#chat_content")[0].scrollHeight);
                    $(".chat_box").scrollTop($("#chat_content")[0].scrollHeight);
                } else {
                    $("#chat_box").scrollTop(now_height - pre_height);
                    $(".chat_box").scrollTop(now_height - pre_height);
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
        search_content = $(".chat_search_input").val();
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

    //加载更多
    $(".none_weChat").click(function () {
        offset += limit;
        GetWeChatFun(wechat, group_id, search_content, limit, offset);
    });

    //scroll
    $("#chat_box,#chat_content").scroll(function () {
        if (is_content == 0) {
            return;
        }
        let height = $(this).scrollTop();
        if (height <= 5) {
            offset += limit;
            GetWeChatFun(wechat, group_id, search_content, limit, offset);
        }
    })
});