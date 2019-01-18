$(function () {
    //token
    var token = GetCookie('user_token');
    var id = getCookie('us_id');
    var url = getRootPath();
    GetUsAccount();

    //Get binding information, whether to bind
    var name = '', idNum = '', idPhoto = '';

    function GetBindInfo() {
        BindingInformation(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                //count_error==0review 1rejection
                $.each(data, function (i, val) {

                    //bind name
                    if (data[i].bind_name == 'name' && data[i].bind_flag == '1') {//Name binding succeeded
                        name = data[i].bind_info;
                        $(".nameNotBind,.nameUnderReview,.nameBindBtn").remove();
                        $(".nameBindInfo").text(name).removeClass("none");
                        $(".nameAlreadyBind").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '0') {//Name review
                        $(".nameNotBind,.nameBindBtn,.nameBindInfo,.nameAlreadyBind").remove();
                        $(".nameUnderReview").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '1') {//Name review rejection
                        $(".nameNotBind,.nameUnderReview,.nameAlreadyBind").remove();
                        $(".nameUnderReview").text("认证被拒绝，请重新绑定").removeClass("none");
                        return;
                    }

                    //Bind ID number
                    if (data[i].bind_name == 'idNum' && data[i].bind_flag == '1') {//ID card number binding success
                        idNum = data[i].bind_info;
                        $(".idCardNotBind,.idCardUnderReview,.idCardBindBtn").remove();
                        $(".idCardBindInfo").text(idNum).removeClass("none");
                        $(".idCardAlreadyBind").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'idNum' && data[i].count_error == '0') {//ID card number review
                        $(".idCardNotBind,.idCardBindBtn,.idCardBindInfo,.idCardAlreadyBind").remove();
                        $(".idCardUnderReview").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'idNum' && data[i].count_error == '1') {//ID card number review rejection
                        $(".idCardNotBind,.idCardUnderReview,.idCardAlreadyBind").remove();
                        $(".idCardUnderReview").text("认证被拒绝，请重新绑定").removeClass("none");
                        return;
                    }

                    //Upload ID card
                    if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {//Successful ID card upload
                        idPhoto = data[i].bind_name;

                        $(".idPhotoNotBind,.idPhotoUnderReview,.idPhotoBindBtn,.idPhotoBindInfo").remove();
                        $(".idCardBindInfo").removeClass("none");
                        $(".idPhotoAlreadyBind").removeClass("none");

                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '0') {//Upload ID card review
                        $(".idPhotoNotBind,.idPhotoBindBtn,.idPhotoAlreadyBind").remove();
                        $(".idPhotoUnderReview,.idPhotoBindInfo").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '1') {//Upload ID card review rejection
                        $(".idPhotoNotBind,.idPhotoUnderReview,.idPhotoAlreadyBind").remove();
                        $(".idPhotoUnderReview").text("认证被拒绝，请重新绑定").removeClass("none");
                        return;
                    }
                });
            }
        }, function (response) {
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
        });
    }

    GetBindInfo();

    //show bind name
    $('.nameBindBtn').click(function () {
        $('#nameBindModal').modal('show');
    });
    //bind name
    $('.nameBindEnable').click(function () {
        var text_type = '3',
            text = $('#nameBindInput').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            // LayerFun('pleaseEnterName');
            WarnPrompt("请输入姓名");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#nameBindInput').val(' ');
                // LayerFun('submitSuccess');
                SuccessPrompt("提交成功");
                $('#nameBindModal').modal('hide');
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
            $('#nameBindModal').modal('hide');
        })
    });

    //show ID card number binding
    $('.idCardBindBtn').click(function () {
        if (name != 'name') {
            // LayerFun('firstBindName');
            WarnPrompt("请先绑定姓名");
            return;
        }
        $('#idCardBindModal').modal("show");
    });

    //Bind ID number
    $('.idNumBindEnable').click(function () {
        var text_type = '2',
            text = $('#idNum').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            // LayerFun('pleaseEnterIdNumber');
            WarnPrompt("请输入身份证号码");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#idNum').val(' ');
                // LayerFun('submitSuccess');
                SuccessPrompt("提交成功");
                $('#idCardBindModal').modal("hide");
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
            $('#idCardBindModal').modal("hide");
        })
    });


    //show ID upload binding
    $('.idPhotoBindBtn').click(function () {
        if (name != 'name') {
            // LayerFun('firstBindName');
            WarnPrompt("请先绑定姓名");
            return;
        }
        if (idNum != 'idNum') {
            // LayerFun('firstIdNum');
            WarnPrompt("请先绑定身份证号码");
            return;
        };

        $('.idPhotoFormBox').fadeToggle('fast');
    });

    //Return images information
    function UpLoadImg(formData) {
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
                var data = JSON.parse(response);
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

    //get key_code
    var key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        // LayerFun(response.errcode);
        ErrorPrompt(response.errmsg);
    });

    /** Upload picture - front
     *Get the selection file
     * ID card upload verification
     */
    var src1 = '', src2 = '';
    $('#file0').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idPositive").attr("src", objUrl);
        }

        var formData = new FormData($("#form0")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        src1 = UpLoadImg(formData);
    });
    //Upload back
    $('#file1').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idNegative").attr("src", objUrl);
        }
        var formData = new FormData($("#form1")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        src2 = UpLoadImg(formData);
    });

    // ID card upload verification
    $('#submit').click(function () {
        var file_type = 'idPhoto',
            file_url = src1 + ',' + src2;
        //bind file
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        FileBind(token, file_type, file_url, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                // LayerFun('submitSuccess');
                SuccessPrompt("提交成功");
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
        })
    });

    //Display when selecting a picture
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
});
