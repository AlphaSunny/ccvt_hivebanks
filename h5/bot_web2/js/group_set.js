$(function () {
    $(".edit_group_name").click(function () {
        $(".input_box").removeClass("none");
    });

    //确认编辑群名称
    $(".confirm_edit_group_name_btn").click(function () {
        var group_name = $(".group_name_input").val();
        if (group_name.length <= 0) {
            WarnPrompt("请输入群名称");
            return;
        }
    });

    var group_name = "", del = "", flirt = "", group_id = "", send_address = "", bind_account_notice = "",
        is_welcome = "", welcome = "";

    function EditGroupFun() {
        EditGroup(token, group_name, del, flirt, group_id, send_address, bind_account_notice, is_welcome, welcome, function (response) {
            if (response.errcode == "0") {
                layer.close(loading);
                layer.msg("提交成功", {icon: 1});
                SetCookie("is_admin_del", is_admin_del);
                SetCookie("is_del", del);
                SetCookie("is_flirt", flirt);
                SetCookie("send_address", send_address);
                SetCookie("bind_account_notice", bind_account_notice);
                SetCookie("is_welcome", is_welcome);
                SetCookie("welcome", welcome);
                SetCookie("group_name", group_name);
                $(".group_name").text(group_name);
                $("#group_name").val(group_name);
                GetGroupListNav();
            }
        }, function (response) {
            layer.close(loading);
            $("#editGroupModal").modal("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    //监听开关按钮状态
    $(".switch").on("change", function () {
        var id = $(this).attr("id");
        SwitchChangeFun(id);
    });

    function SwitchChangeFun(id) {
        if ($("#" + id).val() == "1") {
            $("#" + id).removeClass("active").val("2");
            if (id == "welcomeSwitch") {
                $(".welcome_text_box").removeClass("none");
            }
        } else {
            $("#" + id).addClass("active").val("1");
            if (id == "welcomeSwitch") {
                $(".welcome_text_box").addClass("none");
            }
        }
    }

    function SwitchChangeVal(id, num) {
        switch (id) {
            case del:
                del = num;
                break;
            case flirt:
                flirt = num;
                break;
            case send_address:
                send_address = num;
                break;
            case bind_account_notice:
                bind_account_notice = num;
                break;
            case is_welcome:
                is_welcome = num;
                break;
        }
    }
});