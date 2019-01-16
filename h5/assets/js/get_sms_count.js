function GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code) {
    GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
        if (response.errcode == '0') {
            // LayerFun('sendSuccess');
            SuccessPrompt("发送成功");
            countDown();
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
        GetImgCode();
    });
}

function countDown() {
    var count_down = 60;
    $("#phoneCodeBtn").attr("disabled",true);
    $(".getCodeText").addClass("none");
    $(".sixty").text(count_down + "s").removeClass("none");

    var timer = setInterval(function () {
        if (countdown > 0) {
            countdown--;
            $('.sixty').text(countdown + "s");
        } else {
            clearInterval(timer);
            $("#phoneCodeBtn").attr("disabled", false);
            $('.sixty').addClass('none');
            $('.getCodeText').removeClass("none");
            return;
        }
    }, 1000);
}