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
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/spin.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/statistical.js"></script>
</head>

<body>
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

$group_name2 = urlencode(base64_encode($group_name));

$url = $data['api_url'] . "/api/bot_web/page/chat.php?datetime=" . base64_encode($datetime) . "&group_name=" . $group_name2 . "&status=" . base64_encode(2);

?>
<section id="statistical" class="swiper-slide">
    <div class="container">
        <div class="row title_box">
            <div class="col-md-12 col-sm-12 flex center space-between">
                <h3>CCVT奖励统计</h3>
                <a href="javascript:;" class="login">登录</a>
                <span class="amount_box">
                            余额:
                            <span class="amount"></span>
                        </span>
            </div>
        </div>
        <div class="row margin-top-5">
            <div class="col-md-12">
                <div class="margin-bottom-2">
                    <?php
                    $sql = "select unit from la_base limit 1";
                    $db->query($sql);
                    $unit = $db->getField($sql, 'unit');

                    $sql = "select sum(amount)/'{$unit}' as all_send_ccvt from bot_Iss_records WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                    $db->query($sql);
                    $all_send_ccvt = $db->getField($sql, 'all_send_ccvt'); //总赠送ccvt数量

                    $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                    $db->query($sql);
                    $all_message = $db->getField($sql, 'all_message'); //总聊天数量
                    ?>
                    <div class="sm_title_text_color">
                        <div class="flex center space-between">
                            <p>所属群:《<?php echo $group_name; ?>》</p>
                            <a href="<?php echo $url; ?>">查看聊天记录</a>
                        </div>
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
                            <th class="text-left">名称(荣耀积分)</th>
                            <th class="text-center">获得(CCVT)</th>
                            <th class="text-center">发言数</th>
                            <th class="text-center">点赞</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                        $sql = "select a.us_id,a.wechat,a.amount,a.num,send_time,a.bot_create_time,(SELECT glory_level_integral from us_base WHERE us_id=a.us_id) as glory_level_integral from bot_Iss_records as a WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY num DESC ";
                        $db->query($sql);
                        $list = $db->fetchAll();
                        foreach ($list as $k => $v) {
                            ?>
                            <tr>

                                <td class="text-left"><?php echo $v['wechat']; ?>(<?php echo $v['glory_level_integral']?>)</td>

                                <td><?php echo $v['amount'] / $unit; ?></td>
                                <td>
                                    <?php
                                    $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND wechat='{$v['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
                                    $db->query($sql);
                                    $count = $db->getField($sql, 'all_message');
                                    echo $count;
                                    ?>
                                </td>
                                <!--                                <td><img src="img/zan.svg" class="zan_img" alt=""></td>-->
                                <td>
                                    <button class="btn btn-info btn-sm zan_btn">赞👍&nbsp;
                                        <?php
                                           $s_time = strtotime(date('Y-m-d 00:00:00'),time());
                                           $e_time = strtotime(date('Y-m-d 23:59:59'),time());
                                           $sql = "select sum(tx_amount)/'{$unit}' as zan from us_glory_integral_change_log WHERE debit_id='{$v['us_id']}' AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                                           $db->query($sql);
                                           $zan = $db->getField($sql,'zan');
                                           if (!$zan){$zan=0;}
                                        ?>
                                        <span class="zan_count"><?php echo $zan;?></span>
                                        <span class="none us_id"><?php echo $v['us_id']?></span>
                                    </button>
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


<!--modal-->
<div class="c-float-popWrap confirmMode hiden" style="opacity: 1; top: 264px; left: 28px;">
    <div class="weui_mask_transparent"></div>
    <div class="c-float-modePop">
        <div class="warnMsg">点赞👍数量</div>
        <div class="content">
            <label>数量：<input class="confirm_input" value="5" placeholder="请输入点赞数量"></label>
            <p>点赞功能将扣除对应数量的ccvt,对方将获取荣耀积分</p>
            <p>
                
                <span>每日上限
                    <?php
                    $sql = "SELECT max_give_like FROM bot_status limit 1";
                    $db -> query($sql);
                    $row = $db -> getField($sql,'max_give_like');
                    echo $row;
                    ?>ccvt
                </span>
                <span class="margin-left-5">已点赞
                    <span class="already_count" style="color: #333333">
                        <?php
                            $token = $_COOKIE['statistics_user_token'];
                            if ($token){
                                $us_id = check_token($token);
                                $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
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

<div id='mySpin'></div>

<div class="web_toast">
    <div class="cx_mask_transparent"></div>
    <div class="web_toast_text"></div>
</div>
</body>
</html>