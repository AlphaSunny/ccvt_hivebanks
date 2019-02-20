<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群升级所需 ==========================
GET参数
  nickname         nickname

返回
  errcode = 0     请求成功

说明
*/

php_begin();

$args = array('group_id','group_name');
chk_empty_args('GET', $args);

//群id
$group_id = get_arg_str('GET','group_id');


$group_name = get_arg_str('GET','group_name');

// 处理
$result = group_to_upgrade($group_id);
if ($result['ruselt']==1){
    $rs = "未找到群信息。";
}else{
    if (!$result['next_bind_count'] && !$result['next_glory_number']){
        $rs = "本群 ".$group_name."，当前荣耀等级是 ".$result['scale']." 级，已达到最大等级。";
    }elseif (($result['all_glory_number']>=$result['next_glory_number']) && ($result['bind_count']<$result['next_bind_count'])){
        $rs = "本群 ".$group_name."，当前荣耀等级是 ".$result['scale']." 级，距离下个荣耀等级还需要绑定 ".($result['next_bind_count']-$result['bind_count'])." 个用户。";
    }elseif (($result['all_glory_number']<$result['next_glory_number']) && ($result['bind_count']>=$result['next_bind_count'])){
        $rs = "本群 ".$group_name."，当前荣耀等级是 ".$result['scale']." 级，距离下个荣耀等级还需要 ".($result['next_glory_number']-$result['all_glory_number'])." 荣耀星数。";
    }elseif (($result['all_glory_number']<$result['next_glory_number']) && ($result['bind_count']<$result['next_bind_count'])){
        $rs = "本群 ".$group_name."，当前荣耀等级是 ".$result['scale']." 级，距离下个荣耀等级还需要 ".($result['next_glory_number']-$result['all_glory_number'])." 荣耀星数,绑定 ".($result['next_bind_count']-$result['bind_count'])." 个用户。";
    }else{
        $rs = "本群 ".$group_name."，当前荣耀等级是 ".$result['scale']." 级，当前荣耀星数已满足下次升级条件。";
    }
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = $rs;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>
