$(function () {
    var token = GetCookie("robot_token");
    GetGroupList(token, function (response) {
        if(response.errcode == "0"){
            var data = response.rows, tr = "";
            $.each(data, function (i, val) {
                tr+="<tr class='text-center trItem'>" +
                    "<td>"+ data[i].name +"</td>" +
                    "<td class='is_del' name="+ data[i].is_del +">"+ data[i].del +"</td>" +
                    "<td class='is_flirt' name="+ data[i].is_flirt +">"+ data[i].flirt +"</td>" +
                    "<td>" +
                    "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                    // "<button class='btn-sm btn-danger delBtn margin-left-5'>详情</button>" +
                    "</td>" +
                    "</tr>"
            });
            $("#groupListTable").html(tr);
        }
    }, function (response) {
        layer.msg(response.errmsg);
    });

    //编辑对应的群主-弹出编辑框
    $(document).on("click", ".editBtn", function (response) {
        var is_del = $(this).parents(".trItem").find(".is_del").attr("name");
        var is_flirt = $(this).parents(".trItem").find(".is_flirt").attr("name");
        if(is_del == "1"){
            $(".runSwitch").attr("checked", true).val("1");
        }
        if(is_flirt == "1"){
            $(".trickSwitch").attr("checked", true).val("1");
        }
        $("#editGroupModal").modal("show");
    })

    //监听开关按钮状态

});