$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Registration review list
    let api_url = 'kyc_ba_reg_table.php', tr = '';
    let limit = 10, offset = 0;

    function RegisterKycFun(limit, offset) {
        RegisterKyc(api_url, token, limit, offset, function (response) {
            let totalPage = "", count = "";
            if (response.errcode == '0') {
                let data = response.rows, bind_flag = '';
                if (data == false) {
                    GetDataEmpty('baRegisterKyc', '5')
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
                
                if (data == false) {
                    GetDataEmpty('userList', '4');
                }
                $.each(data, function (i, val) {
                    if (data[i].bind_flag == '2') {
                        bind_flag = 'under review';
                    } else {
                        bind_flag = data[i].bind_flag;
                    }
                    tr += '<tr class="registerItem">' +
                        '<td><span class="ba_id">' + data[i].ba_id + '</span></td>' +
                        '<td><span>' + data[i].bind_info + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '<td><span class="i18n" name="underReview">' + bind_flag + '</span></td>' +
                        '<td>' +
                        '<span class="bind_id none">' + data[i].bind_id + '</span>' +
                        '<a href="javascript:;" class="registerSucBtn btn btn-success btn-sm i18n" name="pass"></a>' +
                        '<a href="javascript:;" class="registerRefBtn btn btn-danger btn-sm i18n" name="refuse"></a></td>' +
                        '</tr>';
                });
                $('#baRegisterKyc').html(tr);
                execI18n();
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        RegisterKycFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            if (response.errcode == '101') {
                GetDataEmpty('baRegisterKyc', '5');
            }
            LayerFun(response.errcode);
            return;
        });
    }

    RegisterKycFun(limit, offset);

    //Approved
    $(document).on('click', '.registerSucBtn', function () {
        let api_url = 'kyc_ba_reg_confirm.php', _this = $(this);
        let bind_id = $(this).parent().children('.bind_id').text();
        $(".preloader-wrapper").addClass("active");
        RegisterPass(api_url, token, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.registerItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        })
    });

    //Refuse to review
    $(document).on('click', '.registerRefBtn', function () {
        let api_url = 'kyc_ba_reg_refuse.php', _this = $(this);
        let bind_id = $(this).parent().children('.bind_id').text();
        $(".preloader-wrapper").addClass("active");
        RegisterRef(api_url, token, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.registerItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        })
    });
});