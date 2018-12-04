<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  机器人登录成功,获取机器人所有的群,存入临时群表 ==========================
GET参数
  nickname        string类型

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('group_name','us_id');
chk_empty_args('GET', $args);

//群昵称
$group_name = get_arg_str('GET','group_name');

//用户id
$us_id = get_arg_str('GET','us_id');


// 处理
$status = temporary_group($group_name,$us_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>
