$(function () {
    var token = GetCookie("total_robot_token");

    // function GetGroupListFun() {
    // var url = getRootPath();
    // var table = $("#groupMasterListTable").DataTable({
    //     "ajax": url + "/api/bot_web/admin/group_list.php?token=" + encodeURIComponent(token),
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

    //获取群列表
    var is_audit = "";

    function GetGroupListFun() {
        var tr = "", opt = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    if (data[i].is_audit == 1) {
                        console.log("1");
                        opt = "<button class='btn btn-primary btn-sm ok_Btn review_btn'><i class='fa fa-check'></i>通过</button>" +
                            "<button class='btn btn-sm btn-danger refuse_Btn review_btn margin-left-5'><i class='fa fa-times'></i>拒绝</button>";
                    } else if (data[i].is_audit == 3) {
                        console.log("3");
                        opt = "<button class='btn btn-success btn-sm ref_ok_Btn'><i class='fa fa-check'></i>重新通过</button>";
                    } else {
                        console.log("2");
                        opt = "<button class='btn btn-success btn-sm editBtn'><i class='fa fa-pencil'></i>编辑</button>" +
                            "<button class='btn btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye'></i>详情</button>"
                    }
                    tr += "<tr>" +
                        "<td class='id none'>" + data[i].id + "</td>" +
                        "<td class='name'>" + data[i].name + " " + data[i].scale + "</td>" +
                        "<td class='del'>" + data[i].del + "</td>" +
                        "<td class='is_admin_del none'>" + data[i].is_admin_del + "</td>" +
                        "<td class='audit'>" + data[i].audit + "</td>" +
                        "<td class='opt'>" + opt + "</td>" +
                        "</tr>"
                });
                $("#groupListTable").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetGroupListFun();

    //审核群列表
    var review_is_audit = "", review_group_id = "", why = "";
    $(".review_btn").click(function () {
        review_group_id = $(this).parents("tr").find(".id").text();//获取群id
        if ($(this).hasClass("ok_Btn")) {
            review_is_audit = "2";
            ShowLoading("show");
            ReviewGroupFun();
        }
        if ($(this).hasClass("refuse_Btn")) {
            $("#reviewModal").modal("show");
        }
        if ($(this).hasClass("now")) {
            review_is_audit = "3";
            why = $(".review_text").text();
            $("#reviewModal").modal("hide");
            ShowLoading("show");
            ReviewGroupFun();
        }
    });

    function ReviewGroupFun() {
        ReviewGroup(token, review_group_id, review_is_audit, why, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                layer.msg("处理成功", {icon: 1});
            }
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    }


    //编辑对应的群主-弹出编辑框
    var group_id = "";
    $(document).on("click", ".editBtn", function () {
        $(".addSubBtn").addClass("none");
        $(".editSubBtn").removeClass("none");
        group_id = $(this).parents("tr").find(".id").text();//获取群id
        var group_name = $(this).parents("tr").find(".name").text();//获取群名称
        var is_admin_del = $(this).parents("tr").find(".is_admin_del").text();//获取是否运行状态
        if (is_admin_del == "1") {
            $("#runSwitch").addClass("active").val("1");
        } else {
            $("#runSwitch").removeClass("active").val("2");
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

    //提交编辑
    $(".editSubBtn").click(function () {
        var admin_del = $("#runSwitch").val();
        var group_name = $("#groupName").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditGroup(token, group_name, admin_del, group_id, function (response) {
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
    // $(document).on("click", ".infoBtn", function () {
    //     var group_id = $(this).parents("tr[role='row']").find(".id").text();
    //     window.location.href = "group_member.html?group_id=" + group_id;
    // })
});