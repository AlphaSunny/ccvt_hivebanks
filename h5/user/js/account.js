$(function () {
    // token
    var token = GetCookie('user_token');

    $(".disabled_a").attr("disabled", true).css("color", "#9e9e9e");

    // Basic user information
    var base_amount = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            var security_level = parseInt(data.security_level);
            SetCookie('us_id', data.us_id);
            SetCookie('us_level', data.us_level);
            SetCookie('us_account', data.us_account);
            base_amount = data.base_amount;
            $(".us_nm").text(data.us_nm);
            $('.ctime').text(data.ctime);
            $('.us_account').text(data.us_account);
            $('.availableBalance').text(data.base_amount);
            $('.lockBalance').text(data.lock_amount);
            $('.levelNum').text(security_level);
            $('.glory_of_integral').text(data.glory_of_integral);
            $('.scale').text(data.scale);
            // $('.userLevelNum').text(us_level);
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
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    //withdraw
    $('.withdrawBtn, .navWithdraw').click(function () {
        if (base_amount <= 0) {
            $('#noBalanceModal').modal('show');
            return;
        }
        window.location.href = "withdraw.html";
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
        var us_account = $('#nickName').val();
        if (us_account.length <= 0) {
            WranPrompt("请输入昵称");
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

    var limit = 10, offset = 0, n = 0, type = '2';

    //Account change record
    var account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        var tr = '', count = 1;
        AllRecord(token, limit, offset, account_change_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                var total = response.total;
                var totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                var data = response.rows;
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
    var gloryPoints_change_url = "us_integral_change_log.php";

    var limit_glory = 10, offset_glory = 0;

    function GetGloryPointsChange(token, limit_glory, offset_glory, gloryPoints_change_url) {
        var tr = '', count = 1;
        AllRecord(token, limit_glory, offset_glory, gloryPoints_change_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                var data = response.rows;
                var total = response.total;
                var totalPage = Math.ceil(total / limit_glory);
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
        var url = getRootPath() + "/h5/user/register.html?invite_code=" + $(".us_nm").text();
        $(".inviteInput").val(url);
        $('#qrcode').qrcode({
            render: "canvas",
            text: url,
            width: 95,
            height: 90
        });
        //设置邀请图片
        var qrImg = new Image();
        qrImg.crossOrigin = "*";
        qrImg.src = "img/inviteImg.jpg?t=" + Math.random();
        //找到画布
        var canvas = $("#inviteImg")[0];
        var ctx = canvas.getContext("2d");
        //找到二维码
        var qr = $("#qrcode canvas")[0];
        //图片加载完成时
        qrImg.onload = function () {
            ctx.drawImage(qrImg, 0, 0, 533, 800);
            ctx.drawImage(qr, 65, 588);
            var base64 = canvas.toDataURL("images/png");//转换URL
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
        var wechat = $("#weChatName").val();
        if (wechat.length <= 0) {
            WranPrompt("请输入微信昵称");
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
        $("#exchange_modal").fadeIn();
    });

    $(".customize_modal_cancel_btn").click(function () {
        $(".customize_modal").fadeOut();
        $(".voucher_input").val("");
    });

    $(".exchange_confirm_btn").click(function () {
        ShowLoading("show");
        var voucher = $(".voucher_input").val();
        if (voucher.length <= 0) {
            // LayerFun("pleaseInputExchangeCode");
            WranPrompt("请输入兑换码");
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
        $("#transform_ccvt").fadeIn();
    });

    $(".transform_ccvt_confirm_btn").click(function () {
        ShowLoading("show");
        var account = $(".transform_ccvt_input").val();
        if (account.length <= 0) {
            // LayerFun("pleaseInputChangeAmount");
            WranPrompt("请输入金额数量");
            ShowLoading("hide");
            return
        }
        if (!(/^[1-9]\d*$/.test(account))) {
            WranPrompt("请输入正确的金额数量");
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
        var li = "";
        ShowLoading("show");
        WeChatGroupList(token, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                var data = response.rows;
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
        var group_id = $("input[type='radio']:checked").val();
        if (!group_id) {
            WranPrompt("请选择群");
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

    //show help_img
    $(".help_icon").mouseenter(function () {
        $(".help_img_box").slideDown();
    });
    $(".help_icon").mouseleave(function () {
        $(".help_img_box").slideUp();
    });

    //login robot
    $(".robotBtn").click(function () {
        var url = getRootPath();
        // window.location.href = url + "/h5/bot_web/login.html";
        window.open(url + "/h5/bot_web/login.html");
    })
});