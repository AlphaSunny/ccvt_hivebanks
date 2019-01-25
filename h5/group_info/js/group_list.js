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
                // $.each(data, function (i, val) {
                //     if (data[i].id == "1") {
                //         li = "<li class='group_item active' name='" + data[i].id + "'>" + data[i].name + "</li>"
                //     } else {
                //         li += "<li class='group_item' name='" + data[i].id + "'>" + data[i].name + "</li>"
                //     }
                // });
                // $(".group_item_box").html(li);
            }
        },
        error: function (res) {
            ErrorPrompt(res.errmsg);
        }
    });
});