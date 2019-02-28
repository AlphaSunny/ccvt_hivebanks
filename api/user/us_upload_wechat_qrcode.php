<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户上传二维码及设置价格 ==========================
GET参数
  token           用户TOKEN
返回
  errcode = 0     请求成功
说明

*/
php_begin();
$args = array('token','wechat_qrcode','price');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);

//微信二维码地址
$wechat_qrcode = get_arg_str('GET','wechat_qrcode');

//收费价格
$price = get_arg_str('GET','price');


if ($price<=0){
    exit_error("150","金额错误");
}
if (!(is_numeric($price)) || strpos($price, '.')) {
    exit_error("150","金额错误");
}


//验证token
$us_id = check_token($token);


//设置开关和金额
$row = upload_wechat_qrcode($us_id,$wechat_qrcode,$price);
if (!$row){
    exit_error("109","设置错误");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
