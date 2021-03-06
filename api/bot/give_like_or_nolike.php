<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== @机器人点赞或点踩 ==========================

*/

php_begin();

$args = array('give_wechat','recive_wechat','status','num','group_id');
chk_empty_args('GET', $args);

//点赞人微信昵称
$give_wechat = get_arg_str('GET','give_wechat');
//被点赞人微信昵称
$recive_wechat = get_arg_str('GET','recive_wechat');
//群id
$group_id = get_arg_str('GET','group_id');
//点赞还是点踩
$status = get_arg_str('GET','status');
//数量
$num = get_arg_str('GET','num');
if ($num<0){
    exit_error('109',"@".$give_wechat.",金额错误");
}

if ($status=='踩' && $give_wechat==$recive_wechat){
    exit_error('109',"@".$give_wechat.",不可以踩自己");
}
//查看点赞微信或被点赞人微信是否存在,是否打开,是否大于设置金额
$is_hive = check_wcheck_wechat($give_wechat,$recive_wechat,$num,$status,$group_id);
if ($is_hive['give_status']!=1){
    exit_error('109',"@".$give_wechat."，您的微信昵称未绑定");
}elseif ($is_hive['recive_status']!=1){
    exit_error('109',"@".$give_wechat."，您".$status."的".$recive_wechat."未找到");
}elseif ($is_hive['switch_status']!=1){
    exit_error('109',"@".$give_wechat."，您未开启群内点赞功能,可以去账户中心-安全中心 开启奥");
}elseif ($is_hive['point_tread_num_status']!=1){
    exit_error('109',"@".$give_wechat."，金额不能大于设定金额奥");
}elseif ($is_hive['if_balance']!=1){
    exit_error('109',"@".$give_wechat."，余额不足");
}elseif ($is_hive['is_ceiling']!=1){
    exit_error('109',"@".$give_wechat."，今日".$status."已达到上限");
}elseif ($is_hive['group_judge']!=1){
    exit_error('109',"@".$give_wechat."，您账号绑定的不是当前群,无法使用此功能");
}

$data['us_id'] = $is_hive['us_id'];
$data['give_us_id'] = $is_hive['give_us_id'];
$data['state'] = $status == "赞" ? 1 : 2;
$data['give_num'] = $num;

//点踩、点踩
if (!give_like_us($data)){
    exit_error('109',"@".$give_wechat."，点赞失败");
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = "@".$give_wechat."，点".$status."成功";
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
