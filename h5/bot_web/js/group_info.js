$(function () {
    //获取token
    var token = GetCookie("robot_token");

    //获取url参数
    var is_admin_del = decodeURI(GetQueryString(is_admin_del)), id = decodeURI(GetQueryString(id)),
        is_del = decodeURI(GetQueryString(is_del)), is_flirt = decodeURI(GetQueryString(is_flirt)),
        send_address = decodeURI(GetQueryString(send_address)),
        bind_account_notice = decodeURI(GetQueryString(bind_account_notice)),
        is_welcome = decodeURI(GetQueryString(is_welcome)), welcome = decodeURI(GetQueryString(welcome));
    var is_group_info = window.location.href;
    var reg = new RegExp("group_info.html");
    if (reg.test(is_group_info)) {
        if (is_admin_del == "1") {//运行状态
            $("#runSwitch").addClass("active").val("1");
            $("#trickSwitch").addClass("active").val("1");
        } else {
            $("#runSwitch").removeClass("active").val("2");
            $("#trickSwitch").addClass("active").val("2");
        }

        if (is_del == "1") {//运行状态
            $("#runSwitch").addClass("active").val("1");
        } else {
            $("#runSwitch").removeClass("active").val("2");
        }
        if (is_flirt == "1") {//调戏状态
            $("#trickSwitch").addClass("active").val("1");
        } else {
            $("#trickSwitch").removeClass("active").val("2");
        }
        if (send_address == "1") {//是否开启早晚推送
            $("#pushSwitch").addClass("active").val("1");
        } else {
            $("#pushSwitch").removeClass("active").val("2");
        }
        if (bind_account_notice == "1") {//是否开启未绑定ccvt提示
            $("#bindSwitch").addClass("active").val("1");
        } else {
            $("#bindSwitch").removeClass("active").val("2");
        }
        if (is_welcome == "1") {//是否开启欢迎
            $("#welcomeSwitch").addClass("active").val("1");
            $("#welcomeText").val(welcome);
            $(".welcomeTextBox").removeClass("none");
        } else {
            $("#welcomeSwitch").removeClass("active").val("2");
            $(".welcomeTextBox").addClass("none");
        }
    }

    //获取对应id
    var group_id = GetQueryString("group_id");
    var _group_name = GetQueryString("group_name");
    var group_name = decodeURI(_group_name);
    $(".group_name").text(group_name);

    //查看聊天记录
    $(".lookChatCode").click(function () {
        window.location.href = "chat_record.html?group_id=" + group_id;
    });

    //获取群成员列表
    var limit = 10, offset = 0, status = "-1", loading = "";

    function GetGroupMemberFun(token, limit, offset, status) {
        var tr = "", totalPage = "", count = "";
        GetGroupMember(token, group_id, limit, offset, status, function (response) {
            layer.close(loading);
            if (response.errcode == "0") {
                var data = response.rows;
                totalPage = Math.floor(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td>" + data[i].name + "</td>" +
                        "<td>" + data[i].chat_num + "</td>" +
                        "</tr>"
                });
                $("#groupMember").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetGroupMemberFun(token, limit, (current - 1) * limit, status);
                        loading = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                        });
                    }
                });
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg);
        })
    }

    GetGroupMemberFun(token, limit, offset, status);

    //查看某一段/天
    $(".click_day").click(function () {
        status = $(this).attr("name");
        loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        GetGroupMemberFun(token, limit, offset, status);
    })

});