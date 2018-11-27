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

$json_string = file_get_contents('../../h5/assets/json/config_url.json');
$data = json_decode($json_string, true);

$group_name2 = urlencode(base64_encode($group_name));

$url = $data['api_url'] . "/api/bot_web/page/chat.php?datetime=" . base64_encode($datetime) . "&group_name=" . $group_name2 . "&status=" . base64_encode(2);

?>
<section id="statistical" class="swiper-slide">
    <div class="container">
        <div class="row title_box">
            <div class="col-md-12 col-sm-12 flex center space-between">
                <div><img class="logo_img" src="img/ccvt_logo.png" alt=""></div>
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
                    $unit = get_la_base_unit();

                    $sql = "select sum(amount)/'{$unit}' as all_send_ccvt from bot_Iss_records WHERE send_time BETWEEN '{$day_start}' AND '{$day_end}'";
                    $db->query($sql);
                    $all_send_ccvt = $db->getField($sql, 'all_send_ccvt'); //总赠送ccvt数量

                    $sql = "select count(bot_message_id) as all_message from bot_message WHERE group_name='{$group_name}' AND bot_send_time BETWEEN '{$day_start}' AND '{$day_end}'";
                    $db->query($sql);
                    $all_message = $db->getField($sql, 'all_message'); //总聊天数量
                    ?>
                    <div class="sm_title_text_color">
                        <div class="flex center space-between">
                            <h3>CCVT 聊天奖励统计</h3>
                            <p class="logOut">退出</p>
                        </div>
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

                
                </div>
            </div>
        </div>
    </div>
</section>


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
                    $sql = "SELECT max_give_like FROM bot_status limit 1";
                    $db->query($sql);
                    $row = $db->getField($sql, 'max_give_like');
                    echo $row;
                    ?>ccvt
                </span>

                <!--踩上限-->
                <span class="cai_top">每日上限
                    <?php
                    $sql = "SELECT max_give_no_like FROM bot_status limit 1";
                    $db->query($sql);
                    $row = $db->getField($sql, 'max_give_no_like');
                    echo $row;
                    ?>ccvt
                </span>

                <!--已赞数量-->
                <span class="margin-left-5 zan_num">已点赞
                    <span class="already_zan_count" style="color: #333333">
                        <?php
                        $us_id = $_COOKIE['statistics_user_id'];
                        if ($us_id) {
                            $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=1 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                            $db->query($sql);
                            $all_am = $db->getField($sql, 'all_am');
                            if (!$all_am) {
                                $all_am = 0;
                            }
                            echo $all_am;
                        }else{
                            echo 0;
                        }
                        ?>
                    </span>ccvt
                </span>

                <!--已踩数量-->
                <span class="margin-left-5 cai_num">已踩
                    <span class="already_cai_count" style="color: #333333">
                        <?php
                        $us_id = $_COOKIE['statistics_user_id'];
                        if ($us_id) {
                            $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=2 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
                            $db->query($sql);
                            $all_am = $db->getField($sql, 'all_am');
                            if (!$all_am) {
                                $all_am = 0;
                            }
                            echo $all_am;
                        }else{
                            echo 0;
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