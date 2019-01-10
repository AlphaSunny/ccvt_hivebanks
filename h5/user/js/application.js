$(function () {
   //token
   var token = GetCookie("user_token");
   
   GetGroupType(token, function (response) {
       if(response.errcode == "0"){
           var data = response.rows;
           console.log(data);
       }
   }, function (response) {
       ErrorPrompt(response.errmsg);
   })
});