//get token
var token = GetCookie("robot_token");

//获取任务列表
function GetTaskListFun() {
    // layui方法
    layui.use(['table', 'form', 'layer', 'vip_table'], function () {

        // 操作对象
        var form = layui.form
            , table = layui.table
            , layer = layui.layer
            , vipTable = layui.vip_table
            , $ = layui.jquery;
        // 表格渲染
        var tableIns = table.render({
            elem: '#dateTable',                 //指定原始表格元素选择器（推荐id选择器）,
            // minWidth: 100,
            height: vipTable.getFullHeight(),    //容器高度,
            cols: [[                  //标题栏
                {checkbox: true, sort: true, fixed: true, space: true}
                , {field: 'id', title: 'id', width: 0}
                , {field: 'time', title: '时间', width: 280}
                , {field: 'content', title: '内容', width: 380}
                , {field: 'name', title: '群主', width: 100}
                , {fixed: 'right', title: '操作', width: 200, align: 'center', toolbar: '#barOption'} //这里的toolbar值是模板元素的选择器
            ]],
            page: true,
            id: 'dataCheck',
            url: 'http://ccvt_test.fnying.com/api/bot_web/timer_list.php?token=' + encodeURIComponent(token),
            method: 'get',
            limits: [10, 30, 50, 70, 100],
            limit: 30,//默认采用30,
            loading: true,

            done: function (res, curr, count) {
                //如果是异步请求数据方式，res即为你接口返回的信息。
                //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                // console.log(res);

                //得到当前页码
                // console.log(curr);

                //得到数据总量
                // console.log(count);
            }
        });

        // 获取选中行
        table.on('checkbox(dataCheck)', function (obj) {
            layer.msg('123');
            console.log(obj.checked); //当前是否选中状态
            console.log(obj.data); //选中行的相关数据
            console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        });

        // 刷新
        $('#btn-refresh').on('click', function () {
            tableIns.reload();
        });
    });
}

GetTaskListFun();

$(function () {
    var taskSubBtn = "";
    //编辑任务
    $(document).on("click", ".taskEditBtn", function () {
        var timer_id = $(this).parents("td").siblings("td[data-field='id']").children().text();
        var taskContent = $(this).parents("td").siblings("td[data-field='content']").children().text();
        var taskTime = $(this).parents("td").siblings("td[data-field='time']").children().text();
        var taskGroupName = $(this).parents("td").siblings("td[data-field='name']").children().text();

        var index = layer.open({
            type: 2,
            title: '编辑',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: '../html/edit_task.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);

                //get group name
                var groupNameInput = body.find("#groupNameInput");
                groupNameInput.val(taskGroupName);

                //获取时间输入框
                var timeInput = body.find("#time");
                timeInput.val(taskTime);

                //获取内容输入框
                var contentInput = body.find("#content");
                contentInput.val(taskContent);


                //获取提交按钮
                taskSubBtn = body.find("#taskSubBtn");

                //提交编辑信息
                taskSubBtn.click(function () {
                    var time = timeInput.val(),
                        content = contentInput.val();
                    EditTask(token, timer_id, time, content, function (response) {
                        if (response.errcode == "0") {
                            layer.close(index);
                            GetTaskListFun();
                        }
                    }, function (response) {
                        console.log(response);
                    })
                })

            }
        });
    });

    //删除任务
    $(document).on("click", ".taskDelBtn", function () {
        var timer_id = $(this).parents("td").siblings("td[data-field='id']").children().text();

        //确认删除提示
        layer.confirm('确认删除?', {
            btn: ['取消', '确认'] //按钮
        }, function () {
            layer.msg('已取消', {icon: 1});
        }, function () {
            console.log("666");
            DelTask(token, timer_id, function (response) {
                if (response.errcode == "0") {
                    layer.msg('删除成功', {icon: 1});
                    GetTaskListFun();
                }
            }, function (response) {
                layer.msg('删除失败', {icon: 2});
            })
        });
    });

    //添加任务信息
    $(".addTaskBtn").click(function () {
        var index = layer.open({
            type: 2,
            title: '编辑',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: '../html/add_task.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);

                //get group name
                var groupNameSelect = body.find("#groupNameSelect");
                var ddSelect = body.find(".layui-anim.layui-anim-upbit");
                var selectInput = body.find(".layui-input.layui-unselect");
                GetGroupList(token, function (response) {
                }, function (response) {
                    var groupList = response.data;
                    $.each(groupList, function (i, val) {
                        groupNameSelect.append("<option value='"+ val.id +"'>"+ val.name +"</option>");
                        ddSelect.append("<dd lay-value='"+ val.id +"' class='selectChildren'>"+ val.name +"</dd>");
                    });
                    layui.use('form', function () {
                        var form = layui.form;
                        form.render("select");
                    });
                });

                //监听下拉框
                $(body).on("click", ".selectChildren", function () {
                    $(this).siblings().removeClass("layui-this");
                    $(this).addClass("layui-this");
                    selectInput.val($(this).text());
                    selectInput.attr("name", $(this).attr("lay-value"));
                    console.log($(this).attr("lay-value"));
                    console.log($(this).text());
                });

                //获取时间输入框
                var timeInput = body.find("#time");

                //获取内容输入框
                var contentInput = body.find("#content");

                //获取提交按钮
                taskSubBtn = body.find("#taskSubBtn");

                //提交添加信息
                taskSubBtn.click(function () {
                    var time = timeInput.val(),
                        content = contentInput.val(),
                        group_id = "30";
                    AddTask(token, time, group_id, content, function (response) {
                        if (response.errcode == "0") {
                            layer.close(index);
                            GetTaskListFun();
                        }
                    }, function (response) {
                        console.log(response);
                    })
                })

            }
        });
    })
});