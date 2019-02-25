$(function () {
    let token = GetCookie("user_token");
    if (!token) {
        $(".usAccount").remove();
        $(".usLogin,.usRegister").removeClass("none");
    } else {
        GetUserInfoFun();
        $(".usLogin,.usRegister").remove();
        $(".usAccount,.amount_li").removeClass("none");
    }

    //获取用户信息
    function GetUserInfoFun() {
        UserInformation(token, function (response) {
            if (response.errcode == "0") {
                // $(".login").remove();
                $(".amount").text(response.rows.base_amount);
                $(".amount_box").fadeIn();
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    let wechat = "", limit = 50, offset = 0, search_content = "";
    let group_id = "", group_name = "";

    //显示群聊内容
    $(".look_chat_recode").click( function () {
        wechat = null;
        group_id = $(this).attr("name");
        group_name = $(".group_title").text();
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
        $(".chat_search_box").removeClass("none");
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

    //关闭聊天内容close_page
    $(".close_page").click(function () {
        $("#chat_box").fadeOut();
        $("html, body").css("overflow", "unset");
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
    });

//========================
    //赞/踩
    let give_us_id = "", state = "",
        _this_click_zan_num = "",
        _this_click_cai_num = "",
        _this_already_zan_num = "",
        _this_already_cai_num = "",
        amount = "";
    $(document).on("click", ".zan_icon,.cai_icon", function () {
        if (!token) {
            alert("操作之前请先登录!");
            return;
        }
        amount = Number($(".pc_amount").text());
        AlreadyZanCaiNumFun();
        if ($(this).hasClass("zan_icon")) {
            $(".zan_h3").fadeIn("fast");
            $(".zan_text_box").fadeIn("fast");
            $(".cai_h3").fadeOut("fast");
            $(".cai_text_box").fadeOut("fast");
            $(".customize_modal_confirm_btn").addClass("zan_confirm").removeClass("cai_confirm");
            _this_already_zan_num = parseInt($(this).siblings(".zan_num").text());
            _this_click_zan_num = $(this).siblings(".zan_num");
            state = "1";
        } else if ($(this).hasClass("cai_icon")) {
            $(".cai_h3").fadeIn("fast");
            $(".cai_text_box").fadeIn("fast");
            $(".zan_h3").fadeOut("fast");
            $(".zan_text_box").fadeOut("fast");
            $(".customize_modal_confirm_btn").addClass("cai_confirm").removeClass("zan_confirm");
            _this_already_cai_num = parseInt($(this).siblings(".cai_num").text());
            _this_click_cai_num = $(this).siblings(".cai_num");
            state = "2";
        }
        $("#customize_modal").slideDown();
        give_us_id = $(this).siblings(".us_id").text();
    });

    //已经点赞和踩的次数
    function AlreadyZanCaiNumFun() {
        AlreadyZanCaiNum(token, function (response) {
            if (response.errcode == "0") {
                if (state == "1") {
                    $(".all_zan").text(response.rows.all_zan);
                    $(".max_give_like").text(response.rows.max_give_like);
                }
                if (state == "2") {
                    $(".all_cai").text(response.rows.all_cai);
                    $(".max_give_no_like").text(response.rows.max_give_no_like);
                }
            }
        }, function (response) {
            layer.msg(response);
        })
    }

    //确定点赞/cai
    let give_num = "";
    $(".customize_modal_confirm_btn").click(function () {
        give_num = Number($(".zan_cai_input").val());
        if (give_num.length <= 0) {
            layer.msg("请输入数量");
            return;
        }
        if (!(/^[1-9]\d*$/).test(give_num)) {
            layer.msg("请输入正确的数值");
            return;
        }
        ConfirmZanCaiFun();
    });

    //取消
    $(".customize_modal_cancel_btn").click(function () {
        $("#customize_modal").slideUp();
    });

    //赞--》踩--》
    function ConfirmZanCaiFun() {
        let index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        ConfirmZanCai(token, give_us_id, give_num, state, function (response) {
            $("#customize_modal").slideUp();
            layer.close(index);
            if (response.errcode == "0") {
                $(".pc_amount,.phone_amount").text(amount -= give_num);
                if (state == "1") {
                    _this_click_zan_num.text(_this_already_zan_num += give_num);
                    layer.msg("点赞成功");
                }
                if (state == "2") {
                    _this_click_cai_num.text(_this_already_cai_num += give_num);
                    layer.msg("踩成功");
                }
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });
    }
});