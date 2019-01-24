$(function () {
    //token
    let token = GetCookie('user_token');
    let id = getCookie('us_id');
    let url = getRootPath();
    GetUsAccount();

    //Get binding information, whether to bind
    let name = '', idNum = '', idPhoto = '';

    function GetBindInfo() {
        BindingInformation(token, function (response) {
            if (response.errcode == '0') {
                let data = response.rows;
                //count_error==0review 1rejection
                $.each(data, function (i, val) {

                    //bind name
                    if (data[i].bind_name == 'name' && data[i].bind_flag == '1') {//Name binding succeeded
                        name = data[i].bind_name;
                        let info = data[i].bind_info;
                        $(".nameNotBind,.nameUnderReview,.nameBindBtn,#nameBindModal").remove();
                        $(".nameBindInfo").text(info).removeClass("none");
                        $(".nameAlreadyBind").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '0') {//Name review
                        name = data[i].bind_name;
                        let info = data[i].bind_info;
                        $(".nameNotBind,.nameBindBtn,.nameAlreadyBind,#nameBindModal").remove();
                        $(".nameBindInfo").text(info).removeClass("none");
                        $(".nameUnderReview").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '1') {//Name review rejection
                        $(".nameNotBind,.nameUnderReview,.nameAlreadyBind").remove();
                        $(".nameUnderReview").text("认证被拒绝，请重新绑定").removeClass("none");
                        return;
                    }

                    //Bind ID number
                    if (data[i].bind_name == 'idNum' && data[i].bind_flag == '1') {//ID card number binding success
                        idNum = data[i].bind_name;
                        let idNum_info = data[i].bind_info;
                        $(".idCardNotBind,.idCardUnderReview,.idCardBindBtn,#idCardBindModal").remove();
                        $(".idCardBindInfo").text(idNum_info).removeClass("none");
                        $(".idCardAlreadyBind").removeClass("none");
                        return;
                    } else if (data[i].bind_name == 'idNum' && data[i].count_error == '0') {//ID card number review
                        idNum = data[i].bind_name;
                        let idNum_info = data[i].bind_info;
                        $(".idCardNotBind,.idCardBindBtn,.idCardAlreadyBind,#idCardBindModal").remove();
                        $(".idCardBindInfo").text(idNum_info).removeClass("none");
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
                        let idPhotoInfo = data[i].bind_info;
                        $(".idPhotoNotBind,.idPhotoUnderReview,.idPhotoBindBtn,.idPhotoBindInfo,#idPhotoBindModal").remove();
                        $(".idCardBindInfo").removeClass("none");
                        $(".idPhotoAlreadyBind").removeClass("none");
                        let idPhoto1 = idPhotoInfo.split(",")[0];
                        let idPhoto2 = idPhotoInfo.split(",")[1];
                        $(".idPhoto1").attr("src",idPhoto1);
                        $(".idPhoto2").attr("src",idPhoto2);
                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '0') {//Upload ID card review
                        idPhoto = data[i].bind_name;
                        let idPhotoInfo = data[i].bind_info;
                        $(".idPhotoNotBind,.idPhotoBindBtn,.idPhotoAlreadyBind,#idPhotoBindModal").remove();
                        $(".idPhotoUnderReview,.idPhotoBindInfo").removeClass("none");
                        let idPhoto1 = idPhotoInfo.split(",")[0];
                        let idPhoto2 = idPhotoInfo.split(",")[1];
                        $(".idPhoto1").attr("src",idPhoto1);
                        $(".idPhoto2").attr("src",idPhoto2);
                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '1') {//Upload ID card review rejection
                        $(".idPhotoNotBind,.idPhotoBindInfo,.idPhotoAlreadyBind").remove();
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

    //look img
    $(".idPhotoBindInfo").click(function () {
        $("#idPhotoImg_modal").removeClass("none");
    });

    //show bind name
    $('.nameBindBtn').click(function () {
        $('#nameBindModal').modal('show');
    });
    //bind name
    $('.nameBindEnable').click(function () {
        let text_type = '3',
            text = $('#nameBindInput').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            // LayerFun('pleaseEnterName');
            WarnPrompt("请输入姓名");
            return;
        }
        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
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
        let text_type = '2',
            text = $('#idCardBindInput').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            // LayerFun('pleaseEnterIdNumber');
            WarnPrompt("请输入身份证号码");
            return;
        }
        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#idCardBindInput').val(' ');
                // LayerFun('submitSuccess');
                SuccessPrompt("提交成功");
                $('#idCardBindModal').modal("hide");
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            // ErrorPrompt(response.errmsg);
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
        }

        // $('.idPhotoFormBox').fadeToggle('fast');
        $('.uploadImgBox').removeClass("none");
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

    /** Upload picture - front
     *Get the selection file
     * ID card upload verification
     */
    let src1 = '', src2 = '';
    $('#file0').on('change', function () {
        ShowLoading("show");
        let objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idPositive").attr("src", objUrl);
            ShowLoading("hide");
        }

        let formData = new FormData($("#form0")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        src1 = UpLoadImg(formData);
    });
    //Upload back
    $('#file1').on('change', function () {
        let objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idNegative").attr("src", objUrl);
        }
        let formData = new FormData($("#form1")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        src2 = UpLoadImg(formData);
    });

    // ID card upload verification
    $('#submit').click(function () {
        let file_type = 'idPhoto',
            file_url = src1 + ',' + src2;
        //bind file
        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
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
