$(function () {
    //token
    var token = GetCookie("robot_token");

    //group_id
    var group_id = GetQueryString("group_id");

    //click into news record
    $(".weChatBtn").click(function () {
       $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");

       GetNewsRecord(token, group_id, function (response) {
            console.log(response);
       }, function (response) {
           layer.msg("获取失败,请稍后重试！");
       });
   })
});