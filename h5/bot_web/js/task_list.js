$(function () {
    var token = GetCookie("robot_token");
    GetTaskList(token, function (response) {
        if(response.errcode == "0"){
            var data = response.rows, tr = "";
            console.log(data);
            return;
            $.each(data, function (i, val) {
                tr+="<tr>" +
                    "<td>"+ data[i].name +"</td>" +
                    "<td>"+ data[i].del +"</td>" +
                    "<td>"+ data[i].flirt +"</td>" +
                    "<td>" +
                    "<button class='btn-success btn-sm'>编辑</button>" +
                    "<button class='btn-sm btn-danger'>删除</button>" +
                    "</td>" +
                    "</tr>"
            });
            $("#groupListTable").html(tr);
        }
    }, function (response) {
        console.log(response);
    });
});