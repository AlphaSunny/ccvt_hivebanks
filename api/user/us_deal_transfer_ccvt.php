<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户给用户转账(确认/取消) ==========================
GET参数
  token                用户token
  qa_id               订单id
  qa_flag              1:确认   2:取消
  account             转账金额
返回

说明
*/

php_begin();
$args = array('token','qa_id','qa_flag');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token');
$qa_id = get_arg_str('GET', 'qa_id');
$qa_flag = get_arg_str('GET', 'qa_flag');

//验证token
$us_id = check_token($token);

if ($qa_flag!=1 && $qa_flag!=2){
    exit_error("105","非法操作");
}

//处理订单
$row = us_send_ccvt_record($us_id,$qa_id,$qa_flag);

if (!$row){
    exit_error("101","fail");
}elseif ($qa_flag==1){
    require_once "db/la_admin.php";
    $key_code = get_la_admin_info()["key_code"];
    //发送短信
    $output_array = transfer_sms_send($us_id,$key_code);
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
