$(function () {
    // token
    var token = GetCookie('user_token');

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
            $(".us_account").text(data.us_account);
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
    //trading status
    // TradingStatus(token, limit, offset, type, function (response) {
    //     if (response.errcode == '0') {
    //
    //     }
    // }, function (response) {
    //     // LayerFun(response.errcode);
    // });

    //Account change record
    var account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        var tr = '';
        $("#accountChange").html("<tr><td colspan='5'><img src='../assets/img/loading.gif' alt=''><span class='i18n' name='tryingToLoad'>loading...</span></td></tr>")
        AllRecord(token, limit, offset, account_change_url, function (response) {
            if (response.errcode == '0') {
                var pageCount = Math.ceil(response.total / limit);
                $('.accountChange_totalPage').text(Math.ceil(response.total / limit));
                var data = response.rows;
                if (data == false) {
                    $('.accountChange_eg').hide();
                    GetDataEmpty('accountChange', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        // '<td><span title="' + data[i].hash_id + '">' + data[i].hash_id.substr(0, 20) + '...' + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span>' + data[i].credit_balance + '</span></td>' +
                        '<td><span class="i18n" name="' + data[i].tx_type + '">' + data[i].tx_type + '</span></td>' +
                        '</tr>'
                });
                $('.accountChange').html(tr);
                execI18n();
                if (n == 0) {
                    Page(pageCount);
                }
                n++;
            }
        }, function (response) {
            GetDataFail('accountChange', '5');
        });
    };
    GetAccountChange(token, limit, offset, account_change_url);

    //account change Pagination
    function Page(pageCount) {
        $('.account_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.account_currentPage').text(api.getCurrent());
                GetAccountChange(token, limit, offset, account_change_url);
            }
        });
    }

    // gloryPoints change code
    var gloryPoints_change_url = "us_integral_change_log.php";

    function GetGloryPointsChange(token, limit, offset, gloryPoints_change_url) {
        var tr = '';
        $("#gloryPointsChange").html("<tr><td colspan='5'><img src='../assets/img/loading.gif' alt=''><span class='i18n' name='tryingToLoad'>loading...</span></td></tr>")
        AllRecord(token, limit, offset, gloryPoints_change_url, function (response) {
            if (response.errcode == '0') {
                var pageCount = Math.ceil(response.total / limit);
                $('.gloryPoints_totalPage').text(Math.ceil(response.total / limit));
                var data = response.rows;
                if (data == false) {
                    $('.gloryPoints_eg').hide();
                    GetDataEmpty('gloryPointsChange', '3');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        // '<td><span title="' + data[i].hash_id + '">' + data[i].hash_id.substr(0, 20) + '...' + '</span></td>' +
                        '<td><span>' + data[i].utime + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span class="" name="' + data[i].tx_detail + '">' + data[i].tx_detail + '</span></td>' +
                        '</tr>'
                });
                $('.gloryPointsChange').html(tr);
                // execI18n();
                if (n == 0) {
                    GloryPointsPage(pageCount);
                }
                n++;
            }
        }, function (response) {
            GetDataFail('gloryPointsChange', '5');
        });
    };

    GetGloryPointsChange(token, limit, offset, gloryPoints_change_url);

    // gloryPoints change Pagination
    function GloryPointsPage(pageCount) {
        $('.gloryPoints_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.gloryPoints_currentPage').text(api.getCurrent());
                GetGloryPointsChange(token, limit, offset, account_change_url);
            }
        });
    }

    //invite
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
        qrImg.src = "img/inviteImg.jpg";
        qrImg.onload = function () {
            content.drawImage(this, 0, 0, 568, 886);//设置狂傲
            content.drawImage(qrctx, 52, 685, 160, 160);//二维码位置 左/上/右/下
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
        $(".customize_modal").fadeIn();
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
            $(".customize_modal").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            layer.msg(response.errmsg);
            ShowLoading("hide");
        })
    });

    //transform ccvt
    $(".upgrade_btn").click(function () {
        $(".customize_modal").fadeIn();
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
            $(".customize_modal").fadeOut();
            ShowLoading("hide");
        }, function (response) {
            layer.msg(response.errmsg);
            ShowLoading("hide");
        })
    });
});