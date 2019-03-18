$(function () {
    var token = GetCookie("total_robot_token");

    //获取群列表
    var is_audit = "";

    function GetGroupListFun() {
        var tr = "", opt = "", group_manager_name = "";
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>";
                } else {
                    $.each(data, function (i, val) {
                        if (data[i].is_audit == 1) {
                            opt = "<button class='btn btn-primary btn-sm ok_Btn review_btn'><i class='fa fa-check'></i>通过</button>" +
                                "<button class='btn btn-sm btn-danger refuse_Btn review_btn margin-left-5'><i class='fa fa-times'></i>拒绝</button>";
                        } else if (data[i].is_audit == 3) {
                            opt = "<button class='btn btn-success btn-sm review_btn ref_ok_Btn'><i class='fa fa-check'></i>重新通过</button>";
                        } else {
                            opt = "<button class='btn btn-success btn-sm editBtn'><i class='fa fa-pencil'></i>编辑</button>" +
                                "<button class='btn btn-sm btn-info infoBtn margin-left-5'><i class='fa fa-eye'></i>详情</button>"
                        }
                        if (data[i].group_manager_name == null) {
                            group_manager_name = "--";
                        } else {
                            group_manager_name = data[i].group_manager_name;
                        }

                        tr += "<tr>" +
                            "<td class='id none'>" + data[i].id + "</td>" +
                            "<td class='name'><span>" + data[i].name + "</span><svg class='icon'><use xlink:href='#icon-v" + data[i].scale + "'></use></svg>" +
                            "</td>" +
                            "<td class='del'>" + data[i].del + "</td>" +
                            "<td class='is_admin_del none'>" + data[i].is_admin_del + "</td>" +
                            "<td class='audit'>" + data[i].audit + "</td>" +
                            "<td class='opt'>" + opt + "</td>" +
                            "</tr>"
                    });
                }
                $("#groupListTable").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        })
    }

    GetGroupListFun();

    //审核群列表
    var review_group_id = "", refuse_group_id = "";
    $(document).on("click", ".review_btn", function () {
        var is_audit = "", why = "";
        if ($(this).hasClass("ok_Btn") || $(this).hasClass("ref_ok_Btn")) {
            is_audit = "2";
            review_group_id = $(this).parents("tr").find(".id").text();//获取群id
            ShowLoading("show");
            ReviewGroupFun(review_group_id, is_audit, why);
        }
        if ($(this).hasClass("refuse_Btn")) {
            $("#reviewModal").modal("show");
            refuse_group_id = $(this).parents("tr").find(".id").text();//获取群id
        }
        if ($(this).hasClass("now")) {
            is_audit = "3";
            review_group_id = refuse_group_id;
            why = $(".review_text").text();
            $("#reviewModal").modal("hide");
            ShowLoading("show");
            ReviewGroupFun(review_group_id, is_audit, why);
        }
    });

    function ReviewGroupFun(group_id, is_audit, why) {
        ReviewGroup(token, review_group_id, is_audit, why, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                GetGroupListFun();
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
        group_id = $(this).parents("tr").find(".id").text();//获取群id
        window.location.href = "group_set.html?group_id=" + group_id;
        // $(".addSubBtn").addClass("none");
        // $(".editSubBtn").removeClass("none");
        // group_id = $(this).parents("tr").find(".id").text();//获取群id
        // var group_name = $(this).parents("tr").find(".name").text();//获取群名称
        // var group_manager_name = $(this).parents("tr").find(".group_manager_name").text();//获取群主
        // var is_admin_del = $(this).parents("tr").find(".is_admin_del").text();//获取是否运行状态
        // if (is_admin_del == "1") {
        //     $("#runSwitch").addClass("active").val("1");
        // } else {
        //     $("#runSwitch").removeClass("active").val("2");
        // }
        //
        // if (group_manager_name == "--") {
        //     $("#group_manager_name").val("");
        // } else {
        //     $("#group_manager_name").val(group_manager_name);
        // }
        // $("#groupName").val(group_name);
        // $("#editGroupModal").modal("show");
        // $("#groupName").val(group_name);
        // $("#editGroupModal").modal("show");
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
        var group_manager_name = $("#group_manager_name").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditGroup(token, group_name, admin_del, group_manager_name, group_id, function (response) {
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

    //进入详情查看
    $(document).on("click", ".infoBtn", function () {
        var group_id = $(this).parents("tr").find(".id").text();
        var group_name = $(this).parents("tr").find(".name").text();
        window.location.href = "group_member.html?group_id=" + group_id + "&group_name=" + encodeURI(encodeURI(group_name));
    })
});