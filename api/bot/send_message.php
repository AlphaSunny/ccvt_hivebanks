<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  机器人状态退出,短信通知 ==========================
GET参数


返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('us_id');
chk_empty_args('GET', $args);

//用户id
$us_id = get_arg_str('GET','us_id');

//查询手机号
$phone = get_send_phone($us_id);

//查询key_code
$key_code = get_key_code();

$url = 'http://agent_service.fnying.com/sms/bot_status.php';
$post_data['cellphone']    = $phone;
$post_data['key_code']     = $key_code;
$o = "";
foreach ( $post_data as $k => $v )
{
    $o.= "$k=" . urlencode( $v ). "&" ;
}
$post_data = substr($o,0,-1);

$res = request_post($url, $post_data);
php_end($res);

// 返回数据
//$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_str = json_encode($rtn_ary);
//php_end($rtn_str);





?>
