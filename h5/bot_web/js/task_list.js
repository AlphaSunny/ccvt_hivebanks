$(function () {
    var token = GetCookie("robot_token");

    var url = getRootPath();
    var table = $("#taskListTable").DataTable({
        "ajax": url + "/api/bot_web/timer_list.php?token=" + encodeURIComponent(token),
        "deferRender": true,
        "columns": [
            {"data": "id", "class": "id"},
            {"data": "time", "class": "time"},
            {"data": "content", "class": "content"},
            {"data": "name", "class": "name"},
        ],
        "columnDefs": [{
            "targets": [4],
            "data": null,
            "render": function () {
                return "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                    "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>"
            }
        }]
    });

    // function GetTaskListFun() {
    //     GetTaskList(token, function (response) {
    //         if (response.errcode == "0") {
    //             var data = response.rows, tr = "";
    //             $.each(data, function (i, val) {
    //                 tr += "<tr class='text-center trItem'>" +
    //                     "<td class='time'>" + data[i].time + "</td>" +
    //                     "<td class='content' name=" + data[i].id + ">" + data[i].content + "</td>" +
    //                     "<td class='name'>" + data[i].name + "</td>" +
    //                     "<td>" +
    //                     "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
    //                     "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>" +
    //                     "</td>" +
    //                     "</tr>";
    //             });
    //             $("#groupListTable").html(tr);
    //         }
    //     }, function (response) {
    //         layer.msg(response.errmsg);
    //     });
    // }
    // GetTaskListFun();

    //确定删除任务
    var timer_id = "";
    $(document).on("click", ".delBtn", function () {
        timer_id = $(this).parents("tr[role='row']").find(".id").text();
        layer.confirm('确定删除该条数据？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            DelTaskFun();
        })
    });

    //删除任务
    function DelTaskFun() {
        DelTask(token, timer_id, function (response) {
            if (response.errcode == "0") {
                layer.msg('删除成功', {icon: 1});
                table.ajax.reload();
            }
        }, function (response) {
            layer.msg('删除失败', {icon: 2});
        })
    }

    //编辑任务
    $(document).on("click", ".editBtn", function () {
        var group_name = $(this).parents("tr[role='row']").find(".name").text();
        var time = $(this).parents("tr[role='row']").find(".time").text();
        var content = $(this).parents("tr[role='row']").find(".content").text();
        var task_id = $(this).parents("tr[role='row']").find(".id").text();
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
        if (time.length <= 0) {
            layer.msg("请输入时间");
            return;
        }
        if (content.length <= 0) {
            layer.msg("请输入内容");
            return;
        }
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditTask(token, timer_id, time, content, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                // GetTaskListFun();
                $("#editTaskModal").modal("hide");
                // window.location.reload();
                table.ajax.reload();
            }
        }, function (response) {
            layer.close(loading);
            $("#editTaskModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });

    //添加信息
    $(".addTaskBtn").click(function () {
        var is_audit = "2";
        GetGroupList(token,is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows, option = "";
                $.each(data, function (i, val) {
                    option += "<option class='groupItem' value=" + data[i].id + ">" + data[i].name + "</option>"
                });
                $("#selectGroupName").html(option);
                $(".addSubBtn").removeClass("none");
                $(".editSubBtn").addClass("none");
                $("#groupName").fadeOut("fast");
                $("#editTaskModal").modal("show");
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
    });

    //选择文本或者图片
    $("input[type='radio']").change(function () {
        if($(this).hasClass("text")){
            console.log("1");
            $(".content_image").fadeOut(300);
        }
        if($(this).hasClass("image")){
            $(".content_text").fadeOut(300);
            console.log("2");
        }
    });

    //选择图片
    $("#upload_image").on("change",function () {
        var formDate = new FormData($("#upload_image")[0]);
        console.log(formDate);
    });

    //确认添加信息
    $(".addSubBtn").click(function () {
        var time = $("#time").val();
        var content = $("#content").val();
        var group_id = $("#selectGroupName").val();
        if (time.length <= 0) {
            layer.msg("请输入时间");
            return;
        }
        if (content.length <= 0) {
            layer.msg("请输入内容");
            return;
        }
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        AddTask(token, time, group_id, content, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                $("#editTaskModal").modal("hide");
                table.ajax.reload();
            }
        }, function (response) {
            layer.close(loading);
            $("#editTaskModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });


});