<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词开关 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token','status','switch');
//1:总开关    2:分开关
$status =  get_arg_str('GET', 'status');
if ($status==1){
    $args = array('group_id');
}else{
    $args = array('key_id');
}
chk_empty_args('GET', $args);

//开关  1:开  2:关
$switch = get_arg_str('GET', 'switch');
//群id
$group_id = get_arg_str('GET', 'group_id');
//关键词id
$key_id = get_arg_str('GET', 'key_id');
// 用户token
$token = get_arg_str('GET', 'token',128);

//验证token
$us_id = check_token($token);

if ($group_id){
    //判断查询的群是否属于当前用户
    $result = check_us_group($us_id,$group_id);
    if (!$result){
        exit_error('139','非法操作');
    }
}

// 开关
$rows = keywords_switch($status,$switch,$group_id,$key_id);
if (!$rows){
    exit_error('109','设置错误');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

