//get token
var robot_token = GetCookie("robot_token");

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
        minWidth: 1216,
        height: 360,
        // height: vipTable.getFullHeight(),    //容器高度,
        cols: [[                  //标题栏
            {checkbox: true, sort: true, fixed: true, space: true}
            , {field: 'time', title: '时间', width: 40 + "%"}
            , {field: 'content', title: '内容', width: 40 + "%"}
            , {field: 'name', title: '群主', width: 40 + "%"}
            , {fixed: 'right', title: '操作', width: 40 + "%", align: 'center', toolbar: '#barOption'} //这里的toolbar值是模板元素的选择器
        ]],
        page: true,
        id: 'dataCheck',
        url: 'http://ccvt_test.fnying.com/api/bot_web/timer_list.php?token=' + encodeURIComponent(robot_token),
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