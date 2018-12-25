$(function () {
    var token = GetCookie("user_token");
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

    //获取荣耀排行榜
    var limit = 50, offset = 0, group_id = "all", group_name = "", total = "", search_content = "";

    //选择群
    $("#title").on("change", function () {
        group_id = $(this).val();
        group_name = $(this).children("option:selected").text();
        HonorFun(limit, offset, search_content, group_id);
        if (group_id != "all") {
            $(".look_chat_recode_btn").fadeIn();
        } else {
            $(".look_chat_recode_btn").fadeOut();
        }
    });

    //获取排行榜
    function HonorFun(limit, offset, search_content, group_id) {
        var tr = "", sorting = "", scale = "", count = "", totalPage = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetLeaderBoard(limit, offset, search_content, group_id, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    tr="<tr><td colspan='4' class='text-center'>暂无数据</td></tr>"
                }
                total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (totalPage > 1 && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                if (offset == 0) {
                    $(".top_start").text("1");
                    $(".top_end").text(limit);
                } else if (Math.floor(total / limit) != Math.floor(offset / limit)) {
                    $(".top_start").text(offset + 1);
                    $(".top_end").text(offset + limit);
                } else {
                    $(".top_start").text(offset + 1);
                    $(".top_end").text(total);
                }

                $.each(data, function (i, val) {
                    if (data[i].scale <= 0) {
                        scale = "";
                    } else {
                        scale = "<svg class='icon icon_grade' aria-hidden='true'><use xlink:href='#icon-v" + data[i].scale + "'></use></svg>";
                    }
                    if (data[i].sorting == "1") {
                        sorting = "<td class='text-center'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>";
                    } else if (data[i].sorting == "2") {
                        sorting = "<td class='text-center'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-second'></use></svg></td>";
                    } else if (data[i].sorting == "3") {
                        sorting = "<td class='text-center'><svg class='icon' aria-hidden='true'><use xlink:href='#icon-third'></use></svg></td>";
                    } else {
                        sorting = "<td class='sorting text-center'>" + data[i].sorting + "</td>";
                    }
                    tr += "<tr>" +
                        sorting +
                        "<td class='weChatName'><span class='wechat'>" + data[i].wechat + "</span>&nbsp;" + scale + "</td>" +
                        "<td class='text-center'><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                        "<td class='text-center'>" +
                        "<span class='none us_id'>" + data[i].us_id + "</span>" +
                        "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                        "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                        "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                        "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                        "</td>" +
                        "</tr>"
                });
                $("#leaderBoardBody").html(tr);

                //显示页码
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        HonorFun(limit, (current - 1) * limit, search_content, group_id);
                    }
                });
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });

        setTimeout(function () {
            HonorFun(limit, offset, search_content, group_id);
        }, 300000)
    }

    HonorFun(limit, offset, search_content, group_id);

    //获取群列表
    var option = "<option value='all'>全部</option>";
    GetGroupList(function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            $.each(data, function (i, val) {
                option += "<option value=" + data[i].id + ">" + data[i].name + "</option>";
            });
            $("#title").html(option);
        }
    }, function (response) {
        layer.msg(response.errmsg, {icon: 2});
    });

    //搜索
    $(".nick_name_search").click(function () {
        search_content = $(".search_input").val();
        if (search_content.length <= 0) {
            layer.msg("请输入搜索内容");
            return;
        }
        HonorFun(limit, offset, search_content, group_id);
    });
    $(".search_input").focus(function () {
        $(this).keyup(function (e) {
            if (e.keyCode == "8") {
                var search_content = e.target.value;
                if (search_content == "") {
                    HonorFun(limit, offset, search_content, group_id);
                }
            }
        })
    });

    //登录
    $(".usLogin").click(function () {
        window.location.href = "../user/login.html?honor=honor";
    });

    //关闭聊天内容close_page
    $(".close_page").click(function () {
        $("#chat_box").fadeOut();
        $("html, body").css("overflow", "unset");
    });

    //赞/踩
    var give_us_id = "", state = "",
        _this_click_zan_num = "",
        _this_click_cai_num = "",
        _this_already_zan_num = "",
        _this_already_cai_num = "",
        amount = "";
    $(document).on("click", ".zan_icon", function () {
        if (!token) {
            alert("操作之前请先登录!");
            return;
        }
        // amount = Number($(".amount").text());
        amount = $(".amount").html();
        console.log(amount);
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
    var give_num = "";
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
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        ConfirmZanCai(token, give_us_id, give_num, state, function (response) {
            $("#customize_modal").slideUp();
            layer.close(index);
            if (response.errcode == "0") {
                console.log(typeof amount);
                console.log(typeof give_num);
                console.log(amount);
                console.log(give_num);
                var amount_total = (amount - give_num);
                console.log(amount_total);
                $(".amount").text(amount_total);
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