$(function () {
    //token
    var token = GetCookie("total_robot_token");

    //获取群类型
    GetGroupTypeAdmin(token, function (response) {
        if(response.errcode == "0"){
            console.log(response);
        }
    }, function (response) {
        layer.msg(response.errmsg, {icon: 2});
    })
});