$(function () {
    var token = GetCookie("robot_token");
    GetTaskList(token, function (response) {
        if(response.errcode == "0"){
            var data = response.rows, tr = "";
            $.each(data, function (i, val) {
                tr+="<tr>" +
                    "<td>"+ data[i].time +"</td>" +
                    "<td>"+ data[i].name +"</td>" +
                    "<td>"+ data[i].content +"</td>" +
                    "<td>" +
                    "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                    "<button class='btn-sm btn-danger delBtn'>删除</button>" +
                    "</td>" +
                    "</tr>"
            });
            $("#groupListTable").html(tr);
        }
    }, function (response) {
        console.log(response);
    });
});