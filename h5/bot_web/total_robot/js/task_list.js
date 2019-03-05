$(function () {
    var token = GetCookie("total_robot_token");

    // var url = getRootPath();
    // var table = $("#taskListTable").DataTable({
    //     "ajax": url + "/api/bot_web/admin/timer_list.php?token=" + encodeURIComponent(token),
    //     "deferRender": true,
    //     "columns": [
    //         {"data": "id", "class": "id"},
    //         {"data": "time", "class": "time"},
    //         {"data": "content", "class": "content"},
    //         {"data": "name", "class": "name"},
    //     ],
    //     "columnDefs": [{
    //         "targets": [4],
    //         "data": null,
    //         "render": function () {
    //             return "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
    //                 "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>"
    //         }
    //     }]
    // });

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

    //获取定时任务
    function GetTaskListFun() {
        var tr = "", content = "";
        GetTaskList(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;

                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>";
                    $("#taskList").html(tr);
                    return;
                } else {
                    $.each(data, function (i, val) {
                        var one_arr = data[i].tx_content.split("-");
                        if (one_arr.indexOf("sunday") != -1) {
                            one_arr[one_arr.indexOf("sunday")] = "星期日";
                        }
                        if (one_arr.indexOf("monday") != -1) {
                            one_arr[one_arr.indexOf("monday")] = "星期一";
                        }
                        if (one_arr.indexOf("tuesday") != -1) {
                            one_arr[one_arr.indexOf("tuesday")] = "星期二";
                        }
                        if (one_arr.indexOf("wednesday") != -1) {
                            one_arr[one_arr.indexOf("wednesday")] = "星期三";
                        }
                        if (one_arr.indexOf("thursday") != -1) {
                            one_arr[one_arr.indexOf("thursday")] = "星期四";
                        }
                        if (one_arr.indexOf("friday") != -1) {
                            one_arr[one_arr.indexOf("friday")] = "星期五";
                        }
                        if (one_arr.indexOf("saturday") != -1) {
                            one_arr[one_arr.indexOf("saturday")] = "星期六";
                        }

                        if (data[i].send_type == 1) {
                            content = "<span>" + data[i].content + "</span>";
                        } else {
                            content = "<img class='task_img' src='" + data[i].content + "'/>";
                        }
                        tr += "<tr>" +
                            "<td class='id none'>" + data[i].id + "</td>" +
                            // "<td class='time'>" + data[i].tx_content + data[i].time + "</td>" +
                            "<td class='time'>" + one_arr.join("#") + data[i].time + "</td>" +
                            "<td class='content'>" + content + "</td>" +
                            "<td class='name'>" + data[i].name + "</td>" +
                            "<td>" +
                            "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                            "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>" +
                            "</td>" +
                            "</tr>"
                    });
                }
                $("#taskList").html(tr);
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2})
        });
    }

    GetTaskListFun();

    //确定删除任务
    var timer_id = "";
    $(document).on("click", ".delBtn", function () {
        timer_id = $(this).parents("tr").find(".id").text();
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
                GetTaskListFun();
            }
        }, function (response) {
            layer.msg('删除失败', {icon: 2});
        })
    }

    //编辑任务
    // $(document).on("click", ".editBtn", function () {
    //     var group_name = $(this).parents("tr").find(".name").text();
    //     var time = $(this).parents("tr").find(".time").text();
    //     var content = $(this).parents("tr").find(".content").text();
    //     var task_id = $(this).parents("tr").find(".id").text();
    //     $("#selectGroupName").fadeOut("fast");
    //     $("#timer_id").val(task_id);
    //     $("#groupName").val(group_name);
    //     $("#time").val(time);
    //     $("#content").val(content);
    //     $(".addSubBtn").addClass("none");
    //     $(".editSubBtn").removeClass("none");
    //     $("#editTaskModal").modal("show");
    // });
    //
    // //确认编辑
    // $(".editSubBtn").click(function () {
    //     var timer_id = $("#timer_id").val();
    //     var time = $("#time").val();
    //     var content = $("#content").val();
    //     if (time.length <= 0) {
    //         layer.msg("请输入时间");
    //         return;
    //     }
    //     if (content.length <= 0) {
    //         layer.msg("请输入内容");
    //         return;
    //     }
    //     //loading
    //     var loading = layer.load(1, {
    //         shade: [0.1, '#fff'] //0.1透明度的白色背景
    //     });
    //     EditTask(token, timer_id, time, content, function (response) {
    //         if (response.errcode == "0") {
    //             layer.close(loading);
    //             // GetTaskListFun();
    //             $("#editTaskModal").modal("hide");
    //             // window.location.reload();
    //             table.ajax.reload();
    //         }
    //     }, function (response) {
    //         layer.close(loading);
    //         $("#editTaskModal").modal("hide");
    //         layer.msg(response.errmsg);
    //     })
    // });

    //选择所有群
    $("#checkbox").on("change", function () {
        if ($("#checkbox").is(':checked')) {
            $("#selectGroupName").attr("disabled", true);
        } else {
            $("#selectGroupName").attr("disabled", false);
        }
    });

    //添加信息
    $(".addTaskBtn").click(function () {
        let is_audit = "";
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

    //选择日期
    let is_checked = 0;
    $("#allday").on("change", function () {
        if (is_checked == 0) {
            $(".checkbox_input").prop("checked", true);
            is_checked = 1;
        } else {
            $(".checkbox_input").prop("checked", false);
            is_checked = 0;
        }
    });

    //选择文本或者图片
    let send_type = 1;
    $("input[type='radio']").change(function () {
        if ($(this).hasClass("text")) {
            send_type = 1;
            $(this).attr("checked", true);
            $("#image").attr("checked", false);
            $(".content_image").fadeOut(300);
            $(".upload_img_box").fadeOut(300);
            $(".content_text").fadeIn(300);
        }
        if ($(this).hasClass("image")) {
            send_type = 2;
            $(this).attr("checked", true);
            $("#text").attr("checked", false);
            $(".content_text").fadeOut(300);
            $(".content_image").fadeIn(300);
            $(".upload_img_box").fadeIn(300);
        }
    });

    //上传文件到服务器
    function UpLoadImg(formData) {
        ShowLoading("show");
        let src = '';
        $.ajax({
            url: url + '/api/plugin/upload_file.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                ShowLoading("hide");
                let data = JSON.parse(response);
                if (data.errcode == '0') {
                    src = data.url;
                }
            },
            error: function (response) {
                ShowLoading("hide");
                layer.msg(response.msg, {icon: 2});
            }
        });
        return src;
    }

    //get key_code
    let key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //获取本地图片地址并显示
    function getObjectURL(file) {
        let url = null;
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
    let src = "";
    $("#file").on("change", function () {
        let formData = new FormData($("#upload_image")[0]);
        let objUrl = getObjectURL(this.files[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        let _this_size = this.files[0].size;
        if (_this_size > 500000) {
            layer.msg("图片不能大于500KB", {icon: 0});
            return;
        }

        if (objUrl) {
            // show img
            $("#upload_img").attr("src", objUrl);
        }
        src = UpLoadImg(formData);
    });

    // //确认添加信息
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
                GetTaskListFun();
            }
        }, function (response) {
            layer.close(loading);
            $("#editTaskModal").modal("hide");
            layer.msg(response.errmsg);
        })
    });
});