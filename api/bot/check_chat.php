<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 检查群聊是否一段时间内如果没人聊天,调用文章接口 ==========================
GET参数
  group_name         group_name


返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('group_name');
chk_empty_args('GET', $args);

//群组
$group_name = get_arg_str('GET', 'group_name');

$row = check_chat_time($group_name);
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['url'] = $url;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
