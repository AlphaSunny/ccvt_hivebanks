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
                            "<td class='group_id none'>" + data[i].group_id + "</td>" +
                            // "<td class='time'>" + data[i].tx_content + data[i].time + "</td>" +
                            "<td class=''>" + one_arr.join("#") +"</td>" +
                            "<td class='time'>"+ data[i].time + "</td>" +
                            "<td class='content' name=" + data[i].id + ">" + content + "</td>" +
                            "<td class='name'>" + data[i].name + "</td>" +
                            "<td>" +
                            "<span class='none type'>" + data[i].type + "</span><span class='none send_type'>" + data[i].send_type + "</span><span class='none tx_content'>" + data[i].tx_content + "</span>" +
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
    let type = "", tx_content_arr = [];
    $(document).on("click", ".editBtn", function () {
        let group_name = $(this).parents("tr").find(".name").text();
        let time = $(this).parents("tr").find(".time").text();
        let content = $(this).parents("tr").find(".content").text();
        let task_id = $(this).parents("tr").find(".content").attr("name");
        send_type = $(this).parents("tr").find(".send_type").text();
        timer_id = $(this).parents("tr").find(".content").attr("name");
        type = $(this).parents("tr").find(".type").text();
        let tx_content = $(this).parents("tr").find(".tx_content").text();
        let group_id = $(this).parents("tr").find(".group_id").text();

        if (type == 1) {
            $("input[type='checkbox']").prop("checked", true);
        } else {
            tx_content_arr = tx_content.split("-");
            $.each(tx_content_arr, function (i, val) {
                $("#" + tx_content_arr[i]).prop("checked", true);
            });
        }

        if (send_type == 1) {//文本
            $("#text").prop("checked", true);
            $(this).attr("checked", true);
            $("#image").attr("checked", false);
            $(".content_image").fadeOut(300);
            $(".upload_img_box").fadeOut(300);
            $(".content_text").fadeIn(300);
        } else {//图片
            $("#image").prop("checked", true);
            $(this).attr("checked", true);
            $("#text").attr("checked", false);
            $(".content_text").fadeOut(300);
            $(".content_image").fadeIn(300);
            $(".upload_img_box").fadeIn(300);
            $("#upload_img").attr("src", $(this).parents("tr").find(".task_img").attr("src"));
        }

        if(group_id == "-1"){
            $("#checkbox").attr("checked",true);
        }else {
            $("#checkbox").attr("checked",false);
        }

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
        // let timer_id = $("#timer_id").val();
        let content = "", tx_content = "", tx_content_arr = [];
        let time = $("#time").val();
        let tx_content_list = $(".checkbox_input:checked");
        $.each(tx_content_list, function (i, val) {
            tx_content_arr.push($(this).val());
        });
        if (tx_content_arr.length == 1) {
            tx_content = tx_content_arr[0];
        } else {
            tx_content = tx_content_arr.join("-");
        }
        if (tx_content_arr.length <= 6) {
            type = 2;
        } else {
            type = 1;
        }
        if (tx_content_arr.length <= 0) {
            layer.msg("请选择日期", {icon: 0});
            return;
        }

        if (time.length <= 0) {
            layer.msg("请输入时间", {icon: 0});
            return;
        }
        //文本内容判断
        if (send_type == 1) {
            content = $("#content").val();
            if (content.length <= 0) {
                layer.msg("请输入内容", {icon: 0});
                return;
            }
        }

        //图片内容判断
        if (send_type == 2) {
            content = src;
            if (!src) {
                layer.msg("请选择图片", {icon: 0});
                return;
            }
        }
        //loading
        let loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        EditTask(token, timer_id, time, content, send_type, tx_content, type, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                $("#editTaskModal").modal("hide");
                layer.msg("修改成功", {icon: 1});
                GetTaskListFun();
            }
        }, function (response) {
            layer.close(loading);
            $("#editTaskModal").modal("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    });

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
    let group_id = "";
    $(".addSubBtn").click(function () {
        let content = "", tx_content = "", tx_content_arr = [];
        let time = $("#time").val();
        let tx_content_list = $(".checkbox_input:checked");
        if ($("#checkbox").is(':checked')) {
            group_id = "-1";
        } else {
            group_id = $("#selectGroupName").val();
        }
        $.each(tx_content_list, function (i, val) {
            tx_content_arr.push($(this).val());
        });
        if (tx_content_arr.length == 1) {
            tx_content = tx_content_arr[0];
        } else {
            tx_content = tx_content_arr.join("-");
        }

        if (tx_content_arr.length <= 6) {
            type = 2;
        } else {
            type = 1;
        }

        if (tx_content_arr.length <= 0) {
            layer.msg("请选择日期", {icon: 0});
            return;
        }
        if (time.length <= 0) {
            layer.msg("请输入时间", {icon: 0});
            return;
        }

        //文本内容判断
        if (send_type == 1) {
            content = $("#content").val();
            if (content.length <= 0) {
                layer.msg("请输入内容", {icon: 0});
                return;
            }
        }

        //图片内容判断
        if (send_type == 2) {
            content = src;
            if (!src) {
                layer.msg("请选择图片", {icon: 0});
                return;
            }
        }
        //loading
        var loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        AddTask(token, time, group_id, content, send_type, tx_content, type, function (response) {
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