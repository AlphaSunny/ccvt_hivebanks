$(function () {
    var token = GetCookie('robot_token');

    //获取关键字列表
    var limit = 10, offset = 0;

    function GetKeyWordListFun(limit, offset) {
        var tr = "", totalPage = "", count = "";
        GetKeyWordList(token, limit, offset, function (response) {
            if (response.errcode == '0') {
                console.log(response);
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
                    console.log(val);
                });

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetGroupMemberFun(token, limit, (current - 1) * limit, status);
                        loading = layer.load(1, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                        });
                    }
                });
            }

        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        })
    }

    GetKeyWordListFun(limit, offset);

    //添加-显示弹框
    $(".add_key_word_btn").click(function () {
        $("#myModalLabel").text("添加AI关键字");
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
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
        $("#keyWordModal").modal("show");
    });

    // 编辑-
    $(".edit_key_word_btn").click(function () {
        var key_word = $(this).parents("tr").find(".key_word").text();
        var key_word_content = $(this).parents("tr").find(".key_word_content").text();
        $("#myModalLabel").text("编辑AI关键字");
        $("#key_word").val(key_word);
        $("#key_word_content").val(key_word_content);
        $("#keyWordModal").modal("show");
    });

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
        var group_id = $("#selectGroupName").val();
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
        AddKeyWord(token, ask, answer, send_type, group_id, function (response) {
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
});