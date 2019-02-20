<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//获取群升级信息


$db = new DB_COM();
$unit = get_la_base_unit();

$times = '2018-12-29 19:59:03';

$sql = "select after_scale from bot_group_scale_changes WHERE ctime>'{$times}' group BY after_scale ORDER by after_scale DESC ";
$db->query($sql);
$scales = $db->fetchAll();
$all_list = [];
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
foreach ($scales as $k=>$v){
    $sql = "select name from bot_group WHERE scale='{$v['after_scale']}'";
    $db->query($sql);
    $list = $db->fetchAll();
    $all_list = array_merge($all_list,$list);
    $rtn_ary["list_".$v['after_scale']] = $list;
}
$rtn_ary['all_list'] = $all_list;


////1
//$sql = "select us.wechat from us_scale_changes as sc INNER JOIN us_base as us on sc.us_id=us.us_id WHERE sc.after_scale=1  AND us.wechat!='' AND sc.ctime>'2018-12-2 00:00:00' ORDER BY sc.scale DESC";
//$db->query($sql);
//$one_list = $db->fetchAll();
//
////2
//$sql = "select us.wechat from us_scale_changes as sc INNER JOIN us_base as us on sc.us_id=us.us_id WHERE sc.after_scale=2  AND us.wechat!='' AND sc.ctime>'2018-12-2 00:00:00' ORDER BY sc.scale DESC";
//$db->query($sql);
//$two_list = $db->fetchAll();

////all
//$all_list = array_merge($one_list,$two_list);

// 返回数据做成

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


