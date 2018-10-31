<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <title>聊天记录</title>
</head>
<body>
<div id="chat">
    <p class="text-center title"><?php echo base64_decode($_REQUEST['group_name']);?></p>
    <ul class="chatList">
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

        $tblPrefix = "@风赢小助手";
        $tblPrefix2 = "@小助手";
        $sql = "select bot_nickname,bot_content,bot_send_time,head_img,type from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time  ASC ";
        $db->query($sql);
        $rows = $db->fetchAll();
        $ti = -1;
        foreach ($rows as $k=>$v){
        ?>
        <li class="chatItem">
            <?php
                if($ti!=-1 && ($v['bot_create_time']-$ti)>60){
            ?>
            <div class="text-center timeBox">
                <span class="time"><?php echo $v['bot_send_time'];?></span>
            </div>
            <?php
                }
                $ti = $v['bot_create_time'];
            ?>

            <div class="infoBox flex">
                <div class="photo">
                    <img src="http://52.53.151.223:8000/<?php echo $v['head_img']?>" alt="">
                </div>
                <div class="chatInfo">
                    <p class="name"><?php echo $v['bot_nickname']?></p>
                    <p class="chatContent">
                        <?php
                           if($v['type']=="Picture"){
                        ?>
                        <img src="<?php echo $v['bot_content']?>" style="width: 100%;height: 150px">
                        <?php
                           }elseif($v['type']=="Video" || $v['type']=="Recording"){
                        ?>
                               <audio id="audioplayer" preload="auto" controls style="width:150%;" >
                                   <source src="<?php echo $v['bot_content']?>" type="audio/mp3">
                               </audio>
                        <?php
                           }else{
                        ?>
                          <?php echo $v['bot_content']?>
                        <?php
                        }
                        ?>
                    </p>
                </div>
            </div>
        </li>
        <?php
        } ?>
    </ul>

    <ul style="margin-top: 50px;">
        <?php

            $sql = "select bot_nickname,count(bot_message_id) as count from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by `bot_nickname` order by count desc";
            $db->query($sql);
            $rows = $db->fetchAll();
            $count = count($rows);
        ?>
        <li>参与发言人数:<?php echo $count;?>人</li>
        <?php
           foreach ($rows as $k=>$v){
        ?>
          <li><?php echo $v['bot_nickname'];?>:<?php echo $v['count'];?>发言</li>
        <?php } ?>


    </ul>
</div>
</body>
</html>