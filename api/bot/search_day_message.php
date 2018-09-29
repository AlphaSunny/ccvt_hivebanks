<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 搜索用户当日发言数量 ==========================
GET参数
  token           用户TOKEN
  nikename        string类型
  hash            HASH内容

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('wechat');
chk_empty_args('GET', $args);

$data['wechat'] = get_arg_str('GET', 'wechat');

//判断是否有用户
$bot_base = search_us_base($data);
if (!$bot_base){
    exit_error('101',"未找到用户");
}

//查询发言数量
$count = search_base_message_count($data);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $count;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
