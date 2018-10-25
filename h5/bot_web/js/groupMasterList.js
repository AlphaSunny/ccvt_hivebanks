//get token
var token = GetCookie("robot_token");

function GetGroupListFun() {
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
            elem: '#dateTable',
            height: vipTable.getFullHeight(),    //容器高度,
            cols: [[                  //标题栏
                // {checkbox: false, sort: true, fixed: true, space: false}
                , {field: 'id', title: 'id', width: 0}
                , {field: 'name', title: '群名称', width: 200, align: 'center'}
                // , {field: 'ba_id', title: 'ba_id', width: 380}
                , {field: 'del', title: '状态', width: 80, align: 'center'}
                , {field: 'is_del', title: '是否开启状态', width: 80, align: 'center'}
                , {field: 'flirt', title: '调戏功能', width: 120, align: 'center'}
                , {field: 'is_flirt', title: '是否开启调戏功能', width: 0, align: 'center'}
                , {title: '操作', width: 200, align: 'center', toolbar: '#barOption'} //这里的toolbar值是模板元素的选择器
            ]],
            page: true,
            id: 'dataCheck',
            url: 'http://ccvt_test.fnying.com/api/bot_web/group_list.php?token=' + encodeURIComponent(token),
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

GetGroupListFun();

$(function () {
    var subBtn = "", addSubBtn = "";

    //edit
    $(document).on("click", ".editBtn", function () {
        var group_id = $(this).parents("td").siblings("td[data-field='id']").children().text();
        var groupName = $(this).parents("td").siblings("td[data-field='name']").children().text();
        var is_del = $(this).parents("td").siblings("td[data-field='is_del']").children().text();
        var is_flirt = $(this).parents("td").siblings("td[data-field='is_flirt']").children().text();
        var index = layer.open({
            type: 2,
            title: '编辑',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: '../html/edit_group.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);

                //get group name
                var groupNameInput = body.find("#groupNameInput");
                groupNameInput.val(groupName);

                //获取运行状态开关
                var operating = body.find(".operating");
                if (is_del == 1) {
                    operating.attr("checked", true);
                    operating.val("1");
                    operating.siblings(".layui-form-switch").addClass("layui-form-onswitch");
                } else {
                    operating.attr("checked", false);
                    operating.val("2");
                    operating.siblings(".layui-form-switch").removeClass("layui-form-onswitch").children("em").text("OFF");
                }

                operating.siblings(".layui-form-switch").bind("DOMNodeInserted", function () {
                    if (operating.val() == "1") {
                        operating.val("2");
                    } else {
                        operating.val("1");
                    }
                });

                //获取调戏功能开关
                var opts = body.find(".opts");
                if (is_flirt == 1) {
                    opts.attr("checked", true);
                    opts.val("1");
                    opts.siblings(".layui-form-switch").addClass("layui-form-onswitch")
                } else {
                    opts.attr("checked", false);
                    opts.val("2");
                    opts.siblings(".layui-form-switch").removeClass("layui-form-onswitch").children("em").text("OFF");
                }

                opts.siblings(".layui-form-switch").bind("DOMNodeInserted", function () {
                    if (opts.val() == "1") {
                        opts.val("2");
                    } else {
                        opts.val("1");
                    }
                });

                //获取提交按钮
                subBtn = body.find("#subBtn");

                //提交编辑信息
                subBtn.click(function () {
                    var del = operating.val();
                    var flirt = opts.val();
                    var group_name = groupNameInput.val();
                    EditGroup(token, group_name, del, flirt, group_id, function (response) {
                        if (response.errcode == "0") {
                            layer.close(index);
                            GetGroupListFun();
                        }
                    }, function (response) {
                        console.log(response);
                    })
                })

            }
        });
    });

    //add
    $(".groupAddBtn").click(function () {
        var add = layer.open({
            type: 2,
            title: '添加群',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: '../html/add_group.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);

                //get group name
                var addGroupNameInput = body.find("#addGroupNameInput");

                //获取运行状态开关
                var addOperating = body.find(".addOperating");
                addOperating.siblings(".layui-form-switch").bind("DOMNodeInserted", function () {
                    if (addOperating.val() == "1") {
                        addOperating.val("2");
                    } else {
                        addOperating.val("1");
                    }
                });

                //获取调戏功能开关
                var addOpts = body.find(".addOpts");
                addOpts.siblings(".layui-form-switch").bind("DOMNodeInserted", function () {
                    if (addOpts.val() == "1") {
                        addOpts.val("2");
                    } else {
                        addOpts.val("1");
                    }
                });


                //获取提交按钮
                addSubBtn = body.find("#addSubBtn");

                //提交添加信息
                addSubBtn.click(function () {
                    //获取群名称
                    var group_name = addGroupNameInput.val();

                    //获取运行状态
                    var del = addOperating.val();

                    //获取调戏状态
                    var flirt = addOpts.val();

                    AddGroup(token, group_name, del, flirt, function (response) {
                        if (response.errcode == "0") {
                            layer.close(index);
                            GetGroupListFun();
                        }
                    }, function (response) {
                        console.log(response);
                    })
                })

            }
        });
    });
});