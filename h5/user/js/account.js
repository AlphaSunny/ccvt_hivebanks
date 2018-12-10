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
        }
    }, function (response) {
        layer.msg(response.errcode);
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
            LayerFun('pleaseEnterNickname');
            return;
        }
        ShowLoading("show");
        ModifyNickName(token, us_account, function (response) {
            if (response.errcode == '0') {
                $('#modifyName').modal('hide');
                ShowLoading("hide");
                LayerFun('modifySuccess');
                $('.us_account').text(response.us_account);
                SetCookie('us_account', response.us_account);
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun('modifyFail');
            LayerFun(response.errcode);
            return;
        });
    });

    var limit = 10, offset = 0, n = 0, type = '2';

    //Account change record
    var account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        var tr = '', count = 1;
        var index = layer.load(1, {
            shade: [0.1, '#fff']
        });
        AllRecord(token, limit, offset, account_change_url, function (response) {
            layer.close(index);
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
                        $("#current").text(current);
                        GetAccountChange(token, limit, (current - 1) * limit, account_change_url)
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
            if (response.errcode == '0') {
                var data = response.rows;
                console.log(data);
                var totalPage = Math.ceil(response.rows.length / limit_glory);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data = false) {
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
                console.log(tr);
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
                        $("#current").text(current);
                        GetAccountChange(token, limit_glory, (current - 1) * limit, account_change_url)
                    }
                });
            }
        }, function (response) {
            GetDataFail('gloryPointsChange', '5');
        });
    };

    GetGloryPointsChange(token, limit_glory, offset_glory, gloryPoints_change_url);


    //invite
    $(".invite_img").attr("src", "img/low_inviteImg.jpg?t=" + Math.random());
    $(".inviteBtn").click(function () {
        var url = getRootPath() + "/h5/user/register.html?invite=" + window.btoa($(".us_nm").text());
        $(".inviteInput").val(url);

        $('#qrcode').qrcode({
            text: url,
            width: 200,
            height: 200
        });

        //get canvas qr
        var qrctx = $("#qrcode canvas")[0];

        //canvas invite img
        var canvas = $("#inviteImg")[0];
        var content = canvas.getContext("2d");
        var qrImg = new Image();
        qrImg.crossOrigin = "*";
        qrImg.src = "img/inviteImg.jpg?t=" + Math.random();
        qrImg.onload = function () {
            content.drawImage(this, 0, 0, 568, 886);//设置宽高
            content.drawImage(qrctx, 133, 552, 146, 149);//二维码位置 左/上/右/下
            var base64 = canvas.toDataURL("images/png");//转成URL
            $("#base64Img").attr("src", base64);
            $(".inviteImgBox, #qrcode").remove();
        };
    });

    //copy invite address
    $('.copy_invite_address').click(function () {
        new ClipboardJS('.copy_invite_address');
        layer.msg("copy success")
    });

    //bind weChat group
    $(".bindWeChatBtn").click(function () {
        var wechat = $("#weChatName").val();
        if (wechat.length <= 0) {
            LayerFun("pleaseEnterNickname");
            return;
        }
        ShowLoading("show");
        BindWeChatName(token, wechat, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                $("#weChatGroupName").modal("hide");
                LayerFun("bindSuccess");
                $(".wechat").text(response.new_wechat).removeClass("i18n");
                $("#weChatBindBtn").remove();
                $("#weChatModifyBtn").fadeIn("fast");
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
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
            LayerFun("pleaseInputExchangeCode");
            ShowLoading("hide");
            return
        }
        Exchange(token, voucher, function (response) {
            $(".voucher_input").val("");
            LayerFun("submitSuccess");
            $(".availableBalance").text(response.us_amount);
            $("#exchange_modal").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            layer.msg(response.errmsg);
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
            LayerFun("pleaseInputChangeAmount");
            ShowLoading("hide");
            return
        }
        TransformCCVT(token, account, function (response) {
            $(".transform_ccvt_input").val("");
            LayerFun("submitSuccess");
            $(".availableBalance").text(response.us_amount);
            $(".glory_of_integral").text(response.glory_of_integral);
            $("#transform_ccvt").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            layer.msg(response.errmsg);
            ShowLoading("hide");
        })
    });
});