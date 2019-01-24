<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//获取升级用户信息
//
//$db = new DB_COM();
//$unit = get_la_base_unit();
////用户
//$sql = "select us.wechat as us_account from us_base as us LEFT JOIN us_asset as us_as on us.us_id=us_as.us_id where us.scale=1 AND us.wechat!='' ORDER BY us_as.base_amount ASC ";
//$db->query($sql);
//$rows = $db->fetchAll();
//
//
//// 返回数据做成
//$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_ary['rows'] =$rows;
//$rtn_str = json_encode($rtn_ary);
//php_end($rtn_str);


$db = new DB_COM();
$unit = get_la_base_unit();

$times = '2018-12-2 00:00:00';

$sql = "select after_scale from us_scale_changes WHERE ctime>'{$times}' group BY after_scale ORDER by after_scale DESC ";
$db->query($sql);
$scales = $db->fetchAll();
$all_list = [];
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
foreach ($scales as $k=>$v){
    $sql = "select us.wechat from us_scale_changes as sc INNER JOIN us_base as us on sc.us_id=us.us_id WHERE sc.after_scale='{$v['after_scale']}'  AND us.wechat!='' AND sc.ctime>'{$times}' ORDER BY sc.scale DESC";
    $db->query($sql);
    $list = $db->fetchAll();
    $all_list = array_merge($all_list,$list);
    $rtn_ary[$v['after_scale']."_list"] = $list;
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


