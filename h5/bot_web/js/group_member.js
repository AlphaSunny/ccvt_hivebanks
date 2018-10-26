$(function () {
    $('#groupMemberTable').DataTable();
    //获取token
    var token = GetCookie("robot_token");

    //获取对应id
    var group_id = GetQueryString("group_id");
    
    //获取群成员列表
    GetGroupMember(token,group_id, function (response) {
        console.log(response);
        if(response.errcode == "0"){
            var data = response.rows, tr = "";
            $.each(data, function (i, val) {
                tr+="<tr>" +
                    "<td>"+ data[i].name +"</td>" +
                    "</tr>"
            });
            $("#groupMember").html(tr);
        }
    }, function (response) {
        layer.msg(response.errmsg);
    })
});