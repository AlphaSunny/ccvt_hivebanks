$(function () {
    //token
    var token = GetCookie("robot_token");

    //group_id
    var group_id = GetQueryString("group_id");

    //click into news record
    var status = "1";
    $(".weChatBtn").click(function () {
       $(this).addClass("activeWeChatBtn").siblings(".weChatBtn").removeClass("activeWeChatBtn");
       status = $(this).attr("title");
        GetNewsRecordFun(status);
   });

    function GetNewsRecordFun(status) {
        GetNewsRecord(token, group_id, status, function (response) {
            console.log(response);
        }, function (response) {
            layer.msg("获取失败,请稍后重试！");
        });
    }
    GetNewsRecordFun(status);
});