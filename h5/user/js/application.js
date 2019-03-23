$(function () {
    //token
    let token = GetCookie("user_token");

    let group_name = decodeURI(GetQueryString("group_name"));
    if (group_name != "null") {
        $("#group_name").val(group_name);
        $(".applicationGroup").attr("name", "modifyGroup");
        $(".bind_group_btn").attr("name", "modify");
        execI18n();
    }

    GetGroupType(token, function (response) {
        if (response.errcode == "0") {
            let data = response.rows;
            let option = "<option value=''>选择群类型</option>";
            $.each(data, function (i, val) {
                option += "<option value='" + data[i].id + "'>" + data[i].name + "</option>"
            });
            $("#group_type").html(option);
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //Return images information
    function UpLoadImg(formData) {
        ShowLoading("show");
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
                ShowLoading("hide");
            },
            error: function (response) {
                ErrorPrompt(response.errmsg);
            }
        });
        return src;
    }

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

    //upload img
    let src = "";
    $('#uploadFileInput').on('change', function () {
        let objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $(".group_qr_img").attr("src", objUrl);
        }

        let formData = new FormData($("#form0")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        src = UpLoadImg(formData);
    });

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

    //bind group
    $(".bind_group_btn").click(function () {
        let group_name = $("#group_name").val();
        let group_type_id = $("#group_type option:selected").val();
        let group_introduction = $("#group_introduction").val();
        if (group_name.length <= 0) {
            WarnPrompt("请输入群名称");
            return;
        }
        if (!group_type_id) {
            WarnPrompt("请选择群类型");
            return;
        }

        if (group_introduction.length <= 0) {
            WarnPrompt("请输入群介绍");
            return;
        }

        if (!src) {
            WarnPrompt("请上传群二维码");
            return;
        }

        ApplicationGroup(token, group_name, group_type_id, group_introduction, src, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("申请成功");
                window.location.href = getRootPath() + "/bot_web2/home.html?scan=1";
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    })
});