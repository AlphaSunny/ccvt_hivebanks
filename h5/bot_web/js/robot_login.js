$(function () {
    var url = getRootPath();

    function GetQr() {
        $.get({
            url: url + "/api/bot/get_qrcode.php",
            async: false,
            success: function (response) {
            console.log(response);
            console.log(response.qr_path);
                $("#qr_img").attr("src",response.qr_path);
            }
        })
    }

    GetQr();

    $(".qr_btn").click(function () {
        GetQr();
    });
});