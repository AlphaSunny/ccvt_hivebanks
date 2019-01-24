$(function () {
    let token = GetCookie("user_token");
    $(".edit_group_name").click(function () {
        $(".input_box").removeClass("none");
    });

    $(".cancel_edit_group_name_btn").click(function () {
        $(".input_box").addClass("none");
    });

    $(".cancel_edit_welcome_text").click(function () {
        $(".welcome_text_box").addClass("none");
    });

    let group_name = "", del = "", flirt = "", send_address = "", bind_account_notice = "",
        is_welcome = "", welcome = "", ranking_change_switch = "", src = "";
    let group_id = GetCookie("group_id");

    function EditGroupFun() {
        EditGroup(token, group_name, del, flirt, group_id, send_address, bind_account_notice, is_welcome, welcome, ranking_change_switch, src, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("设置成功");
                $(".welcome_text_box,.input_box").addClass("none");
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

    //get key_code
    let key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        // LayerFun(response.errcode);
        ErrorPrompt(response.errmsg);
    });

    //Return images information
    function UpLoadImg(formData) {
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
                let data = JSON.parse(response);
                if (data.errcode == '0') {
                    src = data.url;
                }
            },
            error: function (response) {
                ErrorPrompt(response.errmsg);
            }
        });
        return src;
    }

    //修改群二维码
    let _src = "";

    $("#file").on("change", function () {
        let objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $(".qr_code_address").attr("src", objUrl);
        }

        let formData = new FormData($("#form")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        _src = UpLoadImg(formData);
        GetVal(_src);
    });

    //获取参数
    function GetVal(type) {
        group_name = $(".group_name_input").val();
        del = $(".is_admin_del").val();
        flirt = $(".is_flirt").val();
        send_address = $(".send_address").val();
        bind_account_notice = $(".bind_account_notice").val();
        is_welcome = $(".is_welcome").val();
        is_welcome = $(".is_welcome").val();
        welcome = $(".welcome").val();
        ranking_change_switch = $(".ranking_change_switch").val();
        if (type) {
            src = type;
        } else {
            src = $(".qr_code_address").attr("src");
        }
        EditGroupFun();
    }

    //开关监听
    $(".switch").on("change", function () {
        let id = $(this).attr("id");
        SwitchChangeFun(id);
    });

    function SwitchChangeFun(id) {
        if ($("#" + id).val() == "1") {
            $("#" + id).removeClass("active").val("2");
            if (id == "welcomeSwitch") {
                $(".welcome_text_box").addClass("none");
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

    //Display when selecting a picture
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
});