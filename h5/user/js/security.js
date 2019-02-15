$(function () {
    // Get user binding information
    let token = GetCookie('user_token'), cellphone = '';
    GetUsAccount();

    function BindingInformationFun() {
        BindingInformation(token, function (response) {
            if (response.errcode == '0') {
                let data = response.rows,
                    security_level = parseInt(response.security_level);
                $('.levelNum').text(security_level);

                // Security Level
                $.each(data, function (i, val) {
                    //Whether the phone is bound
                    if (data[i].bind_name == 'cellphone' && data[i].bind_flag == '1') {
                        cellphone = 'cellphone';
                        $(".phoneBindInfo").removeClass("none i18n").text(data[i].bind_info);
                        $(".phoneBindBtn").remove();
                        $(".phoneModifyBtn").removeClass("none");
                    }

                    //Whether the email is bound
                    if (data[i].bind_name == 'email' && data[i].bind_flag == '1') {
                        $(".emailBindInfo").removeClass("none i18n").text(data[i].bind_info);
                        $(".emailBindBtn").remove();
                        $(".emailModifyBind").removeClass("none");
                    }

                    //Whether google is certified
                    if (data[i].bind_name == 'GoogleAuthenticator' && data[i].bind_flag == '1') {
                        $(".google_status_notBind,.googleBind").remove();
                        $(".google_status_alreadyBind,.googleModifyBtn").removeClass("none");
                    }

                    //Whether the password hash is bound
                    if (data[i].bind_name == 'pass_hash' && data[i].bind_flag == '1') {
                        $(".pass_hash_status_alreadyBind,.fundPasswordModify").removeClass("none");
                        $(".pass_hash_status_notBind,.fundPasswordBind").remove();
                    }

                    //Whether the password login is bound
                    if (data[i].bind_name == 'password_login' && data[i].bind_flag == '1') {
                        $(".password_loin_status_alreadyBind").removeClass("none");
                        $(".password_loin_status_notBind").remove();
                    }

                    //Whether identity authentication is bound
                    if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {
                        $(".authenticationBindBtn,.authentication_status_notBind").remove();
                        $(".authentication_status_alreadyBind").removeClass("none").css("text-align", "right");
                    }

                    //Whether quick tread is bound
                    if (data[i].bind_name == "point_tread_switch" && data[i].bind_info == "1") {
                        $(".quickTreadSwitch").addClass("active").val("1");
                        $(".open_status").removeClass("none");
                        $(".close_status").addClass("none");
                    }

                    if (data[i].bind_name == "point_tread_switch" && data[i].bind_info == "2") {
                        $(".quickTreadSwitch").removeClass("active").val("2");
                        $(".open_status").addClass("none");
                        $(".close_status").removeClass("none");
                    }

                    if (data[i].bind_name == "point_tread_num" && data[i].bind_flag == "1") {
                        $(".quick_top_num").text(data[i].bind_info);
                    }
                })
            }
        }, function (response) {
            layer.msg(response.errcode);
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
        });
    }

    BindingInformationFun();

    //return fundPasswordBind
    $('.fundPasswordBind').click(function () {
        if (cellphone != 'cellphone') {
            $('#goBindCellPhone').modal('show');
            return;
        } else {
            window.location.href = 'fundPasswordBind.html';
        }
    });

    //return fundPasswordModify
    $('.fundPasswordModify').click(function () {
        if (cellphone != 'cellphone') {
            $('#goBindCellPhone').modal('show');
            return;
        } else {
            window.location.href = 'fundPasswordModify.html';
        }
    });

    //quick tread
    let point_tread_switch = "", point_tread_num = "";
    $("#quickTreadSwitch").on("change", function () {
        let val = $(this).val();
        if (val == "1") {
            $(this).removeClass("active").val("2");
            point_tread_switch = 2;
            layer.confirm('确定关闭快捷赞踩？', {
                btn: ['确认', '取消'] //按钮
            }, function () {
                PointTreadSwitchFun(point_tread_switch, point_tread_num);
            }, function () {
                $("#quickTreadSwitch").addClass("active").val("1");
            })
        } else {
            $(this).addClass("active").val("1");
            point_tread_switch = 1;
            $("#top_modal").removeClass("none");
        }
    });

    //confirm
    $(".top_confirm_btn").click(function () {
        point_tread_num = $(".amount_top_input").val();
        if (point_tread_num.length <= 0) {
            WarnPrompt("请输入快捷赞踩上限金额");
            return;
        }
        PointTreadSwitchFun(point_tread_switch, point_tread_num);
        $("#top_modal").addClass("none");
    });

    function PointTreadSwitchFun(point_tread_switch, point_tread_num) {
        PointTreadSwitch(token, point_tread_switch, point_tread_num, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
                BindingInformationFun();
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    }

    //cancel
    $(".top_cancel_btn").click(function () {
        $("#top_modal").addClass("none");
        $("#quickTreadSwitch").removeClass("active").val("2");
    });

    // Login record query
    let login_api_url = 'log_login.php', limit = 10, offset = 0;

    function GetLoginCode(token, limit, offset, login_api_url) {
        let tr = '', count = 1;
        AllRecord(token, limit, offset, login_api_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('loginCode', '4');
                    return;
                }
                let totalPage = Math.ceil(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                for (let i = 0; i < data.length; i++) {
                    tr += '<tr>' +
                        '<td class="i18n" name="' + data[i].lgn_type + '">' + data[i].lgn_type.substr(0, 20) + '...' + '</td>' +
                        '<td>' + data[i].ctime + '</td>' +
                        '<td>' + data[i].us_ip + '</td>' +
                        '<td>' + data[i].ip_area + '</td>' +
                        '</tr>';
                }

                $('#loginCode').html(tr);
                execI18n();

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetLoginCode(token, limit, (current - 1) * limit, login_api_url);
                        ShowLoading("show");
                    }
                });
            }

        }, function (response) {
            ShowLoading("show");
            ErrorPrompt(response.errmsg);
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
        });
    };
    GetLoginCode(token, limit, offset, login_api_url);
});
