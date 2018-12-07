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
                $(".login").remove();
                $(".amount").text(response.rows.base_amount);
                $(".amount_box").fadeIn();
            }
        }, function (response) {
            // alert(response.errmsg);
        })
    }

    var tr = "", limit = 10, offset = 0, total = "", page = 1;

    function Fun(limit, offset) {
        GetLeaderBoard(limit, offset, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                total = response.total;
                // page = Math.floor(total / 10);
                $.each(data, function (i, val) {
                    if (data[i].sorting == "1") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].base_amount + "</td>" +
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
                            "<td>" + data[i].base_amount + "</td>" +
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
                            "<td>" + data[i].base_amount + "</td>" +
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
                            "<td>" + data[i].base_amount + "</td>" +
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
            }
        }, function (response) {
            // alert(response.errmsg);
        });
    }

    Fun(limit, offset);

    //上一页
    $(".pre_btn").click(function () {
        offset -= 10;
        if (offset <= 0) {
            $(".page").text(1);
        }
        $(".page").text(Math.floor(offset / 10) + 1);
        if (offset == 0) {
            tr = "";
            $(".next_btn").attr("disabled", false);
            Fun(limit, offset);
            $(this).attr("disabled", true);
            return;
        }
        tr = "";
        $(".next_btn").attr("disabled", false);
        Fun(limit, offset);
    });

    //下一页
    $(".next_btn").click(function () {
        offset += 10;
        $(".page").text(Math.floor(offset / 10) + 1);
        if (Math.floor(offset / 10) >= Math.floor(total / 10)) {
            $(this).attr("disabled", true);
        }
        tr = "";
        $(".pre_btn").attr("disabled", false);

        Fun(limit, offset);
    });

    //登录
    $(".login").click(function () {
        window.location.href = "../user/login.html?leaderBoard=leaderBoard";
    });

    //查看聊天内容
    $(document).on("click", ".link_name", function () {
        var wechat = $(this).text();
        window.location.href = "chat_person.html?wechat=" + encodeURI(encodeURI(wechat));
    });

    //赞/踩
    var give_us_id = "";
    $(document).on("click", ".zan_icon,.cai_icon", function () {
        if (!token) {
            alert("操作之前请先登录!");
            return;
        }
        if ($(this).hasClass("zan_icon")) {
            $(".zan_h3").fadeIn("fast");
            $(".zan_text_box").fadeIn("fast");
            $(".cai_h3").fadeOut("fast");
            $(".cai_text_box").fadeOut("fast");
            $(".customize_modal_confirm_btn").addClass("zan_confirm").removeClass("cai_confirm");
        } else if ($(this).hasClass("cai_icon")) {
            $(".cai_h3").fadeIn("fast");
            $(".cai_text_box").fadeIn("fast");
            $(".zan_h3").fadeOut("fast");
            $(".zan_text_box").fadeOut("fast");
            $(".customize_modal_confirm_btn").addClass("cai_confirm").removeClass("zan_confirm");
        }
        $("#customize_modal").slideDown();
        give_us_id = $(this).siblings(".us_id").text();
    });

    //确定点赞/cai
    var give_num = "", state = "";
    $(".customize_modal_confirm_btn").click(function () {
        give_num = $(".zan_cai_input").val();
        if ($(this).hasClass("zan_confirm")) {
            state = "1";
            ConfirmZanCaiFun();
        }
        if ($(this).hasClass("cai_confirm")) {
            state = "2";
            ConfirmZanCaiFun();
        }
    });

    //取消
    $(".customize_modal_cancel_btn").click(function () {
        $("#customize_modal").slideUp();
    });

    //赞--》踩--》
    function ConfirmZanCaiFun() {
        var index = layer.load(1, {
            shade: [0.1,'#fff']
        });
        ConfirmZanCai(token, give_us_id, give_num, state, function (response) {
            $("#customize_modal").slideUp();
            layer.close(index);
            if (response.errcode == "0") {
                if (state == "1") {
                    layer.msg("点赞成功");
                }
                if (state == "2") {
                    layer.msg("踩成功");
                }
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });
    }
});