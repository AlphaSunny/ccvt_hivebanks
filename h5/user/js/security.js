$(function () {
    // Get user binding information
    var token = GetCookie('user_token'), cellphone = '';
    GetUsAccount();
    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows,
                security_level = parseInt(response.security_level);
            $('.levelNum').text(security_level);

            // Security Level
            $.each(data, function (i, val) {
                //Whether the phone is bound
                if (data[i].bind_name == 'cellphone' && data[i].bind_flag == '1') {
                    cellphone = 'cellphone';
                    $('.phoneTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.phoneBind').fadeOut('fast');
                    $('.phoneModify').fadeIn('fast');
                    $(".phoneInfo").text($(this)[0].bind_info);
                    $('.phoneIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether the email is bound
                if (data[i].bind_name == 'email' && data[i].bind_flag == '1') {
                    $('.emailTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.emailBind').fadeOut('fast');
                    $('.emailModify').fadeIn('fast');
                    $(".emailInfo").text($(this)[0].bind_info);
                    $('.emailIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether google is certified
                if (data[i].bind_name == 'GoogleAuthenticator' && data[i].bind_flag == '1') {
                    $('.googleTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.googleBind').fadeOut('fast');
                    // $('.fileModify').fadeIn('fast');
                    $('.googleIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether the password hash is bound
                if (data[i].bind_name == 'pass_hash' && data[i].bind_flag == '1') {
                    $('.fundPasswordTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.fundPasswordBind').fadeOut('fast');
                    $('.fundPasswordModify').fadeIn('fast');
                    $('.fundPasswordIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether the password login is bound
                if (data[i].bind_name == 'password_login' && data[i].bind_flag == '1') {
                    $('.loginPasswordTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.loginPasswordModify').fadeIn('fast');
                    $('.loginPasswordIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether identity authentication is bound
                if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {
                    $('.authenticationTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.authenticationBind').fadeOut('fast');
                    // $('.authenticationModify').fadeIn('fast');
                    $('.authenticationIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }
            })
        }
    }, function (response) {
        layer.msg(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

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
    var point_tread_switch = "", point_tread_num = "";
    $("#quickTreadSwitch").on("change", function () {
        var val = $(this).val();
        if (val == "1") {
            $(this).removeClass("active").val("2");
            point_tread_switch = 2;
            $("#exchange_modal").removeClass("none");
        } else {
            $(this).addClass("active").val("1");
            point_tread_switch = 1;
        }
    });

    // Login record query
    var login_api_url = 'log_login.php', limit = 10, offset = 0;

    function GetLoginCode(token, limit, offset, login_api_url) {
        var tr = '', count = 1;
        AllRecord(token, limit, offset, login_api_url, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                var data = response.rows;
                if (data == false) {
                    GetDataEmpty('loginCode', '4');
                    return;
                }
                var totalPage = Math.ceil(response.total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                for (var i = 0; i < data.length; i++) {
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
