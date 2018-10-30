$(function () {
    var url = getRootPath();

    function GetQr() {
        $.get({
            url: url + "/api/bot/get_qrcode.php",
            async: false,
            success: function (response) {
                
                $("#qr_img").src(response.qr_path);
            }
        })
    }

    GetQr();

    $(".qr_btn").click(function () {
        GetQr();
    });
});