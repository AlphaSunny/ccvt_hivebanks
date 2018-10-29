<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>统计列表</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/statistical.css">
</head>
<body>
<section id="statistical">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h3>聊天发币统计</h3>
                <div>
                    <?php
                        require_once '../../inc/common.php';
                        ini_set("display_errors", "off");
                        $args = array('datetime');
                        chk_empty_args('GET', $args);
                        $db = new DB_COM();
                        $datetime = base64_decode(get_arg_str('GET', 'datetime'));
                        $group_name = base64_decode(get_arg_str('GET', 'group_name'));
                        $day_start = strtotime(date($datetime.' 00:00:00'));
                        $day_end = strtotime(date($datetime.' 23:59:59'));

                        $sql = "select sum(num) as all_send_ccvt from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                        $db->query($sql);
                        $all_send_ccvt = $db->getField($sql,all_send_ccvt); //总赠送ccvt数量

                        $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                        $db->query($sql);
                        $all_message = $db->getField($sql,all_message); //总聊天数量
                    ?>
                    <p>时间:<?php echo $datetime;?></p>
                    <p>今日发币总数量:<?php echo $all_send_ccvt;?>(CCVT)</p>
                    <p>今日发言总数量:<?php echo $all_message;?>(条)</p>

                </div>

                <div class="table-responsive">
                    <table class="table" id="statisticalTable">
                        <thead>
                        <tr>
                            <th>排名</th>
                            <th class="text-center">名称</th>
                            <th class="text-center">拥有数量(CCVT)</th>
                            <th class="text-center">今日获得(CCVT)</th>
                            <th class="text-center">今日发言数</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                            $sql = "select * from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY num DESC ";
                            $db->query($sql);
                            $list = $db->fetchAll();
                            foreach ($list as $k=>$v){
                        ?>
                        <tr>
                            <td><?php if ($k==0){?>
                                    🥇
                                <?php }elseif($k==1){?>
                                    🥈
                                <?php }elseif($k==2){?>
                                    🥉
                                <?php }else{ echo $k;}?>
                            </td>
                            <td><?php echo $v['wechat'];?></td>
                            <td>
                                <?php
                                    $sql = "select unit from la_base limit 1";
                                    $db->query($sql);
                                    $unit = $db->getField($sql,'unit');
                                    $sql = "select base_amount from us_base WHERE us_id='{$v['us_id']}'";
                                    $db->query($sql);
                                    $base_amount = $db->getField($sql,'base_amount')/$unit;
                                    echo $base_amount;
                                ?>
                            </td>
                            <td><?php echo $v['num'];?></td>
                            <td>
                                <?php
                                   $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='测试2' AND wechat='{$v['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                                   $db->query($sql);
                                   $count = $db->getField($sql,'all_message');
                                   echo $count;
                                ?>
                            </td>
                        </tr>
                        <?php }?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>