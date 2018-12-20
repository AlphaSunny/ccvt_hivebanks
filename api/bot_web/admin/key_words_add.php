<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词添加 ==========================
GET参数
  token                用户token


返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','ask','answer','send_type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$la_id = la_user_check($token);

$data['ask'] = get_arg_str('GET', 'ask');
$data['answer'] = get_arg_str('GET', 'answer');
$data['send_type'] = get_arg_str('GET', 'send_type');
$data['is_admin'] = 2;
$data['ctime'] = date('Y-m-d H:i:s');
$data['us_id'] = $la_id;
// 添加群组
$row = add_key_words($data);
if (!$row){
    exit_error('109','添加失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

