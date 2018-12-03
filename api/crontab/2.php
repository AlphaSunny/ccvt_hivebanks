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

for ($i=0;$i<=10;$i++){
    for ($j=1;$j<=10;$j++){
        if ($i==0){
            $data['us_level'] = $i;
            $data['group_level'] = $j;
            $data['one_send'] = $j;
            $data['max_send'] = $j*5;
            $data['ctime'] = date('Y-m-d H:i:s');
            $sql = $db->sqlInsert("bot_level_rules2", $data);
            $id = $db->query($sql);
        }
    }
}

?>