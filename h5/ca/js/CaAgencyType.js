$(function () {
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    //get bank list
    GetBankList(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, li = '';
            if (data.length <= 0) {
                $('.noData').show();
                return;
            }
            $.each(data, function (i, val) {
                li += '<li class="width-20">' +
                    '<h4 style="font-weight: 400;font-family: cursive;" title="'+ data[i].option_key +'">' + data[i].option_value + '</h4>' +
                    // '<img src="img/'+ data[i].option_key.toLowerCase() +'.png">' +
                    '<span><i class="iconfont icon-duihao"></i></span>' +
                    '</li>'
            });
            $('.changePay').append(li);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });
    //Select agent type
    $(document).on('click', '.changePay li', function () {
        $(this).siblings().find('.icon-duihao').hide();
        $(this).find('.icon-duihao').show();
        $(this).addClass("active").siblings("li").removeClass("active");
        $('.next').show();
        var ca_channel = "";
        // var imgHtml = $(this).find('img').attr('src');
        //Select proxy mode next step
        $('.next').click(function () {
            window.location.href = 'CaProxyAuthentication.html?' + encodeURIComponent(ca_channel);
        })
    })
});