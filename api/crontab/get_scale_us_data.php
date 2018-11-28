<?php
require_once "../inc/common.php";
require_once "us_scale_upgrade.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//获取升级用户信息

$db = new DB_COM();
$unit = get_la_base_unit();
//用户
$sql = "select us.us_account,us_as.base_amount/'{$unit}' as base_amount,us.scale from us_base as us LEFT JOIN us_asset as us_as on us.us_id=us_as.us_id where us.scale=1 ORDER BY us_as.base_amount DESC limit 20";
$db->query($sql);
$rows = $db->fetchAll();

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] =$rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
