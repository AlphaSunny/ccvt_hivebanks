$(function () {
    //Get token
    let token = GetCookie('la_token');

    //Get the list of users
    let api_url = 'ca_list.php', limit = 10, offset = 0;

    function GetUserListFun(limit, offset) {
        let tr = "",totalPage = "",count = "";
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
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><a href="javascript:;" class="ca_account">' + data[i].ca_account + '</a><span class="ca_id none">' + data[i].ca_id + '</span></td>' +
                        '<td>' + data[i].ca_level + '</td>' +
                        '<td>' + data[i].security_level + '</td>' +
                        '<td>' + data[i].ctime + '</td>' +
                        '</tr>'
                });
                $('#caList').html(tr);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        GetUserListFun(limit, (current - 1) * limit);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
            return;
        });
    }

    GetUserListFun(limit, offset);

    //Jump user details
    $(document).on('click', '.ca_account', function () {
        let ca_id = $(this).siblings(".ca_id").text();
        window.location.href = 'caInfo.html?ca_id=' + ca_id;
    })
});