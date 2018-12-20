$(function () {
    // var wechat = decodeURI(GetQueryString("wechat"));
    // var group_id = decodeURI(GetQueryString("group_id"));
    // var group_name = decodeURI(GetQueryString("group_name"));
    var wechat = "";
    var group_id = "";
    var group_name = "";
    var search_content = "";

    //如果是群聊内容
    if (wechat == "null") {
        wechat = " ";
        $(".person_name").text(group_name);
    } else {//如果是个人聊天内容
        group_id = " ";
        $(".person_name").text(wechat);
    }


    //显示个人聊天内容
    $(document).on("click", ".message_icon", function () {
        wechat = $(this).parents("tr").find(".wechat").text();
        group_id = null;
        group_name = null;
        $(".person_name").text(wechat);
        // $("iframe").attr("src", "./chat_person.html?wechat=" + encodeURI(encodeURI(wechat)) + "&group_id=" + encodeURI(encodeURI(group_id)) + "&group_name=" + encodeURI(encodeURI(group_name)));
        // $(".close_page,.mask").fadeIn();
        // $("html, body").css("overflow", "hidden")
    });

    //显示群聊内容
    $(document).on("click", ".look_chat_recode_btn", function () {
        wechat = null;
        $(".person_name").text(group_name);
        // $("iframe").attr("src", "./chat_person.html?wechat=" + encodeURI(encodeURI(wechat)) + "&group_id=" + encodeURI(encodeURI(group_id)) + "&group_name=" + encodeURI(encodeURI(group_name)));
        // $(".close_page,.mask").fadeIn();
        // $("html, body").css("overflow", "hidden")
    });


    var limit = 50, offset = 0;

    function GetWeChatFun(wechat, group_id, search_content, limit, offset) {
        var li = "", bot_content = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetChatPerson(wechat, group_id, search_content, limit, offset, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    $('.chat_content').html("<h1 style='text-align: center;color:#ffffff'>暂无聊天内容</h1>")
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
                // $(".chat_item_ul").html(li);
                layerContentFun(li);


                //默认在最底部
                // $('#chat_content').scrollTop(999999999);
                // $('html,body').scrollTop(999999999);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetWeChatFun(wechat, group_id, search_content, limit, offset);

    //滚动监听
    $("#chat_content").scroll(function () {
        console.log("scroll");
        var height = $(document).scrollTop();
        console.log(height);
    });

    //显示搜索
    $(".search_icon").click(function () {
        $(".title_search_box").fadeOut();
        $(".search_box").fadeIn();
    });

    //进行搜索
    $(".search_btn").click(function () {
        search_content = $(".search_input").val();
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

    function layerContentFun(li) {

        layer.open({
            type: 1,
            skin: 'layui-layer-rim chat_box', //加上边框
            area: ['80%', '90%'], //宽高
            content: '<div class="chat_content" id="chat_content">\n' +
            '    <div class="none_weChat"><span>暂无更多聊天内容</span></div>\n' +
            '    <ul class="chat_item_ul" id="chat_item_ul">' + li + '</ul>\n' +
            '</div>'
        });

        $("#chat_content").bind("scroll", function () {
            console.log('scroll');
        })


        // layer.open({
        //     type: 1,
        //     title: false,
        //     closeBtn: 0,
        //     shadeClose: true,
        //     skin: 'chat_box',
        //     content: '<div class="chat_content" id="chat_content">\n' +
        //     '    <div class="none_weChat"><span>暂无更多聊天内容</span></div>\n' +
        //     '    <ul class="chat_item_ul" id="chat_item_ul">'+ li +'</ul>\n' +
        //     '</div>'
        // });
    }


});