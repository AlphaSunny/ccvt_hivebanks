<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="css/chat.css">
    <title>聊天记录</title>
</head>

<body>
<!--nav-->
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">CCVT</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li><a href="javascript:;" class="baLogin">BA通道</a></li>
                <li><a href="javascript:;" class="caLogin">CA通道</a></li>
                <li><a href="javascript:;" class="usLogin">用户通道</a></li>
                <li class="accountNone"><a href="javascript:;" class="i18n toAccountBtn alreadyLogin" name="account">Account</a></li>
                <li><a href="javascript:;">查看统计奖励</a></li>
            </ul>
        </div>
    </div>
</nav>
<!--nav-->
<div id="chat">
    <p class="text-center title"><?php echo base64_decode($_REQUEST['group_name']); ?></p>
<!--    <div class="box">-->
<!--        <div class="img_box">-->
<!--            <img src="img/more.svg" alt="">-->
<!--        </div>-->
<!--        <ul class="more_box">-->
<!--            <li><a href="javascript:;" id="register">注册</a></li>-->
<!--            <li><a href="javascript:;" id="login">登录</a></li>-->
<!--        </ul>-->
<!--    </div>-->
    <ul class="chatList">
        <?php
        require_once '../../inc/common.php';
        ini_set("display_errors", "off");
        $args = array('datetime');
        chk_empty_args('GET', $args);
        $db = new DB_COM();
        $datetime = base64_decode(get_arg_str('GET', 'datetime'));
        $group_name = base64_decode(get_arg_str('GET', 'group_name'));
        $day_start = strtotime(date($datetime . ' 00:00:00'));
        $day_end = strtotime(date($datetime . ' 23:59:59'));

        $tblPrefix = "@风赢小助手";
        $tblPrefix2 = "@小助手";
        $sql = "select bot_nickname,bot_content,bot_send_time,head_img,type,bot_create_time from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time  ASC ";
        $db->query($sql);
        $rows = $db->fetchAll();
        $ti = -1;
        foreach ($rows as $k => $v) {
            ?>
            <li class="chatItem">
                <?php
                if ($ti != -1 && ($v['bot_create_time'] - $ti) > 120) {
                    ?>
                    <div class="text-center timeBox">
                        <span class="time"><?php echo $v['bot_send_time']; ?></span>
                    </div>
                    <?php
                }
                $ti = $v['bot_create_time'];
                ?>

                <div class="infoBox flex">
                    <div class="photo">
                        <img src="http://52.53.151.223:8000/<?php echo $v['head_img'] ?>" alt="">
                    </div>
                    <div class="chatInfo">
                        <p class="name"><?php echo $v['bot_nickname'] ?></p>
                        <p class="chatContent">
                            <?php
                            if ($v['type'] == "Picture") {
                                ?>
                                <img src="<?php echo $v['bot_content'] ?>" style="width: 100%;height: 150px">
                                <?php
                            } elseif ($v['type'] == "Video" || $v['type'] == "Recording") {
                                ?>
                                <audio id="audioplayer" preload="auto" controls style="width:150%;">
                                    <source src="<?php echo $v['bot_content'] ?>" type="audio/mp3">
                                </audio>
                                <?php
                            } else {
                                ?>
                                <?php echo $v['bot_content'] ?>
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
        <li>参与发言人数:<?php echo $count; ?>人</li>
        <?php
        foreach ($rows as $k => $v) {
            ?>
            <li><?php echo $v['bot_nickname']; ?>:<?php echo $v['count']; ?>发言</li>
        <?php } ?>


    </ul>
</div>
<script src="js/jquery.min.js"></script>
<script src="js/chat.js"></script>

</body>
</html>