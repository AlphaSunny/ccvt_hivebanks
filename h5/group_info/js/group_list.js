$(function () {
    function GetIndexCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    let user_token = GetIndexCookie('user_token');

    if (user_token) {
        $('.usLogin,.usRegister').remove();
        $('.accountNone').removeClass('none');
    }


    $('.toAccountBtn').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        }
    });

    //获取群列表
    let limit = 10, offset = 0, search_name = "", scale = "", type_id = "";

    function getGroupListFun(limit, offset, search_name, scale, type_id) {
        let count = "";
        _GetGroupList(limit, offset, search_name, scale, type_id, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                let tr = "";
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (total <= 0) {
                    tr = "<tr><td colspan='5'>暂无数据</td></tr>";
                    $("#group_list").html(tr);
                    return;
                }

                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td class='id_name' id=" + data[i].id + " title=" + data[i].name + ">" + data[i].name + "</td>" +
                        "<td>" + data[i].scale + "</td>" +
                        "<td>" + data[i].glory_number + "</td>" +
                        "<td>" + data[i].type_name + "</td>" +
                        "<td><a href='javascript:;' class='to_group_info'>查看</a></td>" +
                        "</tr>";
                });
                $("#group_list").html(tr);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        getGroupListFun(limit, (current - 1) * limit, search_name, scale, type_id);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }

    getGroupListFun(limit, offset, search_name, scale, type_id);

    //前往群详情
    $(document).on("click", ".to_group_info", function () {
        let id = $(this).parents("tr").find(".id_name").attr("id");
        window.location.href = "group_info.html?id=" + id;
    });

    //获取筛选列表
    GetGroupSearch(function (response) {
        let option_scale = "<option value=''>等级筛选</option>";
        let option_type = "<option value=''>类型筛选</option>";
        let scale_list = response.rows.scale_list;
        let type_list = response.rows.type_list;
        $.each(scale_list, function (i, val) {
            option_scale += "<option value=" + scale_list[i].scale + ">" + scale_list[i].scale + "</option>";
        });
        $("#level").html(option_scale);

        $.each(type_list, function (i, val) {
            option_type += "<option value=" + type_list[i].id + ">" + type_list[i].name + "</option>";
        });
        $("#type").html(option_type);
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //等级筛选
    $("#level").on("change", function () {
        scale = $(this).find("option:selected").val();
        type_id = "";
        search_name = "";
        limit = 10;
        offset = 0;
        if (!scale) {
            scale = "";
            ShowLoading("show");
            getGroupListFun(limit, offset, search_name, scale, type_id);
        }
        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    });

    //类型筛选
    $("#type").on("change", function () {
        type_id = $(this).find("option:selected").val();
        console.log(type_id);
        scale = "";
        search_name = "";
        limit = 10;
        offset = 0;
        if (!type_id) {
            console.log("不存在");
            type_id = "";
            ShowLoading("show");
            getGroupListFun(limit, offset, search_name, scale, type_id);
        }
        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    });


    //名称筛选
    $(".search_icon").click(function () {
        type_id = "";
        scale = "";
        search_name = $(".search_name_input").val();
        limit = 10;
        offset = 0;
        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    });
});