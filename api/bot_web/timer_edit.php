<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 任务修改 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','timer_id','time','group_id','content');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//任务id
$timer_id = get_arg_str('GET', 'timer_id');
// 时间
$time = get_arg_str('GET', 'time');
// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 群组id
$content = $_REQUEST['content'];
//验证token
$ba_id = check_token($token);


$data['timer_id'] = $timer_id;
$data['time'] = $time;
$data['content'] = $content;
$data['ba_id'] = $ba_id;
$data['group_id'] = $group_id;
//修改群组
$row = save_timer($data);
if (!$row){
    exit_error('109','修改失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

