$(function () {
    //get token
    let token = GetCookie('user_token');
    GetUsAccount();
    let benchmark_type = GetCookie('benchmark_type');
    let ca_currency = GetCookie('ca_currency');

    //Get the recharge amount
    let base_amount = GetQueryString('us_ca_withdraw_amount');

    //Get a list of Cas that meet the withdrawal criteria
    let api_url = 'get_ca_withdraw_list_by_amount.php';
    GetMeetWithdrawCaList(api_url, token, base_amount, function (response) {
        if (response.errcode == '0') {
            let data = response.rows, srcArr = [], div = '', li = "";
            if (data == false) {
                $('.bankBox').html('<h5 class="i18n" name="noData">noData</h5>').css('justify-content', 'center');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                li += "<li class='bankItem list_box_item flex align-items-center justify-content-space-between'>" +
                    "<p class='i18n ca_channel' name='" + data[i].ca_channel + "'></p><p> > </p>" +
                    "</li>"
            });
            $('.ca_channel_ul').html(li);
            execI18n();
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Choose recharge method
    $(document).on('click', '.bankItem', function () {
        // let ca_channel = $(this).find('img').attr('title');
        let ca_channel = $(this).find('.ca_channel').text();

        //get us_account_id
        let us_account_id = '';
        GetUsAccountId(token, ca_channel, function (response) {
            if (response.errcode == '0') {
                let data = response.rows[0];
                us_account_id = data.account_id;
                return;
            }
        }, function (response) {
            if (response.errcode == '120') {
                $('#notBingBank').modal('show');
                return;
            }
        });
        window.location.href = 'CaWithdrawAmount.html?us_ca_withdraw_amount=' + base_amount + '&ca_channel=' + encodeURI(encodeURI(ca_channel));
    })
});