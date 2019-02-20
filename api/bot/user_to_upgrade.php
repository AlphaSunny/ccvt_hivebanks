<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户升级所需积分 ==========================
GET参数
  nickname         nickname

返回
  errcode = 0     请求成功

说明
*/

php_begin();

$args = array('nickname');
chk_empty_args('GET', $args);

//昵称
$nickname = get_arg_str('GET','nickname');

// 处理
$result = user_to_upgrade($nickname);
if ($result['ruselt']==1){
    $rs = "@".$nickname.",未找到用户信息。";
}else{
    if ($result['us_integral']>=$result['next_integral']){
        $rs = "@".$nickname.",你当前荣耀等级是 ".$result['us_scale']." 级，当前荣耀积分已满足下次升级条件。";
    }elseif ($result['us_integral']<$result['next_integral']){
        $rs = "@".$nickname.",你当前荣耀等级是 ".$result['us_scale']." 级，距离下个荣耀等级还需要 ".($result['next_integral']-$result['us_integral'])." 积分。";
    }
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = $rs;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
