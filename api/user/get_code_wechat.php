<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  根据code,查询微信昵称  ==========================
GET参数
  code            code

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('code');
chk_empty_args('GET', $args);


//code
$code = get_arg_str('GET','code');

//转换
$wechat = get_code_wechat($code);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['wechat'] = $wechat['wechat'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>
