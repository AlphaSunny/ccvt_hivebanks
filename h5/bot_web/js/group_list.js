$(function () {
    var token = GetCookie("robot_token");
    GetGroupList(token, function (response) {
        if(response.errcode == "0"){
            var data = response.rows, tr = "";
            $.each(data, function (i, val) {
                tr+="<tr class='text-center'>" +
                    "<td>"+ data[i].name +"</td>" +
                    "<td>"+ data[i].del +"</td>" +
                    "<td>"+ data[i].flirt +"</td>" +
                    "<td>" +
                    "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                    "<button class='btn-sm btn-danger delBtn '>删除</button>" +
                    "</td>" +
                    "</tr>"
            });
            $("#groupListTable").html(tr);
        }
    }, function (response) {
        layer.msg(response.errmsg);
    });

    //编辑对应的群主
    $(document).on("click", ".editBtn", function (response) {
        $("#editGroupModal").modal("show");
    })
});