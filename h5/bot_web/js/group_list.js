$(function () {
    var token = GetCookie("robot_token");
    GetGroupList(token, function (response) {
        var data = response.data, tr = "";
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
    }, function (response) {

    });
   // $.ajax({
   //     url:"http://ccvt_test.fnying.com/api/bot_web/group_list.php?token=PNySspBA0hK9ZWn0WOhqXk2GbJVjhdCRR%2FR0fNIyU7V0%2B5xF%2BSjhwT24DASvFjE6b2IwIKKPz%2Bo2V6AEA2MepQ%3D%3D",
   //     type:"GET",
   //     dataType:"jsonp",
   //     success:function (response) {
   //         var data = response.data, tr = "";
   //         $.each(data, function (i, val) {
   //             tr+="<tr>" +
   //                 "<td>"+ data[i].name +"</td>" +
   //                 "<td>"+ data[i].del +"</td>" +
   //                 "<td>"+ data[i].flirt +"</td>" +
   //                 "<td>" +
   //                 "<button class='btn-success btn-sm'>编辑</button>" +
   //                 "<button class='btn-sm btn-danger'>删除</button>" +
   //                 "</td>" +
   //                 "</tr>"
   //         });
   //         $("#groupListTable").html(tr);
   //     },
   //     error:function (response) {
   //         console.log("error");
   //     }
   // })
});