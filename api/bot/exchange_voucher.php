<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 兑换码兑换 ==========================
GET参数
  nickname        string类型
  voucher          string

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('nickname','voucher');
chk_empty_args('GET', $args);

//昵称
$nickname = get_arg_str('GET','nickname');

//兑换码
$voucher = get_arg_str('GET','voucher');

//判断昵称和兑换码
$check = check_voucher($nickname,$voucher);
if ($check==1){
    exit_error('101',"@".$nickname.",你的昵称未绑定账号,无法兑换!");
}elseif($check==2){
    exit_error('101',"@".$nickname.",兑换码不存在!");
}elseif($check==3){
    exit_error('101',"@".$nickname.",兑换码已经被兑换!");
}

//兑换
$rows = us_voucher($nickname,$voucher);
if (!$rows){
    exit_error('101',"@".$nickname.",兑换失败!");
}

//获取金额
$amount = get_voucher_amount($voucher);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = "@".$nickname.",兑换成功,金额:".$amount."ccvt";
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>
