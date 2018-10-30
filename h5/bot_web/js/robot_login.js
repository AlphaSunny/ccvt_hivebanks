$(function () {
    var url = getRootPath();
   $.get({
       url:url + "api/bot/get_qrcode.php",
       async:false,
       success:function (response) {
           console.log(response);
       }
   })
});