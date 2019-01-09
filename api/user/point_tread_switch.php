<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组内快速点赞开关设置 ==========================
GET参数
  token           用户TOKEN
返回
  errcode = 0     请求成功
说明
  绑定谷歌认证器
*/
php_begin();
$args = array('token','point_tread_switch');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);

//开关  1:开  2:关
$point_tread_switch = get_arg_str('GET','point_tread_switch');

//金额
$point_tread_num = get_arg_str('GET','point_tread_num');

//验证token
$us_id = check_token($token);

//设置开关和金额
$row = point_tread_switch($us_id,$point_tread_switch,$point_tread_num);


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
