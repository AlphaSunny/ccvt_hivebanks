<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词修改 ==========================
GET参数
  token                用户token


返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','key_id','ask','answer','send_type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$la_id = la_user_check($token);

$data['id'] = get_arg_str('GET', 'key_id');
$data['ask'] = get_arg_str('GET', 'ask');
$data['answer'] = get_arg_str('GET', 'answer');
$data['send_type'] = get_arg_str('GET', 'send_type');
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

