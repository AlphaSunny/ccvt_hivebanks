<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 留言设定 ==========================
GET参数
  token           用户TOKEN
返回
  errcode = 0     请求成功
说明
  绑定谷歌认证器
*/
php_begin();
$args = array('token','leave_message');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 用于绑定的group_id
$leave_message = get_arg_str('GET', 'leave_message',300);

if (mb_strlen($leave_message,'UTF8')>140){
    exit_error('129','长度错误!');
}

//验证token
$us_id = check_token($token);


//留言设定
$vail = 'leave_message';
$data['bind_id'] = get_guid();
$data['us_id'] = $us_id;
$data['bind_type'] = 'text';
$data['bind_name'] = $vail;
$data['bind_info'] = $leave_message;
$data['bind_flag'] = 1;
$data['utime'] = time();
$data['ctime'] = date('Y-m-d H:i:s');
$we = bind_leave_message($data);

if(!$we){
    exit_error('148',"failed");
}


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['leave_message'] = $leave_message;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
