<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 根据微信指令查询用户余额 ==========================
GET参数
  bot_mark        string类型

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('wechat');
chk_empty_args('GET', $args);

//查询余额
$data['wechat'] = get_arg_str('GET', 'wechat');
$we = search_bot_amount($data);
if(!$we){
    exit_error('101',"未找到用户");
}
//返回信息
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['base_amount'] = $we['base_amount']/get_la_base_unit();
$rtn_ary['lock_amount'] = $we['lock_amount']/get_la_base_unit();
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
