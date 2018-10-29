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
                        $all_send_ccvt = $db->getField($sql,all_send_ccvt);
                    echo $all_send_ccvt;
                    ?>
                    <p>时间:<?php echo $datetime;?></p>
                    <p>今日发币总数量:500(CCVT)</p>
                    <p>今日发言总数量:400(条)</p>

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
                        <tr>
                            <td>🥇</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>🥈</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>🥉</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>大晚上的不睡觉</td>
                            <td>30</td>
                            <td>5</td>
                            <td>5</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>