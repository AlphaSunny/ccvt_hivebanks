$(function () {
    // token
    var token = GetCookie('robot_token');
    var username = GetCookie('robot_username');
    $("#acout").text(username);
    console.log(token)



    //获取id
    var group_id = GetRequest()["group_id"];
    if (group_id){
        GetGroupInfo(token,group_id,  function (response) {

            if (response.errcode == '0') {
                $("#name").val(response.row['name']);
                $("#group_id").val(response.row['id']);
                if (response.row['is_del']=='1'){
                    $("#del1").attr("checked",true);
                    $("#del2").attr("checked",false);
                }else{
                    $("#del2").attr("checked",true);
                    $("#del1").attr("checked",false);
                }
                if (response.row['is_flirt']=='1'){
                    $("#flirt1").attr("checked",true);
                    $("#flirt2").attr("checked",false);
                }else{
                    $("#flirt2").attr("checked",true);
                    $("#flirt1").attr("checked",false);
                }

            }
        }, function (response) {
            console.log(response)
        });
    }

    //获取url参数
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }



    function GetGroupList(token) {
        var tr = '';
        GroupList(token,  function (response) {
            if (response.errcode == '0') {
                var data = response.rows;

                $.each(data, function (i, val) {
                    tr += '<tr align="center">' +
                        '<td>'+ data[i].name +'</td>' +
                        '<td>' + data[i].ba_id + '</td>' +
                        '<td>' + data[i].del + '</td>' +
                        '<td>' + data[i].flirt + '</td>' +
                        '<td><a href="../bot_web/edit_group.html?group_id=' + data[i].id + '" >编辑</a></td>' +
                        '</tr>'
                });
                $('.group_list').html(tr);
            }
        }, function (response) {
            console.log(response)
        });
    };
    GetGroupList(token);







    //添加群组
    $('#group_add_submit').click(function () {
        var group_name = $('#name').val();
        var del = $("input[name='del']:checked").val();
        var flirt = $("input[name='flirt']:checked").val();
        if (group_name==''){
            alert('群组名不能为空');
            return false;
        }

        Group_add(token, group_name,del,flirt, function (response) {
            if (response.errcode == '0') {
                window.location.href = 'group.html';
            }
        }, function (response) {
            console.log(response)
        });
    });

    //编辑群组
    $('#group_edit_submit').click(function () {


        var group_id = $('#group_id').val();
        var group_name = $('#name').val();
        var del = $("input[name='del']:checked").val();
        var flirt = $("input[name='flirt']:checked").val();
        if (group_name==''){
            alert('群组名不能为空');
            return false;
        }

        Group_edit(token, group_id, group_name,del,flirt, function (response) {
            console.log(response);
            if (response.errcode == '0') {
                console.log(response)
                window.location.href = 'group.html';
            }
        }, function (response) {
            console.log(response)
        });
    });


});

