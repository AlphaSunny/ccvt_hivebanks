<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  判断群聊是否已经绑定ccvt账户,如果没绑定通知 ==========================
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

$args = array('robot_alive');
chk_empty_args('GET', $args);

//机器人登录状态
$robot_alive = get_arg_str('GET','robot_alive');

//信息
$data['robot_alive'] = $robot_alive;
$data['ctime'] = time();

// 添加群组
$row = bot_alive($data);
if (!$row){
    exit_error('109','失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>
