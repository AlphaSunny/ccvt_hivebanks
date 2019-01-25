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
    $.ajax({
        type: "GET",
        url: getRootPath() + "/api/group_info/group_list.php",
        dataType: "json",
        success: function (res) {
            if (res.errcode == "0") {
                let data = res.rows;
                let tr = "";
                console.log(data);
                $.each(data, function (i, val) {
                    tr += "<tr>" +
                        "<td id=" + data[i].id + " title=" + data[i].name + ">" + data[i].name + "</td>" +
                        "<td>" + data[i].scale + "</td>" +
                        "<td>暂无数据</td>" +
                        "<td>暂无数据</td>" +
                        "<td><a href='javascript:;' class='to_group_info'>查看</a></td>" +
                        "</tr>";
                });
                $(".group_list").html(tr);
            }
        },
        error: function (res) {
            ErrorPrompt(res.errmsg);
        }
    });
});