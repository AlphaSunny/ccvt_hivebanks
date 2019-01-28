<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 任务添加 ==========================
GET参数
  token                用户token
  send_type        1:纯文本  2：图片（不能大于500k）

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','time','group_id','content','send_type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$la_id = la_user_check($token);

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
// 内容
$content = $_REQUEST['content'];

// 发送类型
$send_type = get_arg_str('GET', 'send_type');

// 闹钟
$tx_content = get_arg_str('GET', 'tx_content');

// 1:每日  2：周几  3：某个日期
$type = get_arg_str('GET', 'type');


$data['time'] = $time;
$data['content'] = $content;
$data['intime'] = time();
$data['group_id'] = $group_id;
$data['send_type'] = $send_type;
$data['tx_content'] = $tx_content;
$data['type'] = $type;
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

