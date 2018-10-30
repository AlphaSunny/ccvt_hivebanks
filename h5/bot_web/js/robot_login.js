// $(function () {
//     var url = getRootPath();
//
//     function GetQr() {
//         $.get({
//             url: url + "/api/bot/get_qrcode.php",
//             async: false,
//             success: function (response) {
//                 if(response.rows.robot_alive == "1"){
//
//                 }
//                 $("#qr_img").attr("src",response.rows.qr_path);
//             }
//         })
//     }
//
//     GetQr();
//
//     $(".qr_btn").click(function () {
//         GetQr();
//     });
// });