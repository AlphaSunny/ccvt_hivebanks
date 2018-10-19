<head runat="server">
    <title></title>
    <script src="../Scripts/jquery-1.4.1.min.js" type="text/javascript"></script>
    <style type="text/css">
        .t1
        {
            clear: both;
            border: 1px solid #c9dae4;
        }
        .t1 tr th
        {
            color: #0d487b;
            background: #f2f4f8 url(../CSS/Table/images/sj_title_pp.jpg) repeat-x left bottom;
            line-height: 28px;
            border-bottom: 1px solid #9cb6cf;
            border-top: 1px solid #e9edf3;
            font-weight: normal;
            text-shadow: #e6ecf3 1px 1px 0px;
            padding-left: 5px;
            padding-right: 5px;
        }
        .t1 tr td
        {
            border-bottom: 1px solid #e9e9e9;
            padding-bottom: 5px;
            padding-top: 5px;
            color: #444;
            border-top: 1px solid #FFFFFF;
            padding-left: 5px;
            padding-right: 5px;
            word-break: break-all;
        }

    </style>
</head>
<body>
    <h3>聊天全天开放设置</h3>
    <a href="edit_date.php" style="text-align: right">添加日期</a>&nbsp;&nbsp;&nbsp;
    <a href="group.php" style="text-align: right">群组列表</a>&nbsp;&nbsp;&nbsp;
    <a href="timer.php" style="text-align: right">任务列表</a>
    <table width="100%" id="ListArea" border="0" class="t1" align="center" cellpadding="0"
           cellspacing="0">
        <tr align="center">
            <th>
                时间
            </th>
            <th>
                操作
            </th>

        </tr>
        <?php
            require_once '../../inc/common.php';
            $db = new DB_COM();
            ini_set("display_errors", "off");
            $id = intval($_GET['id']);
            if ($id){
                $sql = "delete from bot_date WHERE id='{$id}'";
                $db->query($sql);
                $count = $db -> affectedRows();
                if ($count){
                    echo "<script type='text/javascript'> alert('sucess');window.location.href='date.php'; </script>";
                }else{
                    echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
                }
            }else{
                $sql = "select * from bot_date ORDER BY intime ASC ";
                $db->query($sql);
                $rows = $db->fetchAll();
                foreach ($rows as $k=>$v){
        ?>
        <tr align="center">
            <td>
                <?php echo $v['date']?>
            </td>
            <td>
                <a href="edit_date.php?id=<?php echo $v['id']?>">修改</a>
                <a href="date.php?id=<?php echo $v['id']?>" onclick="return confirm('确定删除该记录吗?')">删除</a>
            </td>
        </tr>
     <?php }} ?>
    </table>
</body>