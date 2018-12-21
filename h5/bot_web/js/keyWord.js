$(function () {
    var token = GetCookie('robot_token');

    //获取关键字列表
    var limit = 10, offset = 0;

    function GetKeyWordListFun(limit, offset) {
        var tr = "";
        GetKeyWordList(token, limit, offset, function (response) {
            if (response.errcode == '0') {
                console.log(response);
                var data = response.rows;
                if (data.length <= 0) {
                    tr = "<tr><td colspan='4'>暂无数据</td></tr>";
                    return;
                }
                $.each(data, function (i, val) {
                    console.log(val);
                })
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
    })
});