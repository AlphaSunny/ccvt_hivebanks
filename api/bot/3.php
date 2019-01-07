<?php
require_once '../inc/common.php';
function curl_get($url){

    $testurl = $url;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testurl);
    //参数为1表示传输数据，为0表示直接输出显示。
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //参数为0表示不带头文件，为1表示带头文件
    curl_setopt($ch, CURLOPT_HEADER,0);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

$db = new DB_COM();

$url = "https://ccvt_test.fnying.com/api/bot/search_statistical.php";

$sql = "select DATE_FORMAT(bot_send_time,'%Y-%m-%d') days,group_id,(select name from bot_group where id=group_id) as group_name from bot_message where group_id!=0 group by days,group_id order by days desc";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    foreach ($rows as $k=>$v){
        $data['group_id'] = $v['group_id'];
        $datetime = base64_encode($v['days']);
        $url = $url."?group_name='".$v['group_name']."'&datetime=".$datetime;
        $result = json_decode(curl_get($url),true);
        echo $result['url']."<br />";
        $data['address'] =$result['url'];
        $data['date']   = $v['days'];
        $data['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert('bot_statistical_address',$data);
        $db->query($sql);
    }
}
echo "OK";


?>
