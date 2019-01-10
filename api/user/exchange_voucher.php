<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 兑换码兑换 ==========================
GET参数
  token            token
  voucher          string

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('token','voucher');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',100);

// 验证token
$us_id = check_token($token);

//兑换码
$voucher = get_arg_str('GET','voucher');

//判断昵称和兑换码
$check = check_voucher($voucher);
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
$rtn_ary['us_amount'] = get_us_base_info_by_token($us_id)['base_amount']/get_la_base_unit();
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>
