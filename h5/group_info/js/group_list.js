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
    let limit = 10, offset = 0;

    function getGroupListFun(limit, offset) {
        let count = "";
        $.ajax({
            type: "GET",
            url: getRootPath() + "/api/group_info/group_list.php?limit=" + limit + "&offset=" + offset,
            dataType: "jsonp",
            success: function (res) {
                if (res.errcode == "0") {
                    let data = res.rows;
                    let total = res.total;
                    let totalPage = Math.ceil(total / limit);
                    if (totalPage <= 1) {
                        count = 1;
                    } else if (1 < totalPage && totalPage <= 6) {
                        count = totalPage;
                    } else {
                        count = 6;
                    }
                    let tr = "";
                    console.log(data);
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
            },
            error: function (res) {
                ErrorPrompt(res.errmsg);
            }
        });
    }

    getGroupListFun(limit, offset);

    //前往群详情
    $(document).on("click", ".to_group_info", function () {
        let id = $(this).parents("tr").find(".id_name").attr("id");
        window.location.href = "group_info.html?id=" + id;
    })
});