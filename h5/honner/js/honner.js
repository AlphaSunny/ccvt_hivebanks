$(function () {
    var token = GetCookie("user_token");
    if (!token) {
        $(".usAccount").remove();
        $(".usLogin,.usRegister").fadeIn();
    } else {
        GetUserInfoFun();
        $(".usLogin,.usRegister").remove();
        $(".usAccount").fadeIn();
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

    var limit = 50, offset = 0, total = "";

    function Fun(limit, offset) {
        var tr = "", count = "", totalPage = "";
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        GetLeaderBoard(limit, offset, function (response) {
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

                $.each(data, function (i, val) {
                    if (data[i].sorting == "1") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].scale + "</td>" +
                            "<td><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                            "<td>" +
                            "<span class='none us_id'>" + data[i].us_id + "</span>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else if (data[i].sorting == "2") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-second'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].scale + "</td>" +
                            "<td><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                            "<td>" +
                            "<span class='none us_id'>" + data[i].us_id + "</span>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else if (data[i].sorting == "3") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-third'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].scale + "</td>" +
                            "<td><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                            "<td>" +
                            "<span class='none us_id'>" + data[i].us_id + "</span>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else {
                        tr += "<tr>" +
                            "<td>" + data[i].sorting + "</td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].scale + "</td>" +
                            "<td><svg class='icon message_icon' aria-hidden='true'><use xlink:href='#icon-message'></use></svg></td>" +
                            "<td>" +
                            "<span class='none us_id'>" + data[i].us_id + "</span>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>"
                    }
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
                        $("#current").text(current);
                        Fun(limit, (current - 1) * limit);
                    }
                });
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });

        setTimeout(function () {
            Fun(limit, offset);
        }, 600000)
    }

    Fun(limit, offset);

    //登录
    $(".usLogin").click(function () {
        window.location.href = "../user/login.html?honner=honner";
    });

    //显示聊天内容
    $(document).on("click", ".message_icon", function () {
        var wechat = $(this).parents("tr").find(".link_name").text();
        $("iframe").attr("src", "./chat_person.html?wechat=" + encodeURI(encodeURI(wechat))).fadeIn();
        $(".close_page").fadeIn();
    });

    //关闭聊天内容close_page
    $(document).on("click", ".close_page", function () {
        $("#iframe,.close_page").fadeOut();
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