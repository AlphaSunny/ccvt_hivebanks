$(function () {
    //get token
    let token = GetCookie('la_token');

    //get user list
    let api_url = 'user_list.php', limit = 10, offset = 0, count = "";

    function GetUserListFun(token, limit, offset) {
        let totalPage = "",tr = "";
        GetUserList(token, api_url, limit, offset, function (response) {
            ShowLoading("hide");
            if (response.errcode == '0') {
                let data = response.rows;
                let total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (data == false) {
                    GetDataEmpty('userList', '4');
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><a href="javascript:;" class="to_us">' + data[i].us_account + '</a></td>' +
                        '<td class="none us_id">' + data[i].us_id + '</td>' +
                        '<td>' + data[i].us_level + '</td>' +
                        '<td>' + data[i].security_level + '</td>' +
                        '<td>' + data[i].ctime + '</td>' +
                        '</tr>'
                });
                $('#userList').html(tr);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetUserListFun(token, limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            GetDataFail('userList', '4');
            LayerFun(response.errcode);
        });
    }

    GetUserListFun(token, limit, offset);


    //Jump user details
    $(document).on('click', '.to_us', function () {
        let us_id = $(this).siblings(".us_id").text();
        console.log(us_id);
        return;
        window.location.href = 'userInfo.html?us_id=' + us_id;
    })
});