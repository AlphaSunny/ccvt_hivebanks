$(function () {
    //get token
    var token = GetCookie('la_token');

    //get user list
    var api_url = 'user_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, tr = '';
            if(data == false){
                GetDataEmpty('userList', '4');
            }

            // $("#userListTable").DataTable({
            //     destroy: true,
            //     deferRender: true,
            //     lengthMenu: [ 10, 20, 50, 70, 100 ],
            //     searching:false,//是否显示搜索框
            //     info:false,//是否显示表左下角文字
            //     language: {
            //         paginate: {
            //             url: "dataTables.german.lang",
            //             first:"<<",
            //             previous: "<",
            //             next: ">",
            //             last:">>",
            //             loadingRecords:"Please wait - loading..",
            //         }
            //     },
            //     data:data,
            //     columns:[
            //         {"data":"us_id", className:"us_id jump"},
            //         {"data":"us_level"},
            //         {"data":"security_level"},
            //         {"data":"ctime"},
            //     ],
            // });

            $.each(data, function (i, val) {
                tr+='<tr>' +
                    '<td><a href="javascript:;" class="us_id">'+ data[i].us_account +'</a></td>' +
                    '<td class="none">'+ data[i].us_id +'</td>' +
                    '<td>'+ data[i].us_level +'</td>' +
                    '<td>'+ data[i].security_level +'</td>' +
                    '<td>'+ data[i].ctime +'</td>' +
                    '</tr>'
            });
            $('#userList').html(tr);
        }
    }, function (response) {
        GetDataFail('userList', '4');
        LayerFun(response.errcode);
    });

    //Jump user details
    $(document).on('click', '.us_id', function () {
        var us_id = $(this).text();
        window.location.href = 'userInfo.html?us_id=' + us_id;
    })
});