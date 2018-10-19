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
    <h3>定时任务列表</h3>
    <a href="edit.php" style="text-align: right">添加任务</a>&nbsp;&nbsp;&nbsp;
    <a href="group.php" style="text-align: right">群组列表</a>&nbsp;&nbsp;&nbsp;
    <a href="date.php" style="text-align: right">日期设置</a>
    <table width="100%" id="ListArea" border="0" class="t1" align="center" cellpadding="0"
           cellspacing="0">
        <tr align="center">
            <th style="width: 10%">
                时间
            </th>
            <th style="width: 60%">
                内容
            </th>
            <th style="width: 20%">
                群组
            </th>
            <th style="width: 10%">
                操作
            </th>

        </tr>
        <?php
            require_once '../../inc/common.php';
            $db = new DB_COM();
            ini_set("display_errors", "off");
            $id = intval($_GET['id']);
            if ($id){
//                $sql = "delete from bot_timer WHERE id='{$id}'";
                $sql = "update bot_timer set is_del=1 WHERE id='{$id}'";
                $db->query($sql);
                $count = $db -> affectedRows();
                if ($count){
                    echo "<script type='text/javascript'> alert('sucess');window.location.href='timer.php'; </script>";
                }else{
                    echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
                }
            }else{
                $sql = "select a.*,b.name from bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0 ORDER BY a.group_id,a.time ASC ";
                $db->query($sql);
                $rows = $db->fetchAll();
                foreach ($rows as $k=>$v){
        ?>
        <tr align="center">
            <td>
                <?php echo $v['time']?>
            </td>
            <td>
                <?php echo $v['content']?>
            </td>
            <td>
                <?php echo $v['name']?>
            </td>
            <td>
                <a href="edit.php?id=<?php echo $v['id']?>">修改</a>
                <a href="timer.php?id=<?php echo $v['id']?>" onclick="return confirm('确定删除该记录吗?')">删除</a>
            </td>
        </tr>
     <?php }} ?>
    </table>
</body>