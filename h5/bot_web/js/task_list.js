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
        $("#editTaskModal").modal("show");
    })
});