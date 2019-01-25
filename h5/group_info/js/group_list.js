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
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                let tr = "";
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td class='id_name' id=" + data[i].id + " title=" + data[i].name + ">" + data[i].name + "</td>" +
                        "<td>" + data[i].scale + "</td>" +
                        "<td>暂无数据</td>" +
                        "<td>暂无数据</td>" +
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
                        getGroupListFun(limit, (current - 1) * limit);
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
        let option_scale = "<option vlaue='0'>等级筛选</option>";
        let option_type = "<option vlaue='0'>类型筛选</option>";
        let scale_list = response.scale_list;
        let type_list = response.type_list;
        $.each(scale_list, function (i, val) {
            option_scale += "<option vlaue=" + data[i].scale + ">" + data[i].scale + "</option>";
        });
        $("#level").html(option_scale);

        $.each(type_list, function (i, val) {
            option_scale += "<option vlaue=" + data[i].id + ">" + data[i].name + "</option>";
        });
        $("#type").html(option_type);
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //等级筛选
    $("#level").on("change", function () {
        scale = $(this).val();
        console.log(scale);
    })
});