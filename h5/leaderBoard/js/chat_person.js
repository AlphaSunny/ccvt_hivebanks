$(function () {
   var wechat = GetQueryString("wechat");
   
   GetChatPerson(wechat,function (response) {
       console.log(response);
   },function (response) {
       
   })
});