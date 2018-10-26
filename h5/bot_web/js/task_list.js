$(function () {
    var token = GetCookie("robot_token");

    function GetTaskListFun() {
        GetTaskList(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows, tr = "";
                $.each(data, function (i, val) {
                    tr += "<tr class='text-center trItem'>" +
                        "<td class='time'>" + data[i].time + "</td>" +
                        "<td class='content' name=" + data[i].id + ">" + data[i].content + "</td>" +
                        "<td class='name'>" + data[i].name + "</td>" +
                        "<td>" +
                        "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                        "<button class='btn-sm btn-danger delBtn margin-left-5'>删除</button>" +
                        "</td>" +
                        "</tr>";
                });
                $("#groupListTable").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });
    }

    GetTaskListFun();

    //删除任务
    var timer_id = "";
    $(document).on("click", ".delBtn", function () {
        timer_id = $(this).parents(".trItem").find(".content").attr("name");
        layer.confirm('确定删除该条数据？', {
            btn: ['取消', '确认'] //按钮
        })
    });

    //确认删除
    $(document).on("click", ".layui-layer-btn1", function () {
        DelTask(token, timer_id, function (response) {
            if (response.errcode == "0") {
                layer.msg('删除成功', {icon: 1});
                GetTaskListFun();
            }
        }, function (response) {
            layer.msg('删除失败', {icon: 2});
        })
    });

    //编辑任务
    $(document).on("click", ".editBtn", function () {
        var group_name = $(this).parents(".trItem").find(".name").text();
        var time = $(this).parents(".trItem").find(".time").text();
        var content = $(this).parents(".trItem").find(".content").text();
        var task_id = $(this).parents(".trItem").find(".content").attr("name");
        $("#selectGroupName").fadeOut("fast");
        $("#timer_id").val(task_id);
        $("#groupName").val(group_name);
        $("#time").val(time);
        $("#content").val(content);
        $(".addSubBtn").addClass("none");
        $(".editSubBtn").removeClass("none");
        $("#editTaskModal").modal("show");
    });

    //确认编辑
    $(".editSubBtn").click(function () {
        var timer_id = $("#timer_id").val();
        var time = $("#time").val();
        var content = $("#content").val();
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditTask(token, timer_id, time, content, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                GetTaskListFun();
                $("#editTaskModal").modal("hide");
            }
        }, function (response) {
            layer.close(loading);
            $("#editTaskModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //添加信息
    $(".addTaskBtn").click(function () {
        GetGroupList(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows, option = "";
                $.each(data, function (i, val) {
                    option+="<option class='groupItem' value="+ data[i].id +">"+ data[i].name +"</option>"
                });
                $("#selectGroupName").html(option);
            }
        }, function (response) {
            layer.msg(response.errmsg);
        });
        $(".addSubBtn").removeClass("none");
        $(".editSubBtn").addClass("none");
        $("#groupName").fadeOut("fast");
        $("#editTaskModal").modal("show");
    });

    //添加信息选择群主
    $(document).on("click", ".groupItem", function () {
        $(this).attr("checked", true);
        console.log("checked");
    })



});