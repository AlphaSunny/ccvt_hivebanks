<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词删除 ==========================
GET参数
  token                用户token
  key_id          id

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','key_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$us_id = check_token($token);

$key_id = get_arg_str('GET', 'key_id');
// 添加群组
$row = del_key_words($key_id);
if (!$row){
    exit_error('109','删除失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

