<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 微信群聊结束后返回当日聊天记录 ==========================
GET参数
  ba_id         ba_id
  datetime      日期,非必传

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('group_name');
chk_empty_args('GET', $args);

$datetime = get_arg_str('GET', 'datetime');
if ($datetime){
    $datetime = base64_decode($datetime);
}else{
    $datetime = date('Y-m-d');
}
$group_name = urlencode(base64_encode(get_arg_str('GET', 'group_name')));

$json_string = file_get_contents('../../h5/assets/json/config_url.json');
$data = json_decode($json_string, true);
print_r($data);die;

$url = "http://ccvt.io/api/bot_web/chat.php?datetime=".base64_encode($datetime)."&group_name=".$group_name;

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['url'] = $url;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
