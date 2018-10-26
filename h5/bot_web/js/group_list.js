$(function () {
    var token = GetCookie("robot_token");

    // function GetGroupListFun() {
        $("#groupMasterListTable").DataTable({
            "ajax": "http://ccvt_test.fnying.com/api/bot_web/group_list.php?token=" + encodeURIComponent(token),
            "columns": [
                {"data": "id", "class": "id"},
                {"data": "name", "class": "name"},
                {"data": "del", "class": "del"},
                {"data": "is_del", "class": "is_del none"},
                {"data": "flirt", "class": "flirt"},
                {"data": "is_flirt", "class": "is_flirt none"},
            ]
        });
        setTimeout(function () {
            var td = "<td>" +
                "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                "<button class='btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye' aria-hidden='true'></i>详情</button>" +
                "</td>";
            $(".odd,.even").append(td);
        }, 500);
        // GetGroupList(token, function (response) {
        //     if (response.errcode == "0") {
        //         var data = response.rows, tr = "";
        //         $.each(data, function (i, val) {
        //             tr += "<tr class='text-center trItem'>" +
        //                 "<td class='groupName' name=" + data[i].id + ">" + data[i].name + "</td>" +
        //                 "<td class='is_del' name=" + data[i].is_del + ">" + data[i].del + "</td>" +
        //                 "<td class='is_flirt' name=" + data[i].is_flirt + ">" + data[i].flirt + "</td>" +
        //                 "<td>" +
        //                 "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
        //                 "<button class='btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye' aria-hidden='true'></i>详情</button>" +
        //                 "</td>" +
        //                 "</tr>"
        //         });
        //         $("#groupListTable").html(tr);
        //     }
        // }, function (response) {
        //     layer.msg(response.errmsg);
        // });
    // }
    // GetGroupListFun();

    //编辑对应的群主-弹出编辑框
    var group_id = "";
    $(document).on("click", ".editBtn", function () {
        $(".addSubBtn").addClass("none");
        $(".editSubBtn").removeClass("none");
        group_id = $(this).parents("tr[role='row']").find(".id").text();//获取群id
        var group_name = $(this).parents("tr[role='row']").find(".name").text();//获取群名称
        var is_del = $(this).parents("tr[role='row']").find(".is_del").text();//获取是否运行状态
        var is_flirt = $(this).parents("tr[role='row']").find(".is_flirt").text();//获取是否开启调戏功能
        if (is_del == "1") {
            $("#runSwitch").addClass("active").val("1");
        } else {
            $("#runSwitch").removeClass("active").val("2");
        }
        if (is_flirt == "1") {
            $("#trickSwitch").addClass("active").val("1");
        } else {
            $("#trickSwitch").removeClass("active").val("2");
        }
        $("#groupName").val(group_name);
        $("#editGroupModal").modal("show");
    });

    //监听开关按钮状态
    $("#runSwitch").on("change", function () {
        if ($(this).val() == "1") {
            $(this).removeClass("active").val("2");
        } else {
            $(this).addClass("active").val("1");
        }
    });
    $("#trickSwitch").on("change", function () {
        if ($(this).val() == "1") {
            $(this).removeClass("active").val("2");
        } else {
            $(this).addClass("active").val("1");
        }
    });

    //提交编辑
    $(".editSubBtn").click(function () {
        var del = $("#runSwitch").val();
        var flirt = $("#trickSwitch").val();
        var group_name = $("#groupName").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditGroup(token, group_name, del, flirt, group_id, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                window.location.reload();
                // GetGroupListFun();
                $("#editGroupModal").modal("hide");
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //添加消息
    $(".addGroupBtn").click(function () {
        //更改默认值
        $("#myModalLabel").text("添加群信息");
        $("#groupName").removeAttr("readonly");
        $(".addSubBtn").removeClass("none");
        $(".editSubBtn").addClass("none");
        //初始化添加的内容
        $("#groupName").val("");
        $("#runSwitch,#trickSwitch").addClass("active").val("1");
        //显示添加信息框
        $("#editGroupModal").modal("show");
    });

    //确认提交添加信息
    $(".addSubBtn").click(function () {
        //获取群名称
        var group_name = $("#groupName").val();

        //获取运行状态
        var del = $("#runSwitch").val();

        //获取调戏状态
        var flirt = $("#trickSwitch").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        AddGroup(token, group_name, del, flirt, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                // GetGroupListFun();
                $("#editGroupModal").modal("hide");
                window.location.reload();
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //进入详情查看
    $(document).on("click", ".infoBtn", function () {
        var group_id = $(this).parents("tr[role='row']").find(".id").text();
        window.location.href = "group_member.html?group_id=" + group_id;
    })
});