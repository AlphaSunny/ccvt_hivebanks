$(function () {
    var token = GetCookie("robot_token");

    function GetGroupListFun() {
        GetGroupList(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows, tr = "";
                $.each(data, function (i, val) {
                    tr += "<tr class='text-center trItem'>" +
                        "<td class='groupName' name=" + data[i].id + ">" + data[i].name + "</td>" +
                        "<td class='is_del' name=" + data[i].is_del + ">" + data[i].del + "</td>" +
                        "<td class='is_flirt' name=" + data[i].is_flirt + ">" + data[i].flirt + "</td>" +
                        "<td>" +
                        "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                        // "<button class='btn-sm btn-danger delBtn margin-left-5'>详情</button>" +
                        "</td>" +
                        "</tr>"
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
    $(document).on("click", ".editBtn", function (response) {
        GetGroupListFun();
        group_id = $(this).parents(".trItem").find(".groupName").attr("name");
        var group_name = $(this).parents(".trItem").find(".groupName").text();
        console.log(group_name);
        console.log(group_id);
        var is_del = $(this).parents(".trItem").find(".is_del").attr("name");
        var is_flirt = $(this).parents(".trItem").find(".is_flirt").attr("name");
        if (is_del == "1") {
            $("#runSwitch").attr("checked", true).val("1");
        }
        if (is_flirt == "1") {
            $("#trickSwitch").attr("checked", true).val("1");
        }
        $("#groupName").val(group_name);
        $("#editGroupModal").modal("show");
    });

    //监听开关按钮状态
    $("#runSwitch").on("change", function () {
        if ($(this).val() == "1") {
            $(this).val("2");
        } else {
            $(this).val("1");
        }
    });
    $("#trickSwitch").on("change", function () {
        if ($(this).val() == "1") {
            $(this).val("2");
        } else {
            $(this).val("1");
        }
    });

    //提交编辑
    $(".subBtn").click(function () {
        var del = $("#runSwitch").val();
        var flirt = $("#trickSwitch").val();
        var group_name = $("#groupName").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
        EditGroup(token, group_name, del, flirt, group_id, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                GetGroupListFun();
            }
        }, function (response) {
            layer.close(loading);
            layer.msg(response.errmsg);
        })
    })
});