$(function () {
    //token
    var token = GetCookie("total_robot_token");

    //获取群类型
    function GetGroupTypeAdminFun() {
        var tr = "";
        GetGroupTypeAdmin(token, function (response) {
            if (response.errcode == "0") {
                console.log(response);
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td>暂无数据</td></tr>";
                }
                else {
                    $.each(data, function (i, val) {
                        tr += "<tr>" +
                            "<td class='id' name=" + data[i].id + ">" + data[i].name + "</td>" +
                            "<td>" +
                            "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                            "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>" +
                            "</td>" +
                            "</tr>";
                    })
                }
                $("#groupType").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
    }

    GetGroupTypeAdminFun();

    //添加群
    $(".add_group_type_btn").click(function () {
        var name = $("#groupTypeInput").val();
        ShowLoading("show");
        AddGroupType(token, name, function (response) {
            ShowLoading("hide");
            $("#addGroupType").modal("hide");
            if (response.errcode == "0") {
                layer.msg("添加成功", {icon: 1});
                GetGroupTypeAdminFun();
            }
        }, function (response) {
            ShowLoading("hide");
            $("#addGroupType").modal("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    });

    //删除群
    $(document).on("click", ".delBtn", function () {
        var type_id = $(this).parents("tr").find(".id").attr("name");
        var name = $(this).parents("tr").find(".id").text();
        layer.confirm('群定要删除' + name + "类型?", {
            btn: ['确定', '取消'] //按钮
        }, function () {
            DeleteGroupConfirmFun(type_id);
        }, function () {

        });
    });

    //确定删除
    function DeleteGroupConfirmFun(type_id) {
        ShowLoading("show");
        DeleteGroupType(token, type_id, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                layer.msg("删除成功", {icon: 1});
                GetGroupTypeAdminFun();
            }
        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    }

    //编辑群类型
    var _this_type_id = "", _this_name = "";
    $(document).on("click", ".editBtn", function () {
        _this_type_id = $(this).parents("tr").find(".id").attr("name");
        _this_name = $(this).parents("tr").find(".id").text();
        $("#modifyGroupTypeInput").val(_this_name);
        $("#modifyGroupType").modal("show");
    });

    //群定编辑群类型
    $(".modify_group_type_btn").click(function () {
        var type_id = _this_type_id;
        var name = $("#modifyGroupTypeInput").val();
        ShowLoading("show");
        EditGroupType(token, type_id, name, function (response) {
            ShowLoading("hide");
            $("#modifyGroupType").modal("hide");
            if (response.errcode == "0") {
                GetGroupTypeAdminFun();
                layer.msg("编辑成功", {icon: 1});
            }
        }, function (response) {
            ShowLoading("hide");
            $("#modifyGroupType").modal("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    })
});