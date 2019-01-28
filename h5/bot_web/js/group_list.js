$(function () {
    var token = GetCookie("user_token");

    //获取群列表
    function GetGroupListFun() {
        var tr = "", opt = "", is_audit = "", group_manager_name = "",
            send_address = "", bind_account_notice = "", is_welcome = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td colspan='8' class='text-center'>暂无数据</td></tr>";
                    $("#groupListTable").html(tr);
                    return;
                }
                $.each(data, function (i, val) {
                    if (data[i].is_audit == "1") {
                        opt = "审核中";
                    } else if (data[i].is_audit == "3") {
                        opt = "未通过";
                    } else {
                        opt = "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                            "<button class='btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye' aria-hidden='true'></i>详情</button>";
                    }

                    if (data[i].group_manager_name == null) {
                        group_manager_name = "--";
                    } else {
                        group_manager_name = data[i].group_manager_name;
                    }

                    if (data[i].send_address == "1") {
                        send_address = "开启";
                    } else {
                        send_address = "关闭";
                    }
                    if (data[i].bind_account_notice == "1") {
                        bind_account_notice = "开启";
                    } else {
                        bind_account_notice = "关闭";
                    }
                    if (data[i].is_welcome == "1") {
                        is_welcome = "开启";
                    } else {
                        is_welcome = "关闭";
                    }

                    tr += "<tr>" +
                        "<td class='id none'>" + data[i].id + "</td>" +
                        "<td class='name'>" + data[i].name + "</td>" +
                        "<td class='group_type_name'>" + data[i].group_type_name + "</td>" +
                        "<td>" + data[i].del + "</td>" +
                        "<td>" + data[i].flirt + "</td>" +
                        "<td>" + send_address + "</td>" +
                        "<td>" + bind_account_notice + "</td>" +
                        "<td>" + is_welcome + "</td>" +
                        "<td class='none is_del'>" + data[i].is_del + "</td>" +
                        "<td class='none is_flirt'>" + data[i].is_flirt + "</td>" +
                        "<td class='none send_address'>" + data[i].send_address + "</td>" +
                        "<td class='none bind_account_notice'>" + data[i].bind_account_notice + "</td>" +
                        "<td class='none is_welcome'>" + data[i].is_welcome + "</td>" +
                        "<td class='none welcome'>" + data[i].welcome + "</td>" +
                        "<td class='opt'>" + opt + "</td>" +
                        "</tr>";
                });
                $("#groupListTable").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });
    }

    GetGroupListFun();


    //编辑对应的群主-弹出编辑框
    var group_id = "";
    $(document).on("click", ".editBtn", function () {
        group_id = $(this).parents("tr").find(".id").text();//获取群id
        var group_name = $(this).parents("tr").find(".name").text();//获取群名称
        var is_del = $(this).parents("tr").find(".is_del").text();//获取是否运行状态
        var is_flirt = $(this).parents("tr").find(".is_flirt").text();//获取是否开启调戏功能
        var send_address = $(this).parents("tr").find(".send_address").text();//获取是否开启早八晚十推送
        var bind_account_notice = $(this).parents("tr").find(".bind_account_notice").text();//获取是否开启未绑定ccvt通知
        var is_welcome = $(this).parents("tr").find(".is_welcome").text();//获取是否开启新人入群通知
        var welcome = $(this).parents("tr").find(".welcome").text();//获取欢迎语
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

        $("#groupName").val(group_name);
        $("#editGroupModal").modal("show");
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

    //提交编辑
    $(".editSubBtn").click(function () {
        var group_name = $("#groupName").val();
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
                $("#editGroupModal").modal("hide");
                GetGroupListFun();
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //进入详情查看
    $(document).on("click", ".infoBtn", function () {
        var group_id = $(this).parents("tr").find(".id").text();
        var group_name = $(this).parents("tr").find(".name").text();
        window.location.href = "domain.html?group_id=" + group_id + "&group_name=" + encodeURI(encodeURI(group_name));
    })
});