var token = GetCookie("robot_token");

function _GetWeChatGroupFun() {
    var li = "", option = "", optionArr = "";
    //获取群类型
    GetWeChatGroupType(token, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            $.each(data, function (i, val) {
                option += "<option value=" + data[i].id + ">" + data[i].name + "</option>";
            });
            GetWeChatGroupFun();
        }
    }, function (response) {
        layer.msg(response);
    });

    //获取群列表
    function GetWeChatGroupFun() {
        GetWeChatGroup(token, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    li += "<li class='list-group-item row'>" +
                        "<div class='col-md-5 col-sm-12 padding-left-2'>" +
                        // "<input type='radio' name ='weChatGroup' id=" + data[i].id + " value=" + data[i].id + ">" +
                        "<p class='margin-left-1 group_name' name=" + data[i].id + ">" + data[i].name + "</p>" +
                        "</div>" +
                        "<div class='col-md-5 col-sm-12'>" +
                        "<select name='type_select' id='type_select' class='form-control'>" + option + "</select>" +
                        "</div>" +
                        "<div class='col-md-2 col-sm-12 text-right'><button class='btn btn-success btn-sm add_group_btn'> 添加</button></div>" +
                        "</li>";
                });
                $(".list_group").html(li);
                $(".list_group_box").fadeIn(300);
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        });
    }
}

$(function () {

    function SubmitAddGroupFun(group_id, group_type_id) {
        SubmitAddGroup(token, group_id, group_type_id, function (response) {
            if (response.errcode == "0") {
                layer.msg('提交成功，审核中!', {icon: 1});
            }
        }, function (response) {
            layer.msg(response.errmsg, {icon: 2});
        })
    }

    //添加
    $(document).on("click", ".add_group_btn", function () {
        var group_id = $(this).parents(".list-group-item").find(".group_name").attr("name");
        var group_type_id = $(this).parents(".list-group-item").find("select").val();
        var group_name = $(this).parents(".list-group-item").find(".group_name").text();

        if (!group_type_id) {

        }

        layer.confirm('是否添加《' + group_name + '》', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            SubmitAddGroupFun(group_id, group_type_id);
        }, function () {

        });
    })
});