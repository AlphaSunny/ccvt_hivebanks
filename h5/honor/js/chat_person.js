$(function () {
    var wechat_url = GetQueryString("wechat");
    var wechat = decodeURI(wechat_url);
    var search_content = "";
    $(".person_name").text(wechat);

    function GetWeChatFun(search_content) {
        var li = "", bot_content = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetChatPerson(wechat, search_content, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    $('.chat_content').html("<h1 style='text-align: center;color:#ffffff'>暂无聊天内容</h1>")
                }
                $.each(data, function (i, val) {
                    if (data[i].type == "Text" || data[i].type == "Sharing") {
                        bot_content = "<span>"+ data[i].bot_content +"</span>";
                    }
                    if (data[i].type == "Picture") {
                        bot_content = "<img src='" + data[i].bot_content + "' alt=''>";
                    }
                    if (data[i].type == "Video") {
                        bot_content = "<video src='"+ data[i].bot_content +"' controls='controls'></video>";
                    }

                    li += "<li class='chat_item'>" +
                        "<p class='chat_item_name'>" + data[i].bot_nickname.substr(0, 1) + "</p>" +
                        "<div class='chat_item_content_box'>" +
                        "<p class='name'><span>" + data[i].bot_nickname + "</span>&nbsp;&nbsp;<span>" + data[i].bot_send_time + "</span></p>" +
                        "<div class='chat_item_content'>"+ bot_content +"</div>" +
                        "</div>" +
                        "</li>";
                });
                $(".chat_item_ul").html(li);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetWeChatFun(search_content);

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
        GetWeChatFun(search_content);
    });

    //隐藏搜索
    $(".close_icon").click(function () {
        $(".search_box").fadeOut();
        $(".title_search_box").fadeIn();
        $(".search_input").val("");
        search_content = "";
        GetWeChatFun(search_content);
    });

    //默认在最底部
    // var x = 0;
    // $("#chat_content").scroll(function () {
    //     console.log(x+=1);
    //     var height = $(".chat_item_ul")[0].scrollHeight;
    //     console.log(height);
    // });


    // $("#chat_content").scrollTop(3000+"px");
console.log($("#chat_item_ul")[0].offsetHeight);
    $('html,body').animate({scrollTop:'500px'},500);
//     window.scroll(0,document.body.scrollHeight)
});