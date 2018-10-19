$(function () {
    // token
    var token = GetCookie('robot_token');
    var username = GetCookie('robot_username');
    $("#acout").text(username);
    console.log(token)



    GetTimerList(token);

    function GetTimerList(token) {
        var tr = '';
        TimerList(token,  function (response) {
            if (response.errcode == '0') {
                var data = response.rows;

                $.each(data, function (i, val) {
                    tr += '<tr align="center">' +
                        '<td>'+ data[i].time +'</td>' +
                        '<td>' + data[i].content + '</span></td>' +
                        '<td>' + data[i].name + '</span></td>' +
                        '<td><a href="../bot_web/edit_timer.html?timer_id=' + data[i].id + '">编辑</a>&nbsp;&nbsp;' +
                        '<a href="javascript:;" onclick="del('+ data[i].id +')">删除</a></td>' +
                        '</tr>'
                });
                $('.timer_list').html(tr);
            }
        }, function (response) {
            console.log(response)
        });
    };




    //群组列表
    function Grouplist(token) {
        var tr = '';
        GroupList(token,  function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                $.each(data, function (i, val) {
                    tr += '<option value="'+data[i].id+'">' + data[i].name + '</option>'
                });
                $('#select_group_list').html(tr);
            }
        }, function (response) {
            console.log(response)
        });
    };
    Grouplist(token);


    //获取id
    var timer_id = GetRequest()["timer_id"];
    if (timer_id){
        GetTimerInfo(token,timer_id,  function (response) {

            if (response.errcode == '0') {
                $("#time").val(response.row['time']);
                $("#timer_id").val(response.row['id']);
                $("#content").val(response.row['content']);


                var numbers = $("#select_group_list").find("option"); //获取select下拉框的所有值
                for (var j = 0; j < numbers.length; j++) {
                    if ($(numbers[j]).val() == response.row['group_id']) {
                        $(numbers[j]).attr("selected", "selected");
                    };
                }
            }
        }, function (response) {
            console.log(response)
        });
    }




    //添加任务
    $('#timer_add_submit').click(function () {

        var time = $('#time').val();
        var group_id= $("#select_group_list").val();
        var content = $('#content').val();
        if (time==''){
            alert('请填写时间');
            time.focus();
            return false;
        }else if (content==''){
            alert('请填写内容');
            content.focus();
            return false;
        }

        TimerAdd(token, time, group_id, content, function (response) {
            if (response.errcode == '0') {
                window.location.href = 'timer.html';
            }
        }, function (response) {
            console.log(response)
        });
    });

    //编辑任务
    $('#timer_edit_submit').click(function () {

        var timer_id = $('#timer_id').val();
        var time = $('#time').val();
        var group_id= $("#select_group_list ").val();
        var content = $('#content').val();
        if (time==''){
            alert('请填写时间');
            time.focus();
            return false;
        }else if (content==''){
            alert('请填写内容');
            content.focus();
            return false;
        }

        Timer_edit(token, timer_id, time,group_id,content, function (response) {
            console.log(response);
            if (response.errcode == '0') {
                console.log(response)
                window.location.href = 'timer.html';
            }
        }, function (response) {
            console.log(response)
        });
    });




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

});

