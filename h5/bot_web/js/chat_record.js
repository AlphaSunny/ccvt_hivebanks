$(function () {
   $(".weChatBtn").click(function () {
       $(this).toggle(function () {
           $(this).addClass(".activeWeChatBtn");
       });
   })
});