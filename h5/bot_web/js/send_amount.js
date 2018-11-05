$(function () {
    //获取token
    var token = GetCookie("robot_token");


    var url = getRootPath();
    $('#groupMemberTable').DataTable({
        "ajax": url + "/api/bot_web/group_members_list.php?token=" + encodeURIComponent(token) + "&group_id=" + group_id,
        "columns": [
            {"data": "wechat"},
            {"data": "amount"},
            {"data": "num"},
            {"data": "send_time"}
        ]
    });
});