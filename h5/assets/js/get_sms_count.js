function GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code) {
    GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
        if (response.errcode == '0') {
            // LayerFun('sendSuccess');
            ShowLoading("hide");
            SuccessPrompt("发送成功");
            countDown();
        }
    }, function (response) {
        ErrorPrompt(response.errmsg);
        GetImgCode();
    });
}

function countDown() {
    let count_down = 60;
    $("#phoneCodeBtn").attr("disabled",true);
    $(".getCodeText").addClass("none");
    $(".sixty").text(count_down + "s").removeClass("none");

    let timer = setInterval(function () {
        if (count_down > 0) {
            count_down--;
            $('.sixty').text(count_down + "s");
        } else {
            clearInterval(timer);
            $("#phoneCodeBtn").attr("disabled", false);
            $('.sixty').addClass('none');
            $('.getCodeText').removeClass("none");
            return;
        }
    }, 1000);
}