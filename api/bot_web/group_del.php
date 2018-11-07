<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组删除 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','group_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//群组id
$group_id = get_arg_str('GET', 'group_id');

//验证token
$ba_id = check_token($token);


//删除群组
$row = del_group($group_id);
if (!$row){
    exit_error('109','删除失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

