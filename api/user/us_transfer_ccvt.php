<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户给用户转账ccvt ==========================
GET参数
  token                用户token
  account             转账金额
返回

说明
*/

php_begin();
$args = array('token','account','ccvt_num');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token');
$ccvt_num = get_arg_str('GET', 'ccvt_num');
$account = get_arg_str('GET', 'account');
//验证token
$us_id = check_token($token);

//判断是否有此账号
$is_account = check_us_account($account);
if (!$is_account){
    exit_error("149","账号不存在");
}

if ($ccvt_num>30000 || $ccvt_num<=0){
    exit_error("150","转账金额不能错误");
}

//判断余额
$rs = check_us_amount($us_id,$account);
if (!$rs){
    exit_error("150","余额不足");
}

$data['us_id'] = $us_id;
$data['trans_us_id'] = $is_account['us_id'];
$data['num'] = $ccvt_num;

//存储数据库
$rows = us_send_ccvt_record($data);

if (!$rows){
    exit_error("101","fail");
}


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
