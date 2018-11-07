$(function () {
    GetImgCode();

    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");
    console.log(datetime, group_name);
});