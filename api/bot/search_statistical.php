<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 聊天发币统计 ==========================
GET参数
  group_name         group_name
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
    $datetime = date('Y-m-d',strtotime("-1 day"));
}

//查询昨日有没有奖励
$statistical = search_statistical(get_arg_str('GET', 'group_name'));

$group_name = urlencode(base64_encode(get_arg_str('GET', 'group_name')));

$json_string = file_get_contents('../../h5/assets/json/config_url.json');
$data = json_decode($json_string, true);

$url = $data['api_url']."/api/bot_web/page/statistical.php?datetime=".base64_encode($datetime)."&group_name=".$group_name;

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['url'] = $url;
$rtn_ary['is_statistical'] = $statistical ? '1' : '2';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
