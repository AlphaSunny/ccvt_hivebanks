<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 统计用户余额排行榜前十 ==========================
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

//$args = array('bot_nickname');
//chk_empty_args('GET', $args);

//$data['bot_nickname'] = get_arg_str('GET', 'bot_nickname');

//判断是否有用户
//$bot_base = search_bot_base($data);
//if (!$bot_base){
//    exit_error('101',"未找到微信用户");
//}

//统计余额排行榜
$rows = statistics_amount_list();

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['list'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
