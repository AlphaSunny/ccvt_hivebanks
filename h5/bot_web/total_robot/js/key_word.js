$(function () {
    var token = GetCookie('total_robot_token');

    //获取关键字列表
    var limit = 10, offset = 0;

    function GetKeyWordListFun(limit, offset) {
        var tr = "", totalPage = "", count = "", answer = "";
        GetKeyWordList(token, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>";
                    return;
                }

                totalPage = Math.floor(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    if (data[i].send_type == "1") {
                        answer = "<span>" + data[i].answer + "</span>";
                    } else {
                        answer = "<div class='answer_img_box' style='width: 10rem'><img src='" + data[i].answer + "'/></div>";
                    }
                    tr += "<tr>" +
                        "<td class='ask' name=" + data[i].id + ">" + data[i].ask + "</td>" +
                        "<td class='answer'>" + answer + "</td>" +
                        "<td class='ctime'>" + data[i].ctime + "</span></td>" +
                        "<td class='send_type none'>" + data[i].send_type + "</td>" +
                        "<td class='id none'>" + data[i].id + "</td>" +
                        "<td>" +
                        "<button class='btn-success btn-sm editBtn'><i class='fa fa-pencil' aria-hidden='true'></i>编辑</button>" +
                        "<button class='btn-sm btn-danger delBtn margin-left-5'><i class='fa fa-trash' aria-hidden='true'></i>删除</button>" +
                        "</td>" +
                        "</tr>"
                });
                $("#keyWord").html(tr);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetKeyWordListFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }

        }, function (response) {
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 2});
        })
    }

    GetKeyWordListFun(limit, offset);

    //添加-显示弹框
    $(".add_key_word_btn").click(function () {
        $("#myModalLabel").text("添加AI关键字");
        $(".addSubBtn").removeClass("none");
        $(".editSubBtn").addClass("none");
        // var is_audit = "2";
        // GetGroupListFun(is_audit);
        $("#keyWordModal").modal("show");
    });

    //获取群列表
    // function GetGroupListFun(is_audit) {
    //     GetGroupList(token, is_audit, function (response) {
    //         if (response.errcode == "0") {
    //             var data = response.rows, option = "";
    //             $.each(data, function (i, val) {
    //                 option += "<option class='groupItem' value=" + data[i].id + ">" + data[i].name + "</option>"
    //             });
    //             $("#selectGroupName").html(option);
    //         }
    //     }, function (response) {
    //         layer.msg(response.errmsg, {icon: 2});
    //     });
    // }

    //选择文本或者图片
    var send_type = 1;
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
                ShowLoading("hide");
                var data = JSON.parse(response);
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
    var src = "";
    $("#file").on("change", function () {
        var formData = new FormData($("#upload_image")[0]);
        var objUrl = getObjectURL(this.files[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        var _this_size = this.files[0].size;
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

    //添加关键字
    $(".addSubBtn").click(function () {
        var ask = $("#key_word").val();
        var answer = "";
        //文本内容判断
        if (send_type == 1) {
            answer = $("#key_word_content").val();
            if (answer.length <= 0) {
                layer.msg("请输入内容", {icon: 0});
                return;
            }
        }

        //图片内容判断
        if (send_type == 2) {
            answer = src;
            if (!src) {
                layer.msg("请选择图片", {icon: 0});
                return;
            }
        }
        ShowLoading("show");
        AddKeyWord(token, ask, answer, send_type, function (response) {
            if (response.errcode == "0") {
                layer.msg("添加成功", {icon: 1});
                $("#keyWordModal").modal("hide");
                ShowLoading("hide");
                GetKeyWordListFun(limit, offset);
            }
        }, function (response) {
            $("#keyWordModal").modal("hide");
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 0});
        })
    });

    // 编辑-
    var key_id = "";
    $(document).on("click", ".editBtn", function () {
        var ask = $(this).parents("tr").find(".ask").text();
        var answer = $(this).parents("tr").find(".answer").text();
        send_type = $(this).parents("tr").find(".send_type").text();
        key_id = $(this).parents("tr").find(".id").text();
        $("#myModalLabel").text("编辑AI关键字");
        $(".editSubBtn").removeClass("none");
        $(".addSubBtn").addClass("none");
        $("#key_word").val(ask);

        if (send_type == 1) {//文本
            $("#text").prop("checked", true);
            $(this).attr("checked", true);
            $("#image").attr("checked", false);
            $(".content_image").fadeOut(300);
            $(".upload_img_box").fadeOut(300);
            $(".content_text").fadeIn(300);
            $("#key_word_content").text(answer);
        } else {//图片
            $("#image").prop("checked", true);
            $(this).attr("checked", true);
            $("#text").attr("checked", false);
            $(".content_text").fadeOut(300);
            $(".content_image").fadeIn(300);
            $(".upload_img_box").fadeIn(300);
            $("#upload_img").attr("src", answer);
        }
        $("#keyWordModal").modal("show");
    });

    //确认编辑
    $(".editSubBtn").click(function () {
        var ask = $("#key_word").val();
        var answer = "";
        //文本内容判断
        if (send_type == 1) {
            answer = $("#key_word_content").val();
            if (answer.length <= 0) {
                layer.msg("请输入内容", {icon: 0});
                return;
            }
        }

        //图片内容判断
        if (send_type == 2) {
            answer = src;
            if (!src) {
                layer.msg("请选择图片", {icon: 0});
                return;
            }
        }
        ShowLoading("show");
        EditKeyWord(token, ask, answer, send_type, key_id, function (response) {
            if (response.errcode == "0") {
                layer.msg("修改成功", {icon: 1});
                $("#keyWordModal").modal("hide");
                ShowLoading("hide");
                GetKeyWordListFun(limit, offset);
            }
        }, function (response) {
            $("#keyWordModal").modal("hide");
            ShowLoading("hide");
            layer.msg(response.errmsg, {icon: 0});
        })
    });

    //删除关键词
    $(document).on("click", ".delBtn", function () {
        var key_id = $(this).parents("tr").find(".id").text();
        layer.confirm('确定删除？', {
            title: "重要提示",
            btn: ['确定', '取消'] //按钮
        }, function () {
            DelKeyWordFun(key_id);
        }, function () {
        });
    });

    //确认删除关键词
    function DelKeyWordFun(key_id) {
        DelKeyWord(token, key_id, function (response) {
            if (response.errcode == "0") {
                layer.msg("删除成功", {icon: 1});
                GetKeyWordListFun(limit, offset);
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2})
        })
    }
});