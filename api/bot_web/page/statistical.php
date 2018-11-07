<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>统计列表</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/statistics.css">
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
                <li><a href="javascript:;" class="usLogin"></a></li>
                <li class="accountNone"><a href="javascript:;" class="i18n toAccountBtn alreadyLogin" name="account">Account</a></li>

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

                    $json_string = file_get_contents('../../h5/assets/json/config_url.json');
                    $data = json_decode($json_string, true);

                    $group_name2 =  urlencode(base64_encode($group_name));

                    $url = $data['api_url']."/api/bot_web/page/chat.php?datetime=".base64_encode($datetime)."&group_name=".$group_name2."&status=".base64_encode(2);

                ?>
                <li><a href="<?php echo $url;?>">查看聊天记录</a></li>
            </ul>
        </div>
    </div>
</nav>
<!--nav-->
<!--<div class="box">-->
<!--    <div class="img_box">-->
<!--        <img src="img/more.svg" alt="">-->
<!--    </div>-->
<!--    <ul class="more_box">-->
<!--        <li><a href="javascript:;" id="register">注册</a></li>-->
<!--        <li><a href="javascript:;" id="login">登录</a></li>-->
<!--    </ul>-->
<!--</div>-->
<div class="swiper-container">
    <div class="swiper-wrapper">
        <section id="statistical" class="swiper-slide">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h3>CCVT奖励统计</h3>
                        <div class="margin-bottom-2">
                            <?php

                            $sql = "select unit from la_base limit 1";
                            $db->query($sql);
                            $unit = $db->getField($sql,'unit');

                            $sql = "select sum(amount)/'{$unit}' as all_send_ccvt from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                            $db->query($sql);
                            $all_send_ccvt = $db->getField($sql, 'all_send_ccvt'); //总赠送ccvt数量

                            $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                            $db->query($sql);
                            $all_message = $db->getField($sql, 'all_message'); //总聊天数量
                            ?>
                            <div class="sm_title_text_color">
                                <p>所属群:《<?php echo $group_name;?>》</p>
                                <p class="font-size-14">时间:<?php echo $datetime; ?></p>
                            </div>
                            <div class="flex space-between font-size-14 sm_title_text_color">
                                <p>今日奖励总数量:<?php echo $all_send_ccvt; ?>(CCVT)</p>
                                <p>今日发言总数量:<?php echo $all_message; ?>(条)</p>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table" id="statisticalTable">
                                <thead>
                                <tr>
                                    <!--                            <th>排名</th>-->
                                    <th class="text-center">名称</th>
                                    <!--                            <th class="text-center">拥有数量(CCVT)</th>-->
                                    <th class="text-center">获得(CCVT)</th>
                                    <th class="text-center">发言数</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php
                                $sql = "select * from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY num DESC ";
                                $db->query($sql);
                                $list = $db->fetchAll();
                                foreach ($list as $k => $v) {
                                    ?>
                                    <tr>

                                        <td><?php echo $v['wechat']; ?></td>

                                        <td><?php echo $v['amount']/$unit; ?></td>
                                        <td>
                                            <?php
                                            $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND wechat='{$v['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                                            $db->query($sql);
                                            $count = $db->getField($sql, 'all_message');
                                            echo $count;
                                            ?>
                                        </td>
                                    </tr>
                                <?php } ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>

<!--        <section class="swiper-slide">-->
<!--            <div id="chat">-->
<!--                <p class="text-center title">--><?php //echo base64_decode($_REQUEST['group_name']); ?><!--</p>-->
<!--                <ul class="chatList">-->
<!--                    --><?php
//                    require_once '../../inc/common.php';
//                    ini_set("display_errors", "off");
//                    $args = array('datetime');
//                    chk_empty_args('GET', $args);
//                    $db = new DB_COM();
//                    $datetime = base64_decode(get_arg_str('GET', 'datetime'));
//                    $group_name = base64_decode(get_arg_str('GET', 'group_name'));
//                    $day_start = strtotime(date($datetime . ' 00:00:00'));
//                    $day_end = strtotime(date($datetime . ' 23:59:59'));
//
//                    $tblPrefix = "@风赢小助手";
//                    $tblPrefix2 = "@小助手";
//                    $sql = "select bot_nickname,bot_content,bot_send_time,head_img,type from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time  ASC ";
//                    $db->query($sql);
//                    $rows = $db->fetchAll();
//                    $ti = -1;
//                    foreach ($rows as $k => $v) {
//                        ?>
<!--                        <li class="chatItem">-->
<!--                            --><?php
//                            if ($ti != -1 && ($v['bot_create_time'] - $ti) > 60) {
//                                ?>
<!--                                <div class="text-center timeBox">-->
<!--                                    <span class="time">--><?php //echo $v['bot_send_time']; ?><!--</span>-->
<!--                                </div>-->
<!--                                --><?php
//                            }
//                            $ti = $v['bot_create_time'];
//                            ?>
<!---->
<!--                            <div class="infoBox flex">-->
<!--                                <div class="photo">-->
<!--                                    <img src="http://52.53.151.223:8000/--><?php //echo $v['head_img'] ?><!--" alt="">-->
<!--                                </div>-->
<!--                                <div class="infoNameBox">-->
<!--                                    <p class="name">--><?php //echo $v['bot_nickname'] ?><!--</p>-->
<!--                                    <div class="chatInfo">-->
<!--                                        <p class="chatContent">-->
<!--                                            --><?php
//                                            if ($v['type'] == "Picture") {
//                                                ?>
<!--                                                <img src="--><?php //echo $v['bot_content'] ?><!--"-->
<!--                                                     style="width: 100%;height: 150px">-->
<!--                                                --><?php
//                                            } elseif ($v['type'] == "Video" || $v['type'] == "Recording") {
//                                                ?>
<!--                                                <audio id="audioplayer" preload="auto" controls style="width:150%;">-->
<!--                                                    <source src="--><?php //echo $v['bot_content'] ?><!--" type="audio/mp3">-->
<!--                                                </audio>-->
<!--                                                --><?php
//                                            } else {
//                                                ?>
<!--                                                --><?php //echo $v['bot_content'] ?>
<!--                                                --><?php
//                                            }
//                                            ?>
<!--                                        </p>-->
<!--                                    </div>-->
<!--                                </div>-->
<!---->
<!--                            </div>-->
<!--                        </li>-->
<!--                        --><?php
//                    } ?>
<!--                </ul>-->
<!--            </div>-->
<!--        </section>-->

    </div>
<!--    <script>-->
<!--        var mySwiper = new Swiper(".swiper-container", {-->
<!--            loop: true-->
<!--        });-->
<!--    </script>-->
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/statistical.js"></script>
</body>
</html>