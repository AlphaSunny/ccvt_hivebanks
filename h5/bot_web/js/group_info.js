$(function () {
    var group_id = decodeURI(GetQueryString("id")), is_admin_del = decodeURI(GetQueryString("is_admin_del")),
        is_del = decodeURI(GetQueryString("is_del")), is_flirt = decodeURI(GetQueryString("is_flirt")),
        is_give_ccvt = decodeURI(GetQueryString("is_give_ccvt")),
        bind_account_notice = decodeURI(GetQueryString("bind_account_notice")),
        is_welcome = decodeURI(GetQueryString("is_welcome")), welcome = decodeURI(GetQueryString("welcome")),
        send_address = decodeURI(GetQueryString("send_address")),
        group_name = decodeURI(GetQueryString("group_name"));

    $(".group_name").text(group_name);
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

    //打开关闭编辑面板
    $(".edit_group").click(function () {
        $("form").slideToggle(300);
    });

    //提交编辑
    $(".editSubBtn").click(function () {
        var del = $("#runSwitch").val();
        var flirt = $("#trickSwitch").val();
        var send_address = $("#pushSwitch").val();
        var bind_account_notice = $("#bindSwitch").val();
        var is_welcome = $("#welcomeSwitch").val();
        var welcome = $("#welcomeText").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditGroup(token, group_name, del, flirt, group_id, send_address, bind_account_notice, is_welcome, welcome, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                layer.msg("提交成功", {icon: 1});
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //监听开关按钮状态
    $(".switch").on("change", function () {
        var id = $(this).attr("id");
        SwitchChangeFun(id);
    });

    function SwitchChangeFun(id) {
        if ($("#" + id).val() == "1") {
            $("#" + id).removeClass("active").val("2");
            if (id == "welcomeSwitch") {
                console.log("true 1");
                $(".welcomeTextBox").addClass("none");
            }
        } else {
            $("#" + id).addClass("active").val("1");
            if (id == "welcomeSwitch") {
                console.log("true 2");
                $(".welcomeTextBox").removeClass("none");
            }
        }
    }

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