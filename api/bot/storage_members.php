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

//$args = array('name','group_name','group_id');
//chk_empty_args('GET', $args);

$content  = file_get_contents("php://input");

//信息
//$data['member_id'] = get_guid();
//$data['content'] = get_arg_str('GET','name');
//$data['group_id'] = get_arg_str('GET','group_id');
//$data['group_name'] = get_arg_str('GET','group_name');
//$data['intime'] = time();

$array = json_decode($content,true);
// 更新群组成员
//$row = storage_members($array);
//if (!$row){
//    exit_error('109','失败');
//}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = $array;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
