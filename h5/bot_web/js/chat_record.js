$(function () {
   $(".weChatBtn").click(function () {
       $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");
   })
});