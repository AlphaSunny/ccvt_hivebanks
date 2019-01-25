$(function () {
    //token
    let token = GetCookie('user_token');
    GetUsAccount();

    //Get images
    let img = decodeURIComponent(window.location.search.split('=')[1]);
    $('.bankImg').attr('src', img);
    let start = img.indexOf('/'), end = img.indexOf('.');

    //Confirmation information to add a bank card
    let cash_type = GetCookie('ca_currency');
    $('.addBankBtn').click(function () {
        let cash_channel = img.substring(start + 1, end), cash_address = $('#BankCard').val(),
            name = $('#Name').val(), idNum = $('#IDCard').val(), pass_word_hash = hex_sha1($('#Password').val());

        if (cash_address.length <= 0) {
            // LayerFun('pleaseCardNumber');
            WarnPrompt("请输入银行卡号");
            return;
        }

        if (name.length <= 0) {
            // LayerFun('pleaseEnterName');
            WarnPrompt("请输入姓名");
            return;
        }

        if (idNum.length <= 0) {
            // LayerFun('pleaseEnterIdNumber');
            WarnPrompt("请输入身份证号码");
            return;
        }

        if (pass_word_hash.length <= 0) {
            // LayerFun('pleaseEnterPassword');
            WarnPrompt("请输入密码");
            return;
        }
        ShowLoading("show");
        AddBank(token, cash_channel, cash_type, cash_address, name, idNum, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                // LayerFun('addBankSuccessfully');
                SuccessPrompt("添加成功");
                window.location.href = 'manageBankList.html';
            }
        }, function (response) {
            ShowLoading("hide");
            // LayerFun(response.errcode);
            ErrorPrompt(response.errmsg);
        })
    })
});