$(function () {
    //get token
    let token = GetCookie('la_token');

    let api_url = 'kyc_user_list.php';
    let limit = 10, offset = 0;

    function KycListFun(limit, offset) {
        let totalPage = "", count = "", tr = "", bind_info = '', bind_type = '', bind_name = '';
        KycList(api_url, token, limit, offset, function (response) {
            if (response.errcode == '0') {
                let data = response.rows;
                if(!data){
                    GetDataEmpty('userKyc','6');
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
                    if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                        bind_type = "<td><span class='i18n' name='fileBind'></span></td>";
                        bind_name = "<td><span class='i18n' name='idPhoto'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td>" +
                            "<a href='javascript:;' class='look i18n' name='look'></a>" +
                            "<span class='none idPhotoSrc bind_info'>" + data[i].bind_info + "</span>" +
                            "</td>"
                    } else if (data[i].bind_type == 'text' && data[i].bind_name == 'idNum') {
                        bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                        bind_name = "<td><span class='i18n' name='idNum'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                    } else if (data[i].bind_type == 'text' && data[i].bind_name == 'name') {
                        bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                        bind_name = "<td><span class='i18n' name='name'>" + data[i].bind_name + "</span></td>";
                        bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                    }
                    tr += "<tr class='userKycItem'>" +
                        "<td><span class='us_id'>" + data[i].us_id + "</span></td>" +
                        "<td style='display: none'>" +
                        "<span class='bind_name' name=" + data[i].bind_name + "></span>" +
                        "<span class='log_id' name=" + data[i].log_id + "></span>" +
                        "</td>" +
                        bind_type +
                        bind_name +
                        bind_info +
                        "<td><span>" + data[i].ctime + "</span></td>" +
                        "<td><button class='btn btn-success btn-sm passBtn i18n' name='pass'></button></td>" +
                        "<td><button class='btn btn-danger btn-sm refuseBtn i18n' name='refuse'></button></td>" +
                        "</tr>"
                });
                $('#userKyc').html(tr);
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
            if (response.errcode == '404') {
                GetDataEmpty('userKyc', '6');
                return;
            }
            LayerFun(response.errcode);
            GetDataFail('userKyc', '6');
            return;
        });
    }

    KycListFun(limit, offset);


    //Confirm the approval
    $(document).on('click', '.passBtn', function () {
        let _this = $(this);
        let us_id = $(this).parents('.userKycItem').find('.us_id').text();
        let bind_name = $(this).parents('.userKycItem').find('.bind_name').attr("name");
        let bind_info = $(this).parents('.userKycItem').find('.bind_info').text();
        let log_id = $(this).parents('.userKycItem').find('.log_id').attr("name");
        $(".preloader-wrapper").addClass("active");
        ConfirmKycUser(token, us_id, bind_name, bind_info, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            LayerFun(response.errcode);
        })
    });

    //refuse
    $(document).on('click', '.refuseBtn', function () {
        let _this = $(this);
        let log_id = $(this).parents('.userKycItem').find('.log_id').attr("name");
        $(".preloader-wrapper").addClass("active");
        RefuseKycUser(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            LayerFun(response.errcode);
        })
    });

    //view image
    $(document).on('click', '.look', function () {
        let idPhotoSrc = $(this).parents('.userKycItem').find('.idPhotoSrc').text();
        let idPhotoSrcOne = idPhotoSrc.split(',')[0];
        let idPhotoSrcTwo = idPhotoSrc.split(',')[1];
        $('.idPhotoSrcOne').attr('src', idPhotoSrcOne);
        $('.idPhotoSrcTwo').attr('src', idPhotoSrcTwo);
        $('#lookImgModal').modal('open');
    });

    //init modal
    $('#lookImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});