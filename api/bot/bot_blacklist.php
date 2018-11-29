<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  @机器人黑名单判断 ==========================
GET参数
  nickname        string类型

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('nickname');
chk_empty_args('GET', $args);

//群昵称
$nickname = get_arg_str('GET','nickname');


// 处理
$result = check_black($nickname);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['status'] = $result;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>
