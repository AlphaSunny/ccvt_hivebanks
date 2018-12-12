var token = GetCookie("robot_token");

function GetWeChatGroupFun() {
    //获取群列表
    var li = "", div_group = "", div_type = "";
    GetWeChatGroup(token, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            $.each(data, function (i, val) {
                li += "<li class='list-group-item row'>" +
                    "<div class='col-md-6 col-sm-6'>" +
                    "<input type='radio' name ='weChatGroup' id=" + data[i].id + " value=" + data[i].id + ">" +
                    "<label for=" + data[i].id + ">" + data[i].name + "</label>" +
                    "</div>" +
                    "</li>";
                });
            $(".list_group").html(li);
        }
    }, function (response) {
        layer.msg(response);
    });

    //获取群类型
    // GetWeChatGroupType(token, function (response) {
    //     if (response.errcode == "0") {
    //         var data = response.rows;
    //         $.each(data, function (i, val) {
    //             div_type += "<div class='col-md-6 col-sm-6'>" +
    //                 "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>选择类型</button>" +
    //                 "<ul class='dropdown-menu'>" +
    //                 "<li class='type_dropdown_item' name=" + data[i].id + ">" + data[i].name + "</li>" +
    //                 "</ul>" +
    //                 "</div>";
    //             li.append(div_type);
    //         })
    //     }
    // }, function (response) {
    //     layer.msg(response);
    // });
    // $(".list_group").html(li);
}