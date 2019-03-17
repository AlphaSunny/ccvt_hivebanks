$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    // token
    let token = GetCookie('user_token');

    $(".disabled_a").attr("disabled", true).css("color", "#9e9e9e");

    // Basic user information
    let base_amount = '', scale = "", is_application_group = "";
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            let data = response.rows;
            let security_level = parseInt(data.security_level);
            SetCookie('us_id', data.us_id);
            SetCookie('us_level', data.us_level);
            SetCookie('us_account', data.us_account);
            SetCookie('wechat', data.wechat);
            base_amount = data.base_amount;
            scale = data.scale;
            $(".us_nm").text(data.us_nm);
            $('.ctime').text(data.ctime);
            $('.us_account').text(data.us_account);
            $('.availableBalance').text(data.base_amount);
            $('.lockBalance').text(data.lock_amount);
            $('.levelNum').text(security_level);
            $('.glory_of_integral').text(data.glory_of_integral);
            $('.scale').text(data.scale);
            SetCookie("glory_level", data.scale);

            if (data.wechat_qrcode) {
                $(".upload_qr_btn").text("查看");
                $("#person_qr_img").attr("src", data.wechat_qrcode);
                $("#upload_qr_fee").val(data.wechat_qrcode_price);
                $(".qr_confirm_btn").removeClass("i18n qr_confirm_btn").addClass("look_qr_btn").text("修改");
            }

            if (parseInt(data.next_scale_poor) > 0) {
                $('.help_icon').attr("data-original-title", "距离下一级还需" + data.next_scale_poor + "荣耀积分");
            } else {
                $('.help_icon').attr("data-original-title", "符合升级条件");
            }

            if (parseInt(scale) < 2) {
                $(".transfer_box").remove();

            }

            // $('.userLevelNum').text(us_level);
            if (parseInt(data.scale) < 1) {
                $(".robot_box").remove();
            }
            if (data.wechat) {
                $(".wechat").text(data.wechat).removeClass("i18n");
                $("#weChatBindBtn").remove();
                $("#weChatModifyBtn").fadeIn("fast");
            } else {
                $("#weChatModifyBtn").remove();
                $("#weChatBindBtn").fadeIn("fast");
            }

            if (data.group_name) {
                $(".group_name").text(data.group_name).removeClass("i18n");
                $("#bind_weChat_group").remove();
                $("#modify_weChat_group").fadeIn("fast");
            } else {
                $("#modify_weChat_group").remove();
                $("#bind_weChat_group").fadeIn("fast");
            }

            if (data.application_group) {
                is_application_group = "1";
                $(".no_application,.application_btn").remove();
                $(".application_group").text(data.application_group);
                $(".modify_application_btn").removeClass("none");
            } else {
                $(".application_group,.modify_application_btn").remove();
            }
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });


    //transferBtn
    $(".transferBtn").click(() => {
        if (base_amount <= 0) {
            $('#noBalanceModal').modal('show');
            return;
        }
        window.location.href = "transfer.html";
    });

    //change username
    $('.modifyNameBtn').click(function () {
        let us_account = $('#nickName').val();
        if (us_account.length <= 0) {
            WarnPrompt("请输入昵称");
            // LayerFun('pleaseEnterNickname');
            return;
        }
        ShowLoading("show");
        ModifyNickName(token, us_account, function (response) {
            if (response.errcode == '0') {
                SuccessPrompt("修改成功");
                $('#modifyName').modal('hide');
                ShowLoading("hide");
                // LayerFun('modifySuccess');
                $('.us_account').text(response.us_account);
                SetCookie('us_account', response.us_account);
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
            // LayerFun('modifyFail');
            // LayerFun(response.errcode);
            return;
        });
    });

    let limit = 10, offset = 0, n = 0, type = '2';

    //Account change record
    let account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        let tr = '', count = 1;
        AllRecord(token, limit, offset, account_change_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('accountChange', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span>' + data[i].credit_balance + '</span></td>' +
                        '<td><span class="i18n" name="' + data[i].tx_type + '">' + data[i].tx_type + '</span></td>' +
                        '</tr>'
                });
                $('.accountChange').html(tr);
                execI18n();

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetAccountChange(token, limit, (current - 1) * limit, account_change_url);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            GetDataFail('accountChange', '5');
        });
    };
    GetAccountChange(token, limit, offset, account_change_url);


    // gloryPoints change code
    let gloryPoints_change_url = "us_integral_change_log.php";

    let limit_glory = 10, offset_glory = 0;

    function GetGloryPointsChange(token, limit_glory, offset_glory, gloryPoints_change_url) {
        let tr = '', count = 1;
        AllRecord(token, limit_glory, offset_glory, gloryPoints_change_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                let total = response.total;
                let totalPage = Math.ceil(total / limit_glory);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data == false) {
                    GetDataEmpty('gloryPointsChange', '3');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><span>' + data[i].utime + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span class="" name="' + data[i].tx_detail + '">' + data[i].tx_detail + '</span></td>' +
                        '</tr>';
                });
                $('#gloryPointsChange').html(tr);
                execI18n();

                $("#pagination_glory").pagination({
                    currentPage: (limit_glory + offset_glory) / limit_glory,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetGloryPointsChange(token, limit_glory, (current - 1) * limit_glory, gloryPoints_change_url);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            GetDataFail('gloryPointsChange', '5');
        });
    };
    GetGloryPointsChange(token, limit_glory, offset_glory, gloryPoints_change_url);

    //invite
    $(".inviteBtn").click(function () {
        ShowLoading("show");
        //设置生成二维码
        let url = getRootPath() + "/h5/user/register.html?invite_code=" + $(".us_nm").text();
        $(".inviteInput").val(url);
        $('#qrcode').qrcode({
            render: "canvas",
            text: url,
            width: 95,
            height: 90
        });
        //设置邀请图片
        let qrImg = new Image();
        qrImg.crossOrigin = "*";
        qrImg.src = "img/2inviteImg.jpg?t=" + Math.random();
        //找到画布
        let canvas = $("#inviteImg")[0];
        let ctx = canvas.getContext("2d");
        //找到二维码
        let qr = $("#qrcode canvas")[0];
        //图片加载完成时
        qrImg.onload = function () {
            ctx.drawImage(qrImg, 0, 0, 533, 800);
            ctx.drawImage(qr, 60, 700,130,130);//dx:x轴坐标 dy:y轴坐标 dw:宽度 dh:高度
            let base64 = canvas.toDataURL("images/png");//转换URL
            $("#base64Img").attr("src", base64);
            $(".inviteImgBox").remove();
            ShowLoading("hide");
        };
    });

    //copy invite address
    $('.copy_invite_address').click(function () {
        new ClipboardJS('.copy_invite_address');
        // layer.msg("copy success")
        SuccessPrompt("复制成功");
    });

    //bind weChat name
    $(".bindWeChatBtn").click(function () {
        let wechat = $("#weChatName").val();
        if (wechat.length <= 0) {
            WarnPrompt("请输入微信昵称");
            // LayerFun("pleaseEnterNickname");
            return;
        }
        ShowLoading("show");
        BindWeChatName(token, wechat, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
                ShowLoading("hide");
                $("#weChatGroupName").modal("hide");
                $(".wechat").text(response.new_wechat).removeClass("i18n");
                $("#weChatBindBtn").remove();
                $("#weChatModifyBtn").fadeIn("fast");
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
            // LayerFun(response.errcode);
        })
    });

    //exchange
    $(".exchange_btn").click(function () {
        $("#exchange_modal").removeClass("none");
    });

    $(".exchange_cancel_btn").click(function () {
        $("#exchange_modal").addClass("none");
        $(".voucher_input").val("");
    });
    $(".transform_ccvt_cancel_btn").click(function () {
        $("#transform_ccvt").addClass("none");
        $(".transform_ccvt_input").val("");
    });

    $(".exchange_confirm_btn").click(function () {
        ShowLoading("show");
        let voucher = $(".voucher_input").val();
        if (voucher.length <= 0) {
            // LayerFun("pleaseInputExchangeCode");
            WarnPrompt("请输入兑换码");
            ShowLoading("hide");
            return
        }
        Exchange(token, voucher, function (response) {
            $(".voucher_input").val("");
            SuccessPrompt("提交成功");
            // LayerFun("submitSuccess");
            $(".availableBalance").text(response.us_amount);
            $("#exchange_modal").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            ErrorPrompt(response.errmsg);
            ShowLoading("hide");
        })
    });

    //transform ccvt
    $(".upgrade_btn").click(function () {
        $("#transform_ccvt").removeClass("none");
    });

    $(".transform_ccvt_confirm_btn").click(function () {
        ShowLoading("show");
        let account = $(".transform_ccvt_input").val();
        if (account.length <= 0) {
            // LayerFun("pleaseInputChangeAmount");
            WarnPrompt("请输入金额数量");
            ShowLoading("hide");
            return
        }
        if (!(/^[1-9]\d*$/.test(account))) {
            WarnPrompt("请输入正确的金额数量");
            ShowLoading("hide");
            return
        }
        TransformCCVT(token, account, function (response) {
            $(".transform_ccvt_input").val("");
            SuccessPrompt("提交成功");
            // LayerFun("submitSuccess");
            $(".availableBalance").text(response.us_amount);
            $(".glory_of_integral").text(response.glory_of_integral);
            GetAccountChange(token, limit, offset, account_change_url);
            $("#transform_ccvt").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            ErrorPrompt(response.errmsg);
            ShowLoading("hide");
        })
    });

    //bind/modify weChat group
    $(".bind_weChat_group,.modify_weChat_group").click(function () {
        let li = "";
        ShowLoading("show");
        WeChatGroupList(token, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                $("#weChatGroup").modal("show");
                $.each(data, function (i, val) {
                    li += "<li class='font-weight-400 margin-bottom-2'>" +
                        "<input type='radio' id='item_" + data[i].id + "' name='weChatGroup' value='" + data[i].id + "'>" +
                        "<label for='item_" + data[i].id + "' class='margin-left-1'>" + data[i].group_name + "</label>" +
                        "</li>";
                });
                $(".weChatGroutItem").html(li);
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    });

    $(".weChatGroupBtn").click(function () {
        let group_id = $("input[type='radio']:checked").val();
        if (!group_id) {
            WarnPrompt("请选择群");
            return;
        }
        ShowLoading("show");
        BindWeChatGroup(token, group_id, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
                $(".group_name").text(response.group_name);
                $("#weChatGroup").modal("hide");
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    });

    //上传个人二维码
    //get key_code
    let key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    $(".upload_qr_btn").click(function () {
        $("#qr_modal").removeClass("none");
    });
    $(".qr_cancel_btn").click(function () {
        $("#qr_modal").addClass("none");
    });

    let wechat_qrcode = "";
    $("#upload_qr").on("change", function () {
        let objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#person_qr_img").attr("src", objUrl);
        }
        let formData = new FormData($("#form_qr")[0]);
        formData.append("file", this.files[0]);
        formData.append("key_code", key_code);
        wechat_qrcode = UpLoadImg(formData);
    });

    //确定上传
    $(".qr_confirm_btn").click(function () {
        let img_val = $("#upload_qr")[0].files;
        let price = $("#upload_qr_fee").val();

        if (img_val.length <= 0) {
            WarnPrompt("请上传二维码图片");
            return;
        }

        if (price <= 0) {
            WarnPrompt("请输入正确的费用");
            return;
        }
        upload_qr_img_fun(token, wechat_qrcode, price);
    });

    //修改已经绑定的
    $(document).on("click", ".look_qr_btn", function () {
        wechat_qrcode = $("#person_qr_img").attr("src");
        let price = $("#upload_qr_fee").val();
        if (price <= 0) {
            WarnPrompt("请输入正确的费用");
            return;
        }
        upload_qr_img_fun(token, wechat_qrcode, price);
    });

    function upload_qr_img_fun(token, wechat_qrcode, price) {
        ShowLoading("show");
        upload_qr_img(token, wechat_qrcode, price, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                SuccessPrompt("提交成功");
                $("#qr_modal").addClass("none");
                $(".upload_qr_btn").text("查看");
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }


    //修改申请
    $(".modify_application_btn").click(function () {
        let group_name = $(".application_group").text();
        window.location.href = "application.html?group_name=" + encodeURI(encodeURI(group_name));
    });

    //login robot
    $(".robotBtn").click(function () {
        if (is_application_group == "1") {
            let url = getRootPath();
            // window.location.href = url + "/h5/bot_web/login.html";
            window.open(url + "/h5/bot_web2/login.html");
        } else {
            WarnPrompt("请先申请专属领域");
            return;
        }

    })
});