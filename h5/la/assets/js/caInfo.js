$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Get ba information
    let limit = 10, offset = 0, n = 0;
    let ca_id = GetQueryString('ca_id'), tr = '';
    $('.ca_id').text(ca_id);

    function GetCaInfoFun(limit, offset) {
        let totalPage = "", count = "", bind_type = '', bind_name = '';
        GetCaInfo(ca_id, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                $('.base_amount').text(data.base_amount);
                $('.lock_amount').text(data.lock_amount);
                $('.ca_level').text(data.ca_level);
                $('.security_level').text(data.security_level);
                $('.ctime').text(data.ctime);
                if (data == false) {
                    GetDataEmpty('caBindInfo', '5');
                    return;
                }
                let total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                $.each(data, function (i, val) {
                    if (typeof data[i] != 'object') return;

                    //bind_type
                    if (data[i].bind_type == 'hash') {
                        bind_type = 'hashBind';
                    }
                    if (data[i].bind_type == 'text') {
                        bind_type = 'textBind';
                    }
                    if (data[i].bind_type == 'file') {
                        bind_type = 'fileBind';
                    }

                    //bind_name
                    if (data[i].bind_name == 'password_login') {
                        bind_name = 'password_login';
                    }
                    if (data[i].bind_name == 'email') {
                        bind_name = 'email';
                    }
                    if (data[i].bind_name == 'cellphone') {
                        bind_name = 'cellphone';
                    }
                    if (data[i].bind_name == 'googleAuthenticator') {
                        bind_name = 'googleAuthenticator';
                    }
                    if (data[i].bind_name == 'idNum') {
                        bind_name = 'idNum';
                    }
                    if (data[i].bind_name == 'name') {
                        bind_name = 'name';
                    }
                    tr += '<tr>' +
                        '<td><span>' + data[i].bind_id + '</span></td>' +
                        '<td><span class="i18n" name="' + bind_name + '">' + data[i].bind_name + '</span></td>' +
                        '<td><span class="i18n" name="' + bind_type + '">' + data[i].bind_type + '</span></td>' +
                        '<td><span class="i18n" name="bindingSuccess">' + data[i].bind_flag + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '</tr>'
                });
                $("#caBindInfo").html(tr);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetCaInfoFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            if (response.errcode == '-1') {
                LayerFun(response.errcode);
                GetDataFail('caBindInfo', '5');
                return;
            }
        });
    }

    GetCaInfoFun(limit, offset);

    //Adjustment margin
    $('.edit').click(function () {
        $('.reviseAmount').show();
    });

    //Confirm adjustment margin
    $('.reviseAmountBtn').click(function () {
        let base_amount = $('#reviseAmount').val(), pass_word_hash = hex_sha1($('#password').val());
        if (base_amount.length <= 0) {
            LayerFun('pleaseEnterADeposit');
            return;
        }
        if ($('#password').val().length <= 0) {
            LayerFun('pleaseEnterYourPassword');
            return;
        }
        $(".preloader-wrapper").addClass("active");
        ReviseCaAmount(token, ca_id, base_amount, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                let data = response.rows;
                $('.base_amount').text(data.base_amount);
                $('.reviseAmount').hide();
                LayerFun('setSuccessfully');
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            LayerFun('setupFailed');
            return;
        })
    });

    //Cancel adjustment margin
    $('.cancelReviseAmountBtn').click(function () {
        $('.reviseAmount').hide();
    });
});