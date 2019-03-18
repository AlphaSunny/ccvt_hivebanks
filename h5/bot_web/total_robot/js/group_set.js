$(function () {
    //编辑群名字
    $(".edit_group_name").click(function () {
        $(".input_box").removeClass("none");
    });

    $(".cancel_edit_group_name_btn").click(function () {
        $(".input_box").addClass("none");
    });

    //监听开关按钮状态
    $("#runSwitch").on("change", function () {
        if ($(this).val() == "1") {
            $(this).removeClass("active").val("2");
        } else {
            $(this).addClass("active").val("1");
        }
    });
});