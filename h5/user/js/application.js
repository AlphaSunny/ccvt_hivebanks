$(function () {
    //token
    var token = GetCookie("user_token");

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
        var group_type_id = $("#group_type optional:selected").val();
        console.log(group_name);
        console.log(group_type_id);
    })
});