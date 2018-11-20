$(function () {
    //Get token
    var token = GetCookie('la_token');

    //get ba list
    var api_url = 'ba_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '';
            if (data == false) {
                GetDataEmpty('baList', '5');
                return;
            }

            $("#baListTable").DataTable({
                destroy: true,
                deferRender: true,
                lengthMenu: [ 10, 20, 50, 70, 100 ],
                searching:false,//是否显示搜索框
                info:false,//是否显示表左下角文字
                language: {
                    paginate: {
                        url: "dataTables.german.lang",
                        first:"<<",
                        previous: "<",
                        next: ">",
                        last:">>",
                        loadingRecords:"Please wait - loading..",
                    }
                },
                data:data,
                columns:[
                    {"data":"ba_id", className:"us_id jump"},
                    {"data":"ba_type"},
                    {"data":"ba_level"},
                    {"data":"security_level"},
                    {"data":"ctime"}
                ],
            });

            // $.each(data, function (i, val) {
            //     tr += '<tr class="baListItem">' +
            //         '<td><a href="javascript:;" class="ba_id">' + data[i].ba_id + '</a></td>' +
            //         '<td><a href="javascript:;" class="ba_type">' + data[i].ba_type + '</a></td>' +
            //         '<td>' + data[i].ba_level + '</td>' +
            //         '<td>' + data[i].security_level + '</td>' +
            //         '<td>' + data[i].ctime + '</td>' +
            //         '</tr>'
            // });
            //
            // $('#baList').html(tr);
        }
    }, function (response) {
        GetDataFail('baList', '5');
        LayerFun(response.errcode);
        return;
    });

    //Jump user details
    $(document).on('click', '.ba_id', function () {
        var ba_id = $(this).text(), ba_type = $(this).parents('.baListItem').find('.ba_type').text();
        window.location.href = 'baInfo.html?ba_id=' + ba_id + '&ba_type=' + ba_type;
    })
});