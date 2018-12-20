<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词修改 ==========================
GET参数
  token                用户token
  group_name          群组名称

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','key_id','ask','answer','send_type','group_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$us_id = check_token($token);

$data['id'] = get_arg_str('GET', 'key_id');
$data['ask'] = get_arg_str('GET', 'ask');
$data['answer'] = get_arg_str('GET', 'answer');
$data['send_type'] = get_arg_str('GET', 'send_type');
$data['group_id'] = get_arg_str('GET', 'group_id');
$data['utime'] = time();
// 添加群组
$row = save_key_words($data);
if (!$row){
    exit_error('109','修改失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

