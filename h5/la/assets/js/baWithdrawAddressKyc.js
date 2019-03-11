$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Get the withdrawal address review list
    let api_url = 'kyc_la_ba_address_list.php';
    let limit = 10, offset = 0;

    function GetWithdrawAddressKycFun(limit, offset) {
        let totalPage = "", count = "", tr = "", bind_flag = "";
        GetWithdrawAddressKyc(api_url, token, limit, offset, function (response) {
            if (response.errcode == '0') {
                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('baWithdrawAddressKyc', '5');
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
                if (data == false) {
                    GetDataEmpty('userList', '4');
                }
                $.each(data, function (i, val) {
                    if (data[i].bind_flag == '0') {
                        bind_flag = 'underReview';
                    }
                    tr += '<tr class="withdrawAddressItem">' +
                        '<td><span class="ba_id">' + data[i].ba_id + '</span></td>' +
                        '<td><span class="" name="">' + data[i].bind_info + '</span></td>' +
                        '<td><span class="i18n" name="underReview">' + bind_flag + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '<td>' +
                        '<span class="bind_id none">' + data[i].bind_id + '</span>' +
                        '<div>' +
                        '<button class="btn btn-success btn-sm withdrawAddressConfirmBtn i18n" name="pass">pass</button>' +
                        '<button class="btn btn-danger btn-sm margin-left-5 withdrawAddressRefusesBtn i18n" name="refuse">refuse</button>' +
                        '</div>' +
                        '</td>' +
                        '</tr>'
                });
                $('#baWithdrawAddressKyc').html(tr);
                execI18n();
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetWithdrawAddressKycFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            GetDataFail('baWithdrawAddressKyc', '5');
            LayerFun(response.errcode);
            return;
        });
    }

    GetWithdrawAddressKycFun(limit, offset);

    //Cash ba withdrawal address
    $(document).on('click', '.withdrawAddressConfirmBtn', function () {
        let _this = $(this);
        let ba_id = $(this).parents('.withdrawAddressItem').find('.ba_id').text();
        let bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        let api_url = 'kyc_la_ba_address_confirm.php';
        $(".preloader-wrapper").addClass("active");
        ConfirmBaWithdrawAddress(api_url, token, ba_id, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            return;
        })
    });

    //Reject ba withdrawal address
    $(document).on('click', '.withdrawAddressRefusesBtn', function () {
        let _this = $(this);
        let ba_id = $(this).parents('.withdrawAddressItem').find('.ba_id').text();
        let bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        let api_url = 'kyc_la_ba_address_refuse.php';
        $(".preloader-wrapper").addClass("active");
        ConfirmBaWithdrawAddress(api_url, token, ba_id, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            return;
        })
    });
});