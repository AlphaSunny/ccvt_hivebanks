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
        GetGroupList(token, is_audit, function (response) {
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
    var send_type = 1;
    $("input[type='radio']").change(function () {
        if ($(this).hasClass("text")) {
            send_type = 1;
            $(this).attr("checked", true);
            $("#image").attr("checked", false);
            $(".content_image").fadeOut(300);
            $(".content_text").fadeIn(300);
        }
        if ($(this).hasClass("image")) {
            send_type = 2;
            $(this).attr("checked", true);
            $("#text").attr("checked", false);
            $(".content_text").fadeOut(300);
            $(".content_image").fadeIn(300);
        }
    });

    //上传文件到服务器
    function UpLoadImg(formData) {
        var src = '';
        $.ajax({
            url: url + '/api/plugin/upload_file.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                if (data.errcode == '0') {
                    src = data.url;
                }
            },
            error: function (response) {
                layer.msg(response.msg);
            }
        });
        return src;
    }

    //get key_code
    var key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //获取本地图片地址并显示
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    //选择图片
    $("#file").on("change", function () {
        var formData = new FormData($("#upload_image")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#upload_img").attr("src", objUrl);
        }
        var _this_size = this.files[0].size;
        if (_this_size > 500000) {
            layer.msg("图片不能大于500KB", {icon: 0});
            return;
        }
        var src = UpLoadImg(formData);
    });

    //选择日期
    var is_checked = 0;
    $("#allday").on("change", function () {
        // $(".checkbox_input:checked").each(function (i, val) {
        //     $(this).prop("checked",!$(this).prop(".checkbox_input"))
        // });
        if (is_checked == 0) {
            $(".checkbox_input").prop("checked", true);
            is_checked = 1;
        } else {
            $(".checkbox_input").prop("checked", false);
            is_checked = 0;
        }
    });


    //确认添加信息
    $(".addSubBtn").click(function () {
        var tx_content = "", tx_content_arr = [];
        var time = $("#time").val();
        var content = $("#content").val();
        var group_id = $("#selectGroupName").val();
        var tx_content_list = $(".checkbox_input:checked");
        $.each(tx_content_list, function (i, val) {
            tx_content_arr.push($(this).val());
        });
        console.log(tx_content_arr);
        return;
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
        AddTask(token, time, group_id, content, send_type, tx_content, function (response) {
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