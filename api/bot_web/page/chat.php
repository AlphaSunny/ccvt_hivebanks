<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/chat.css">
    <title>聊天记录</title>
</head>

<body>
<div class="suc_zan"><img class="zan_cai_img" zan_data_src="img/suc_zan.gif" cai_data_src="img/suc_cai.gif" src=""
                          alt=""></div>
<?php
require_once '../../inc/common.php';
ini_set("display_errors", "off");
$args = array('datetime');
chk_empty_args('GET', $args);
$db = new DB_COM();
$datetime = base64_decode(get_arg_str('GET', 'datetime'));
$group_name = base64_decode(get_arg_str('GET', 'group_name'));
$day_start = date($datetime . ' 00:00:00');
$day_end = date($datetime . ' 23:59:59');

$status = base64_decode(get_arg_str('GET', 'status'));

$group_name2 = urlencode(base64_encode($group_name));

$json_string = file_get_contents('../../h5/assets/json/config_url.json');
$data = json_decode($json_string, true);
$url = $data['api_url'] . "/api/bot_web/page/statistical.php?datetime=" . base64_encode($datetime) . "&group_name=" . $group_name2 . "&status=" . base64_encode(2);
?>
<div id="chat">
    <p class="text-center title"><?php echo base64_decode($_REQUEST['group_name']); ?>(<?php echo $datetime; ?>)</p>

        <div class="backStatistics_box login_right_box">
            <a href="javascript:;" class="backStatistics login">登录</a>
            <span class="amount_box">
                余额:
                <span class="amount"></span>
            </span>
        </div>
    <?php if ($status != 1) { ?>
        <div class="backStatistics_box">
            <a href="javascript:;" class="backStatistics">奖励统计</a>
        </div>
    <?php } ?>
    <ul class="chatList">
        <?php
        $unit = get_la_base_unit();

        $nickname = $_GET['nikename'];
        $tblPrefix = "@AI大白~";
        $tblPrefix2 = "@小助手";
        $sql = "select b.bot_nickname,b.bot_content,b.bot_send_time,b.head_img,b.type,b.bot_create_time,b.wechat,(select us_id from us_base WHERE wechat=b.wechat limit 1) as us_id from bot_message as b WHERE b.group_name='{$group_name}' AND (b.bot_content NOT LIKE '$tblPrefix%' OR b.bot_content NOT LIKE '$tblPrefix2%') AND (b.bot_nickname!='风赢小助手' OR b.bot_nickname!='小助手') AND b.bot_send_time BETWEEN '{$day_start}' AND '{$day_end}'";
        if ($nickname) {
            $sql .= " AND b.bot_nickname LIKE '$nickname%'";
        }
        $sql .= " ORDER BY b.bot_create_time  ASC ";
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
                        <p class="name">
                            <span class="chat_name"><?php echo $v['bot_nickname'] ?></span>
                            <?php if ($v['us_id']!=NULL && $status!=1){?>
                            <span class="zan_cai_box com_zan_cai_box">
                                <span class="zan_img_box">
<!--                                    <span class="zan_count">123</span>-->
                                    <img src="img/zan.svg" alt="">
                                </span>
                                <span class="cai_img_box">
                                    <img src="img/cai.svg" alt="">
<!--                                    <span class="cai_count">321</span>-->
                                </span>
                                <span class="us_id none"><?php echo $v['us_id'];?></span>
                            </span>
                            <?php }?>
                        </p>
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

    <div style="margin-top: 50px; padding-left: 15px; padding-right: 15px">
        <?php
        $s_time = strtotime(date('Y-m-d 00:00:00'), time());
        $e_time = strtotime(date('Y-m-d 23:59:59'), time());
        $sql = "select bot_nickname,count(bot_message_id) as count,(select us_id from us_base where wechat=bot_nickname limit 1) as us_id from bot_message WHERE group_name='{$group_name}' AND (bot_content NOT LIKE '$tblPrefix%' OR bot_content NOT LIKE '$tblPrefix2%') AND (bot_nickname!='风赢小助手' OR bot_nickname!='小助手') AND bot_send_time BETWEEN '{$day_start}' AND '{$day_end}' group by `bot_nickname` order by count desc";
        $db->query($sql);
        $rows = $db->fetchAll();
        $count = count($rows);
        ?>
        <p>参与发言人数:<?php echo $count; ?>人</p>
        <table id="tellUserAccount" cellspacing="0">
            <thead>
            <tr>
                <th style="text-align: left">昵称</th>
                <th>发言数</th>
                <?php if ($status != 1) { ?>
                <th>赞/踩</th>
                <?php }?>
            </tr>
            </thead>
            <tbody>
            <?php
            foreach ($rows as $k => $v) {

                ?>
                <tr>
                    <td style="text-align: left"><?php echo $v['bot_nickname']; ?>:</td>
                    <td><?php echo $v['count']; ?></td>
                    <?php if ($status != 1) { ?>
                    <td class="com_zan_cai_box">
                        <?php if ($v['us_id']!=NULL){ ?>
                        <button class="chat_zan_btn"><img src="img/zan.svg" alt=""><span class="bottom_zan_num">
                                <?php
                                $sql = "select sum(tx_amount)/'{$unit}' as zan from us_glory_integral_change_log WHERE debit_id='{$v['us_id']}' AND state=1 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                                $db->query($sql);
                                $zan = $db->getField($sql, 'zan');
                                if (!$zan) {
                                    $zan = 0;
                                }
                                echo $zan;
                                ?>
                            </span></button>&nbsp;|&nbsp;
                        <button class="chat_cai_btn"><img src="img/cai.svg" alt=""><span class="bottom_cai_num">
                                    <?php
                                        $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$v['us_id']}' AND state=2 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                                        $db->query($sql);
                                        $all_am = $db->getField($sql, 'all_am');
                                        if (!$all_am) {
                                            $all_am = 0;
                                        }
                                        echo $all_am;
                                    ?>
                                </span></button>
                        <span class="us_id none"><?php echo $v['us_id'];?></span>
                        <?php }?>
                    </td>
                    <?php }?>

                </tr>
            <?php } ?>
            </tbody>
        </table>
    </div>
</div>

<!--modal-->
<div class="c-float-popWrap confirmMode hiden" style="opacity: 1; top: 264px; left: 28px;">
    <div class="weui_mask_transparent"></div>
    <div class="c-float-modePop">
        <div class="warnMsg zan_title">点赞👍数量</div>
        <div class="warnMsg cai_title">踩👎数量</div>
        <div class="content">
            <label>数量：<input class="confirm_input" value="5" placeholder="请输入点赞数量"></label>
            <p class="zan_text">点赞功能将扣除对应数量的ccvt,对方将获取荣耀积分</p>
            <p class="cai_text">踩功能将扣除对应数量的ccvt,对方将减少荣耀积分</p>
            <p>
                <!--赞上限-->
                <span class="zan_top">每日上限
                                        <?php
                                        echo get_praise_pointon_maxnum()['max_give_like'];
                                        ?>ccvt
                </span>

                <!--踩上限-->
                <span class="cai_top">每日上限
                                        <?php
                                        echo get_praise_pointon_maxnum()['max_give_no_like'];
                                        ?>ccvt
                </span>

                <!--已赞数量-->
                <span class="margin-left-5 zan_num">已点赞
                    <span class="already_zan_count" style="color: #333333">
                        <?php
                        $s_time = strtotime(date('Y-m-d 00:00:00'), time());
                        $e_time = strtotime(date('Y-m-d 23:59:59'), time());
                                        $us_id = $_COOKIE['statistics_user_id'];
                                        if ($us_id){
                                            $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=1 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                                            $db->query($sql);
                                            $all_am = $db->getField($sql,'all_am');
                                            if (!$all_am){$all_am=0;}
                                            echo $all_am;
                                        }
                                                ?>
                    </span>ccvt
                </span>

                <!--已踩数量-->
                <span class="margin-left-5 cai_num">已踩
                    <span class="already_cai_count" style="color: #333333">
                        <?php
                                                $us_id = $_COOKIE['statistics_user_id'];
                                                if ($us_id){
                                                    $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=2 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                                                    $db->query($sql);
                                                    $all_am = $db->getField($sql,'all_am');
                                                    if (!$all_am){$all_am=0;}
                                                    echo $all_am;
                                                }
                       ?>
                    </span>ccvt
                </span>
            </p>
        </div>
        <div class="doBtn">
            <button class="cancel">取 消</button>
            <button class="ok">确 定</button>
        </div>
    </div>
</div>

<!--loading-->
<div id='mySpin'></div>

<!--modal-->
<div class="web_toast">
    <div class="cx_mask_transparent"></div>
    <div class="web_toast_text"></div>
</div>

<!--top-->
<div id="top">
    <span>⬆</span>
</div>

<!--to bottom-->
<div id="bottom">
    <span>跳转底部</span>
</div>

<script src="js/jquery.min.js"></script>
<script src="js/spin.min.js"></script>
<script src="js/common.js"></script>
<script src="js/chat.js"></script>

</body>
</html>