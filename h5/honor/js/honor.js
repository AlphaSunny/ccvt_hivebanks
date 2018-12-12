$(function () {
    var token = GetCookie("user_token");
    if (!token) {
        $(".usAccount").remove();
        $(".usLogin,.usRegister").fadeIn();
    } else {
        GetUserInfoFun();
        $(".usLogin,.usRegister").remove();
        $(".usAccount,.amount_li").fadeIn();
        $("nav ul").css("width", "15rem");
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

    var limit = 50, offset = 0, total = "", search_content = "";

    function HonorFun(limit, offset, search_content) {
        var tr = "", sorting = "", scale = "", count = "", totalPage = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetLeaderBoard(limit, offset, search_content, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
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
                        sorting = "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>";
                    } else if (data[i].sorting == "2") {
                        sorting = "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-second'></use></svg></td>";
                    } else if (data[i].sorting == "3") {
                        sorting = "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-third'></use></svg></td>";
                    } else {
                        sorting = "<td>" + data[i].sorting + "</td>";
                    }
                    tr += "<tr>" +
                        sorting +
                        "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "&nbsp;" + scale + "</a></td>" +
                        "<td><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                        "<td>" +
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
                        HonorFun(limit, (current - 1) * limit, search_content);
                    }
                });
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });

        setTimeout(function () {
            HonorFun(limit, offset, search_content);
        }, 300000)
    }

    HonorFun(limit, offset, search_content);

    //搜索
    $(".search_icon").click(function () {
        search_content = $(".search_input").val();
        if (search_content.length <= 0) {
            layer.msg("请输入搜索内容");
            return;
        }
        HonorFun(limit, offset, search_content);
    });
    $(".search_input").focus(function () {
        $(this).keyup(function (e) {
            if (e.keyCode == "8") {
                var search_content = e.target.value;
                if (search_content == "") {
                    HonorFun(limit, offset, search_content);
                }
            }
        })
    });

    //登录
    $(".usLogin").click(function () {
        window.location.href = "../user/login.html?honor=honor";
    });

    //显示聊天内容
    $(document).on("click", ".message_icon", function () {
        var wechat = $(this).parents("tr").find(".link_name").text();
        $("iframe").attr("src", "./chat_person.html#bottom?wechat=" + encodeURI(encodeURI(wechat)));
        $(".close_page,.mask").fadeIn();
        $("html, body").css("overflow","hidden")
    });

    //关闭聊天内容close_page
    $(".close_page").click(function () {
        $(".mask,.close_page").fadeOut();
        $("html, body").css("overflow","unset");
    });

    //赞/踩
    var give_us_id = "", state = "",
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
        amount = $(".amount").text();
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
                console.log(response);
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
                $(".amount").text(amount -= give_num);
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