var token = GetCookie("robot_token");
function GetWeChatGroupFun(){
    //获取群列表
    GetWeChatGroup(token, function (response) {
        console.log(response);
    }, function (response) {
        layer.msg(response);
    });

    //获取群类型
    GetWeChatGroupType(token, function (response) {
        console.log(response);
    }, function (response) {
        layer.msg(response);
    });
}