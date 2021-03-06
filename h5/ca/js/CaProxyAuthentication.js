$(function () {
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    var ca_channel = GetQueryString("ca_channel");
    var ca_channel_cn = decodeURI(GetQueryString("ca_channel_cn"));

    $(".pcTitle,.phoneTitle").text(ca_channel_cn);

    $('.addBankBtn').click(function () {
        var card_nm = $('#BankCard').val(), name = $('#Name').val(),
            idNum = $('#IDCard').val(), pass_word_hash = hex_sha1($('#Password').val());
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        AddAgencyType(token, ca_channel, card_nm, name, idNum, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('setSuccess');
                window.location.href = 'CaLookAgencyType.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });
});