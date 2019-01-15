$(function () {
    var token = GetUsCookie("user_token");
    GetUsAccount();
    var ca_channel = GetQueryString('ca_channel'),
        ca_channel_en = GetQueryString('ca_channel_en'),
        // ca_id = GetCookie("ca_id"),
        card_nm = GetQueryString('card_nm'),
        bit_amount = GetQueryString('bit_amount'),
        base_amount = GetQueryString('base_amount'),
        name = window.location.search,
        start = decodeURIComponent(name).indexOf('name='),
        end = decodeURIComponent(name).indexOf('&card_nm=');
    $('.bit_amount').text(bit_amount);
    $('.base_amount').text(base_amount);
    $('.card_nm').text(card_nm);
    $('.name').text(decodeURIComponent(name).substring(start + 5, end));
    // $('.rechargeTypeImg').attr("src", "img/" + ca_channel.toLowerCase() + ".png");


    //api
    //ca_recharge_order_info.php
    GetCaRechargeInfo(token, ca_id, ca_channel_en, function (response) {
        if (response.errcode == "0") {
            console.log(response);
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });


    //copy recharge address
    $('.copy_address').click(function () {
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
        return;
    })
});