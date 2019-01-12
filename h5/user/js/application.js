$(function () {
    //token
    var token = GetCookie("user_token");

    var group_name = decodeURI(GetQueryString("group_name"));
    console.log(group_name);
    if (group_name) {
        $("#group_name").val(group_name);
        $(".applicationGroup").attr("name", "modifyGroup");
        $(".bind_group_btn").attr("name", "modify");
        execI18n();
    }

    GetGroupType(token, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            var option = "<option value=''>选择群类型</option>";
            $.each(data, function (i, val) {
                option += "<option value='" + data[i].id + "'>" + data[i].name + "</option>"
            });
            $("#group_type").html(option);
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //bind group
    $(".bind_group_btn").click(function () {
        var group_name = $("#group_name").val();
        var group_type_id = $("#group_type option:selected").val();
        if (group_name.length <= 0) {
            WarnPrompt("请输入群名称");
            return;
        }
        if (!group_type_id) {
            WarnPrompt("请选择群类型");
            return;
        }

        ApplicationGroup(token, group_name, group_type_id, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("申请成功");
                window.location.href = "account.html";
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    })
});