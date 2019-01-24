<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  @机器人问是否绑定 ==========================
GET参数
  nickname        string类型

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('nickname');
chk_empty_args('GET', $args);

//群昵称
$nickname = get_arg_str('GET','nickname');

// 处理
$result = wechat_is_bind($nickname);
if (!$result){
    $errcode = '105';
    $content = "@".$nickname.",昵称未绑定";
}else{
    $errcode = '0';
    $content = "@".$nickname.",昵称已绑定";
}


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = $errcode;
$rtn_ary['errmsg'] = $content;
$rtn_ary['code'] = $result['us_nm'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>
