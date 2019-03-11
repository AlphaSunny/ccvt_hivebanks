$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Get the ca review list
    let api_url = 'kyc_ca_list.php';
    let limit = "", offset = "";

    function KycListFun(limit, offset) {
        let totalPage = "", count = "", tr = "", bind_name = '', bind_info = '', bind_type = '';
        KycList(api_url, token, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('caKyc', '5');
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
                    if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                        bind_type = "<td><span class='i18n' name='fileBind'></span></td>";
                        bind_name = "<td><span class='bind_name i18n' name='idPhoto'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td>" +
                            "<a href='javascript:;' class='look i18n' name='look'>" + bind_info + "</a>" +
                            "<span class='none idPhotoSrc bind_info'>" + data[i].bind_info + "</span>" +
                            "</td>"
                    } else if (data[i].bind_type == 'text' && data[i].bind_name == 'idNum') {
                        bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                        bind_name = "<td><span class='bind_name i18n' name='idNum'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                    } else if (data[i].bind_type == 'text' && data[i].bind_name == 'name') {
                        bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                        bind_name = "<td><span class='bind_name i18n' name='name'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                    }
                    tr += "<tr class='caKycItem'>" +
                        "<td><span class='ca_id'>" + data[i].ca_id + "</span></td>" +
                        "<td style='display: none'><span class='log_id'>" + data[i].log_id + "</span></td>" +
                        bind_type +
                        bind_name +
                        bind_info +
                        "<td><span>" + data[i].ctime + "</span></td>" +
                        "<td><button class='btn btn-success btn-sm passBtn i18n' name='pass'></button></td>" +
                        "<td><button class='btn btn-danger btn-sm refuseBtn i18n' name='refuse'></button></td>" +
                        "</tr>"
                });
                $('#caKyc').html(tr);
                execI18n();
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        KycListFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            GetDataFail('caKyc', '5');
            LayerFun(response.errcode);
            ShowLoading("hide");
        });
    }

    KycListFun(limit, offset);

    //Confirm the approval
    $(document).on('click', '.passBtn', function () {
        let _this = $(this), log_id = $(this).parents('.caKycItem').find('.log_id').text();
        $(".preloader-wrapper").addClass("active");
        ConfirmKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
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
    $(document).on('click', '.refuseBtn', function () {
        let _this = $(this);
        let log_id = $(this).parents('.caKycItem').find('.log_id').text();
        $(".preloader-wrapper").addClass("active");
        RefuseKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        })
    });

    //view image
    $(document).on('click', '.look', function () {
        let idPhotoSrc = $(this).parents('.caKycItem').find('.idPhotoSrc').text();
        let idPhotoSrcOne = idPhotoSrc.split(',')[0];
        let idPhotoSrcTwo = idPhotoSrc.split(',')[1];
        $('.idPhotoSrcOne').attr('src', idPhotoSrcOne);
        $('.idPhotoSrcTwo').attr('src', idPhotoSrcTwo);
        $('#lookImgModal').modal('open');
    });

    //Initialize modal
    $('#lookImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});