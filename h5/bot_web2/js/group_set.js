$(function () {
    $(".edit_group_name").click(function () {
        $(".group_name_input").removeClass("none");
    });

    //确认编辑群名称
    $(".confirm_edit_group_name_btn").click(function () {
        var group_name = $(".group_name_input").val();
        if (group_name.length <= 0) {
            WarnPrompt("请输入群名称");
            return;
        }
    })
});