<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();
//$sql = "select name,(select count(bot_message_id) from bot_message where bot_nickname=name) as count from bot_group_members WHERE group_id=9 ORDER BY count DESC ";
//
//$db->query($sql);
//$rows = $db->fetchAll();
//foreach ($rows as $k=>$v){
//    echo "发言数:".$v['count']."&nbsp;&nbsp;&nbsp;&nbsp;".$v['name']."<br />";
//}

// 时间
$time = "9:00:10";
//把中文冒号替换英文冒号
$time = str_replace('：', ':', $time);

$tmparray = explode(':',$time);


$time = $tmparray[0].":".($tmparray[1]<10 ? intval($tmparray[1]) : $tmparray[1]);
echo $time;


//等级规则数据
//for ($i=0;$i<=10;$i++){
//    for ($j=1;$j<=10;$j++){
//        $data['us_level'] = $i;
//        $data['group_level'] = $j;
//        if ($i==0){
//            $data['one_send'] = $j;
//            $data['max_send'] = $j*5;
//        }elseif ($i==1){
//            $data['one_send'] = $j*2;
//            $data['max_send'] = $j*2*5;
//        }else{
//            $data['one_send'] = $j*$i*2;
//            $data['max_send'] = $j*$i*2*5;
//        }
//        $data['ctime'] = date('Y-m-d H:i:s');
//        $sql = $db->sqlInsert("bot_level_rules", $data);
//        $id = $db->query($sql);
//    }
//}
?>