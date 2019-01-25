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

//exit_error("101","系统维护");

php_begin();
$args = array('token','account','ccvt_num','code','pass_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token');
$ccvt_num = get_arg_str('GET', 'ccvt_num');
$account = get_arg_str('GET', 'account');
//资金密码哈希
$pass_hash = get_arg_str('GET', 'pass_hash');
//识别码(邀请码)
$code = get_arg_str('GET', 'code');
//验证token
$us_id = check_token($token);


if (!(is_numeric($account))&&strpos($account, '.')) {
    exit_error("150","金额错误");
}


//验证哈希密码
$check_pass_hash = check_pass_hash($us_id,$pass_hash);
if (!$check_pass_hash){
    exit_error("150","资金密码错误");
}

//判断是否有此账号
$is_account = check_us_account($account);
if (!$is_account){
    exit_error("149","账号不存在");
}elseif ($is_account['us_nm']!=$code){
    exit_error("149","识别码错误");
}

$max_min = get_transfer_maximum_minimum_value();

if ($ccvt_num>$max_min['transfer_big']){
    exit_error("150","最大转账".$max_min['transfer_big']);
}elseif ($ccvt_num<$max_min['transfer_small']){
    exit_error("150","最小转账".$max_min['transfer_small']);
}elseif ($ccvt_num<=0){
    exit_error("150","转账金额错误");
}

//判断余额
$rs = check_us_amount($us_id,$account);
if (!$rs){
    exit_error("150","余额不足");
}

$data['us_id'] = $us_id;
$data['trans_us_id'] = $is_account['us_id'];
$data['num'] = $ccvt_num;

$scale = get_us_base_info_by_token($us_id)['scale'];
if ($scale<2){
    exit_error("150","等级不足,无法操作");
}

//存储数据库
$rows = us_us_transfer_request($data);

if (!$rows){
    exit_error("101","fail");
}


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
