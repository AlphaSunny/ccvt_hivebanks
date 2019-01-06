<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';
require_once '../inc/judge_format.php';
require_once '../plugin/bind/GoogleAuthenticator/GoogleAuthenticator.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 微信绑定 ==========================
GET参数
  token           用户TOKEN
  wechat           该用户绑定的email
返回
  errcode = 0     请求成功
说明
  绑定谷歌认证器
*/
php_begin();
$args = array('token','wechat');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 用于绑定的email
$wechat = get_arg_str('GET', 'wechat',128);

//验证token
$us_id = check_token($token);

//判断微信是否已经绑定过
$is_bind = check_wechat_is_bind($wechat,$us_id);
if($is_bind){
    exit_error('147','WeChat is already tied');
}

//绑定微信号
$vail = 'wechat';
$data['bind_id'] = get_guid();
$data['us_id'] = $us_id;
$data['bind_type'] = 'text';
$data['bind_name'] = $vail;
$data['bind_info'] = $wechat;
$data['bind_flag'] = 1;
$data['utime'] = time();
$data['ctime'] = date('Y-m-d H:i:s');
$we = bind_wechat($data);

if(!$we){
    exit_error('148',"failed");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['new_wechat'] = $wechat;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
