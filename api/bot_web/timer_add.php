<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 任务添加 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','time','group_id','content');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 时间
$time = get_arg_str('GET', 'time');
//把中文冒号替换英文冒号
$time = str_replace('：', ':', $time);

$tmparray = explode(':',$time);

if(count($tmparray)>2){
    exit_error('139','格式错误');
}

$time = $tmparray[0].":".($tmparray[1]<10 ? intval($tmparray[1]) : $tmparray[1]);

// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 群组id
$content = $_REQUEST['content'];
//验证token
$ba_id = check_token($token);

$data['time'] = $time;
$data['content'] = $content;
$data['intime'] = time();
$data['ba_id'] = $ba_id;
$data['group_id'] = $group_id;
// 添加群组
$row = add_timer($data);
if (!$row){
    exit_error('109','添加失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

