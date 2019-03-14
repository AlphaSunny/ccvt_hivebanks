$(function () {
    //token
    let token = GetCookie('la_token');

    //生成
    $(".generate_btn").click(function () {
        let num = $(".num").val();
        let price = $(".price").val();
        let expiry_date = $(".expiry_date").val();
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
        Generate(token, num, price, expiry_date, function (response) {
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
            }
        }, function (response) {
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