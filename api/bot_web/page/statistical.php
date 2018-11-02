<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>统计列表</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/swiper.min.css">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/statistics.css">
    <script src="js/swiper.min.js"></script>
</head>

<body>
<div class="box">
    <div class="img_box">
        <img src="img/more.svg" alt="">
    </div>
    <ul class="more_box">
        <li><a href="javascript:;" id="register">注册</a></li>
        <li><a href="javascript:;" id="login">登录</a></li>
    </ul>
</div>
<div class="swiper-container">
    <div class="swiper-wrapper">
        <section id="statistical" class="swiper-slide">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h3>CCVT奖励统计</h3>
                        <div class="margin-bottom-2">
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

                            $sql = "select sum(num) as all_send_ccvt from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                            $db->query($sql);
                            $all_send_ccvt = $db->getField($sql, all_send_ccvt); //总赠送ccvt数量

                            $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                            $db->query($sql);
                            $all_message = $db->getField($sql, all_message); //总聊天数量
                            ?>
                            <div class="sm_title_text_color">
                                <p>所属群:《风赢科技绝密小锋队》</p>
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
                                        <!--                            <td>--><?php //if ($k==0){
                                        ?>
                                        <!--                                    🥇-->
                                        <!--                                --><?php //}elseif($k==1){
                                        ?>
                                        <!--                                    🥈-->
                                        <!--                                --><?php //}elseif($k==2){
                                        ?>
                                        <!--                                    🥉-->
                                        <!--                                --><?php //}else{ echo $k;}
                                        ?>
                                        <!--                            </td>-->
                                        <td><?php echo $v['wechat']; ?></td>
                                        <!--                            <td>-->
                                        <!--                                --><?php
                                        //                                    $sql = "select unit from la_base limit 1";
                                        //                                    $db->query($sql);
                                        //                                    $unit = $db->getField($sql,'unit');
                                        //                                    $sql = "select base_amount from us_base WHERE us_id='{$v['us_id']}'";
                                        //                                    $db->query($sql);
                                        //                                    $base_amount = $db->getField($sql,'base_amount')/$unit;
                                        //                                    echo $base_amount;
                                        //
                                        ?>
                                        <!--                            </td>-->
                                        <td><?php echo $v['num']; ?></td>
                                        <td>
                                            <?php
                                            $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='测试2' AND wechat='{$v['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
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

        <section class="swiper-slide">
            <div id="chat">
                <p class="text-center title"><?php echo base64_decode($_REQUEST['group_name']); ?></p>
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
                    $sql = "select bot_nickname,bot_content,bot_send_time,head_img,type from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time  ASC ";
                    $db->query($sql);
                    $rows = $db->fetchAll();
                    $ti = -1;
                    foreach ($rows as $k => $v) {
                        ?>
                        <li class="chatItem">
                            <?php
                            if ($ti != -1 && ($v['bot_create_time'] - $ti) > 60) {
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
                                <div class="infoNameBox">
                                    <p class="name"><?php echo $v['bot_nickname'] ?></p>
                                    <div class="chatInfo">
                                        <p class="chatContent">
                                            <?php
                                            if ($v['type'] == "Picture") {
                                                ?>
                                                <img src="<?php echo $v['bot_content'] ?>"
                                                     style="width: 100%;height: 150px">
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

                            </div>
                        </li>
                        <?php
                    } ?>
                </ul>
            </div>
        </section>

    </div>
    <script>
        var mySwiper = new Swiper(".swiper-container", {
            loop: true
        });
    </script>
    <script src="js/jquery.min.js"></script>
    <script>
        $(function () {
            function getRootPath() {
                //Get current URL
                var curWwwPath = window.document.location.href;
                //Get the directory after the host address
                var pathName = window.document.location.pathname;
                var pos = curWwwPath.indexOf(pathName);
                //Get the host address
                var localhostPath = curWwwPath.substring(0, pos);
                //Get the project name with "/"
                var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                return localhostPath;
            }

            var url = getRootPath();
            $(".img_box").click(function () {
                $(".more_box").slideToggle();
                if($(this).hasClass('clickActive')){
                    $(this).removeClass("clickActive");
                }else {
                    $(this).addClass("clickActive");
                }
            });

            $("#register").click(function () {
                window.location.href = url + "/h5/user/register.html";
            });
            $("#login").click(function () {
                window.location.href = url + "/h5/user/login.html";
            })
        });
    </script>
</body>
</html>