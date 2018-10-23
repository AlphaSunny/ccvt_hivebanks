//get token
var token = GetCookie("robot_token");

function GetGroupListFun(){
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
                , {field: 'name', title: '名称', width: 280}
                , {field: 'ba_id', title: 'ba_id', width: 380}
                , {field: 'del', title: '状态', width: 100}
                , {field: 'is_del', title: '是否开启状态', width: 100}
                , {field: 'flirt', title: '调戏功能', width: 100}
                , {field: 'is_flirt', title: '是否开启调戏功能', width: 100}
                , {fixed: 'right', title: '操作', width: 240, align: 'center', toolbar: '#barOption'} //这里的toolbar值是模板元素的选择器
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
    var subBtn = "";

    //edit
    $(document).on("click", ".editBtn", function () {
        var group_id = $(this).parents("td").siblings("td[data-field='id']").children().text();
        var group_name = $(this).parents("td").siblings("td[data-field='name']").children().text();
        var is_del = $(this).parents("td").siblings("td[data-field='is_del']").children().text();
        var is_flirt = $(this).parents("td").siblings("td[data-field='is_flirt']").children().text();
        var index = layer.open({
            type: 2,
            title: '编辑',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            // content: '../html/edit_group.html?groupName=' + groupName + 'is_del' + is_del + 'is_flirt' + is_flirt,
            content: '../html/edit_group.html',
            success:function (layero,index) {
                var body = layer.getChildFrame('body',index);
                // var iframeWin = window[layero.find('iframe')[0]['name']];

                //get group name
                var groupNameInput = body.find("#groupNameInput");
                groupNameInput.val(group_name);

                //获取运行状态开关
                var operating = body.find(".operating");
                if(is_del == 1){
                    operating.attr("checked", true);
                    operating.val("1");
                    operating.siblings(".layui-form-switch").addClass("layui-form-onswitch")
                }

                //获取调戏功能开关
                var opts = body.find(".opts");
                if(is_flirt == 1){
                    opts.attr("checked", true);
                    opts.val("1");
                    opts.siblings(".layui-form-switch").addClass("layui-form-onswitch")
                }

                //获取提交按钮
                subBtn = body.find("#subBtn");
                subBtn.click(function () {
                    var del = "1";
                    var flirt = "1";
                    EditGroup(token, group_name, del, flirt, group_id, function (response) {
                        if(response.errcode == "0"){
                            layer.close(index);
                            GetGroupListFun();
                        }
                    },function (response) {
                        console.log(response);
                    })
                })

            }
        });
    });
});