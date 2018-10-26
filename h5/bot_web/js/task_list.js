$(function () {
    var token = GetCookie("robot_token");
    GetTaskList(token, function (response) {
        if (response.errcode == "0") {
            var data = response.rows, tr = "";
            tr += "<tr class='text-center'>" +
                "<td>" + data[i].time + "</td>" +
                "<td>" + data[i].content + "</td>" +
                "<td>" + data[i].name + "</td>" +
                "<td>" +
                "<button class='btn-success btn-sm editBtn'>编辑</button>" +
                "<button class='btn-sm btn-danger delBtn margin-left-5'>删除</button>" +
                "</td>" +
                "</tr>";
            $.each(data, function (i, val) {
            });
            $("#groupListTable").html(tr);
        }
    }, function (response) {
        layer.msg(response.errmsg);
    });

    //删除任务
    $(document).on("click", ".delBtn", function () {
        layer.confirm('确定删除该条数据？', {
            btn: ['取消','确认'] //按钮
        })
        // , function(){
        //
        // }, function(){
        //     // layer.msg('的确很重要', {icon: 1});
        // });
    })
});