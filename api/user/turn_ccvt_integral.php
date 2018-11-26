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

if ($ccvt_num>10000 || $ccvt_num<=0){
    exit_error("150","金额错误");
}

//判断余额
$check = check_us_amount($us_id);
if ($check==1){
    exit_error('101',"你的昵称未绑定账号,无法兑换!");
}elseif($check==2){
    exit_error('101',"兑换码不存在!");
}elseif($check==3){
    exit_error('101',"兑换码已经被兑换或已过期!");
}elseif($check==4){
    exit_error('101',"兑换码已过期!");
}

//兑换
$rows = us_voucher($us_id,$voucher);
if (!$rows){
    exit_error('101',"兑换失败!");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>
