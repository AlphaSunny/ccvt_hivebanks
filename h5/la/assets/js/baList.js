$(function () {
    //Get token
    let token = GetCookie('la_token');

    //get ba list
    let api_url = 'ba_list.php', limit = 10, offset = 0;
    function GetUserListFun (limit, offset){
        let totalPage = "", count = "", tr = "";
        GetUserList(token, api_url, limit, offset, function (response) {
            if (response.errcode == '0') {
                let data = response.rows;
                if (data == false) {
                    GetDataEmpty('baList', '5');
                    return;
                }

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
                    tr += '<tr class="baListItem">' +
                        '<td><a href="javascript:;" class="ba_account">' + data[i].ba_account + '</a><span class="ba_id none">' + data[i].ba_id + '</span></td>' +
                        '<td><a href="javascript:;" class="ba_type">' + data[i].ba_type + '</a></td>' +
                        '<td>' + data[i].ba_level + '</td>' +
                        '<td>' + data[i].security_level + '</td>' +
                        '<td>' + data[i].ctime + '</td>' +
                        '</tr>'
                });

                $('#baList').html(tr);

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
            GetDataFail('baList', '5');
            LayerFun(response.errcode);
            return;
        });
    }
    GetUserListFun(limit, offset);

    //Jump user details
    $(document).on('click', '.ba_account', function () {
        let ba_id = $(this).siblings(".ba_id").text(), ba_type = $(this).parents('tr').find('.ba_type').text();
        window.location.href = 'baInfo.html?ba_id=' + ba_id + '&ba_type=' + ba_type;
    })
});