$(function () {
    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    $(".filter_title").click(function () {
        $(".filter_box").slideToggle("fast");
    });

    //获取当前域名
    var url = getRootPath();
    $(".backStatistics").click(function () {
        window.location.href = url + "/api/bot_web/page/statistical.php?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    });
});