$(function () {
    $(".edit_group_name").click(function () {
        $(".input_box").removeClass("none");
    });

    $(".cancel_edit_group_name_btn").click(function () {
        $(".input_box").addClass("none");
    });

    $(".cancel_edit_welcome_text").click(function () {
        $(".welcome_text_box").addClass("none");
    });

    var group_name = "", del = "", flirt = "", send_address = "", bind_account_notice = "",
        is_welcome = "", welcome = "";
    var group_id = GetCookie("group_id");
    function EditGroupFun() {
        EditGroup(token, group_name, del, flirt, group_id, send_address, bind_account_notice, is_welcome, welcome, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("设置成功");
                GetGroupListNav();
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    }

    //编辑群名称
    $(".confirm_edit_group_name_btn").click(function () {
        if ($(".group_name_input").val().length <= 0) {
            WarnPrompt("请输入群名称");
            return;
        }
        GetVal();
    });

    //编辑欢迎语
    $(".confirm_edit_welcome_text").click(function () {
        if ($("#welcome_text").val().length <= 0) {
            WarnPrompt("请输入欢迎语");
            return;
        }
        GetVal();
    });

    //获取参数
    function GetVal() {
        group_name = $(".group_name_input").val();
        del = $(".is_admin_del").val();
        flirt = $(".is_flirt").val();
        send_address = $(".send_address").val();
        bind_account_notice = $(".bind_account_notice").val();
        is_welcome = $(".is_welcome").val();
        is_welcome = $(".is_welcome").val();
        welcome = $(".welcome").val();
        EditGroupFun();
    }

    //开关监听
    $(".switch").on("change", function () {
        var id = $(this).attr("id");
        SwitchChangeFun(id);
    });

    function SwitchChangeFun(id) {
        if ($("#" + id).val() == "1") {
            $("#" + id).removeClass("active").val("2");
            if (id == "welcomeSwitch") {
                $(".welcome_text_box").addClass("none");
                return;
            }
            GetVal();
        } else {
            $("#" + id).addClass("active").val("1");
            if (id == "welcomeSwitch") {
                $(".welcome_text_box").removeClass("none");
                return;
            }
            GetVal();
        }
    }
});