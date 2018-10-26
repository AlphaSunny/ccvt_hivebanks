$(function () {
    //获取token
    var token = GetCookie("robot_token");

    //获取对应id
    var group_id = GetQueryString("group_id");
    
    //获取群成员列表
    GetGroupMember(token,group_id, function (response) {
        console.log(response);
    }, function (response) {
        
    })
});