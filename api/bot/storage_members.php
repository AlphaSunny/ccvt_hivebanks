<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 微信存储群成员 ==========================
GET参数
  nickname        string类型
  content          string
  send_time       datatime

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('name_json','group_name','group_id');
chk_empty_args('GET', $args);

print_r(json_decode($_REQUEST['name_json']));
die;

//信息
$data['name'] = get_arg_str('GET','name');
$data['group_id'] = get_arg_str('GET','group_id');
$data['group_name'] = get_arg_str('GET','group_name');
$data['intime'] = time();

// 更新群组成员
$row = storage_members($data);
if (!$row){
    exit_error('109','失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
