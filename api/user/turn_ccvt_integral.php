<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== ccvt余额转荣耀积分 ==========================
GET参数
  token            token
  account          string(转的金额)

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('token','account');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',100);

// 验证token
$us_id = check_token($token);

//金额
$account = get_arg_str('GET','account');

if ($account>10000 || $account<=0){
    exit_error("150","金额错误");
}

//判断余额
$check = check_us_amount($us_id,$account);
if (!$check){
    exit_error('101',"余额不足");
}

//转换
$rows = turn_ccvt_integral($us_id,$account);
if (!$rows){
    exit_error('101',"转换失败!");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['us_amount'] = get_us_base_info_by_token($us_id)['base_amount']/get_la_base_unit();
$rtn_ary['glory_of_integral'] = get_us_integral($us_id)/get_la_base_unit();
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>
