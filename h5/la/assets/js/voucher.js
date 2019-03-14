$(function () {
    //token
    let token = GetCookie('la_token');

//获取兑换码
    let limit = 10, offset = 0;

    function GetVoucherFun(limit, offset) {
        let totalPage = "", count = "", tr = "", is_effective = "", exchange_time = "", redeemer = "";
        GetVoucher(token, limit, offset, is_effective, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                if (!data) {
                    GetDataEmpty("voucherList", 5);
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
                    console.log(data);
                    //是否有效
                    if (data[i].is_effective == "1") {
                        is_effective = "有效";
                    } else {
                        is_effective = "无效";
                    }

                    //是否有兑换时间
                    if (!data[i].exchange_time) {
                        exchange_time = "--";
                    } else {
                        exchange_time = data[i].exchange_time
                    }

                    //是否有兑换者
                    if (!data[i].us_account) {
                        redeemer = "--";
                    } else {
                        redeemer = "<a href='userInfo.html?us_id=" + data[i].us_id + ">" + data[i].us_account + "</a>"
                    }
                    tr += "<tr>" +
                        "<td>" + data[i].coupon_code + "</td>" +
                        "<td>" + data[i].amount + "</td>" +
                        "<td>" + is_effective + "</td>" +
                        "<td>"+ redeemer +"</td>" +
                        "<td>" + exchange_time + "</td>" +
                        "<td>" + data[i].ctime + "</td>" +
                        "<td>" + data[i].expiry_date + "</td>" +
                        "</tr>"
                });
                $("#voucherList").html(tr);

                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetVoucherFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }

    GetVoucherFun(limit, offset);

    //生成
    $(".generate_btn").click(function () {
        let num = $(".num").val();
        let price = $(".price").val();
        let expiry_date = $("#expireDate").val().replace(/\//g, "-");
        if (num.length <= 0) {
            WarnPrompt("请输入兑换数量");
            return;
        }
        if (price.length <= 0) {
            WarnPrompt("请输入兑换额度");
            return;
        }
        if (expiry_date.length <= 0) {
            WarnPrompt("请输入过期时间");
            return;
        }
        generateFun(num, price, expiry_date);
    });

    //生成fun
    function generateFun(num, price, expiry_date) {
        ShowLoading("show");
        Generate(token, num, price, expiry_date, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
                GetVoucherFun(limit, offset);
                ShowLoading("show");
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    }

    //时间输入框
    $("#expireDate").focus(function () {
        $('#expireDate').datetimepicker({
            initTime: new Date(),
            format: 'Y/m/d H:i',
            value: new Date(),
            minDate: new Date(),//Set minimum date
            minTime: new Date(),//Set minimum time
            yearStart: 2018,//Set the minimum year
            yearEnd: 2050 //Set the maximum year
        });
    });
});