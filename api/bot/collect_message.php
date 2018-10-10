<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
require_once '../inc/send_amout/bot_send_amount.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 微信收集群聊信息 ==========================
GET参数
  nickname        string类型
  content          string
  send_time       datatime

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('nickname','content','send_time','wechat','ba_id','group_name','type');
chk_empty_args('GET', $args);

//信息唯一值
$data['bot_message_id'] = get_guid();
$data['bot_nickname'] = get_arg_str('GET','nickname');
$data['bot_content'] = $_REQUEST['content'];
echo strlen($data['bot_content']);
echo $data['bot_content'];die;
$data['bot_send_time'] = get_arg_str('GET', 'send_time');
$data['bot_create_time'] = time();
$data['wechat'] = get_arg_str('GET','wechat');
$data['ba_id']  = get_arg_str('GET', 'ba_id');
$data['group_name']  = get_arg_str('GET', 'group_name');
$data['type']  = get_arg_str('GET', 'type');
$data['head_img']  = get_arg_str('GET', 'head_img');
//存入群消息
send_amount($data);
exit_ok();




?>
