$(function () {
    var token = GetCookie("robot_token");

    // function GetGroupListFun() {
    // var url = getRootPath();
    // var table = $("#groupMasterListTable").DataTable({
    //     "ajax": url + "/api/bot_web/group_list.php?token=" + encodeURIComponent(token),
    //     destroy: true,
    //     "deferRender": true,
    //     "columns": [
    //         {"data": "id", "class": "id"},
    //         {"data": "name", "class": "name"},
    //         {"data": "del", "class": "del"},
    //         {"data": "is_del", "class": "is_del none"},
    //         {"data": "flirt", "class": "flirt"},
    //         {"data": "is_flirt", "class": "is_flirt none"},
    //     ],
    //     "columnDefs": [{
    //         "targets": 6,
    //         "data": null,
    //         "render": function () {
    //             return "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
    //                 "<button class='btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye' aria-hidden='true'></i>详情</button>"
    //         }
    //     }]
    // });
    // }

    //获取群列表
    function GetGroupListFun() {
        var tr = "", opt = "", is_audit = "", group_manager_name = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    if (data[i].is_audit == "1") {
                        opt = "审核中";
                    } else if (data[i].is_audit == "3") {
                        opt = "未通过";
                    } else {
                        opt = "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                            "<button class='btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye' aria-hidden='true'></i>详情</button>";
                    }

                    if (data[i].group_manager_name == "") {
                        group_manager_name = "点击编辑按钮填写群主";
                    }else {
                        group_manager_name = data[i].group_manager_name;
                    }

                    tr += "<tr>" +
                        "<td class='id'>" + data[i].id + "</td>" +
                        "<td class='name'>" + data[i].name + "</td>" +
                        "<td class='group_manager_name'>group_manager_name</td>" +
                        "<td>" + data[i].del + "</td>" +
                        "<td class='none is_del'>" + data[i].is_del + "</td>" +
                        "<td>" + data[i].flirt + "</td>" +
                        "<td class='none is_flirt'>" + data[i].is_flirt + "</td>" +
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
        // $(".addSubBtn").addClass("none");
        // $(".editSubBtn").removeClass("none");
        group_id = $(this).parents("tr").find(".id").text();//获取群id
        var group_name = $(this).parents("tr").find(".name").text();//获取群名称
        var group_manager_name = $(this).parents("tr").find(".group_manager_name").text();//获取群主
        var is_del = $(this).parents("tr").find(".is_del").text();//获取是否运行状态
        var is_flirt = $(this).parents("tr").find(".is_flirt").text();//获取是否开启调戏功能
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
        EditGroup(token, group_name,group_manager_name, del, flirt, group_id, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                $("#editGroupModal").modal("hide");
                GetGroupListFun();
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //添加消息
    // $(".addGroupBtn").click(function () {
    //     //更改默认值
    //     $("#myModalLabel").text("添加群信息");
    //     $("#groupName").removeAttr("readonly");
    //     $(".addSubBtn").removeClass("none");
    //     $(".editSubBtn").addClass("none");
    //     //初始化添加的内容
    //     $("#groupName").val("");
    //     $("#runSwitch,#trickSwitch").addClass("active").val("1");
    //     //显示添加信息框
    //     $("#editGroupModal").modal("show");
    // });

    //确认提交添加信息
    // $(".addSubBtn").click(function () {
    //     //获取群名称
    //     var group_name = $("#groupName").val();
    //
    //     //获取运行状态
    //     var del = $("#runSwitch").val();
    //
    //     //获取调戏状态
    //     var flirt = $("#trickSwitch").val();
    //     //loading
    //     var loading = layer.load(1, {
    //         shade: [0.1, '#fff'] //0.1透明度的白色背景
    //     });
    //     AddGroup(token, group_name, del, flirt, function (response) {
    //         if (response.errcode == "0") {
    //             layer.close(loading);
    //             $("#editGroupModal").modal("hide");
    //             table.ajax.reload();
    //         }
    //     }, function (response) {
    //         layer.close(loading);
    //         $("#editGroupModal").modal("hide");
    //         layer.msg(response.errmsg);
    //     })
    // });

    //进入详情查看
    $(document).on("click", ".infoBtn", function () {
        var group_id = $(this).parents("tr").find(".id").text();
        var group_name = $(this).parents("tr").find(".name").text();
        window.location.href = "group_member.html?group_id=" + group_id + "&group_name=" + encodeURI(encodeURI(group_name));
    })
});