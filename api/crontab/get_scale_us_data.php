<?php
require_once "../inc/common.php";
require_once "us_scale_upgrade.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//获取升级用户信息

$db = new DB_COM();
$unit = get_la_base_unit();
//用户
$sql = "select us.wechat as us_account from us_base as us LEFT JOIN us_asset as us_as on us.us_id=us_as.us_id where us.scale=1 AND us.wechat!='' ORDER BY us_as.base_amount ASC ";
$db->query($sql);
$rows = $db->fetchAll();


//$sql = "select us.wechat as us_account from us_base as us LEFT JOIN us_asset as us_as on us.us_id=us_as.us_id where us.scale=1 AND us.wechat!='' ORDER BY us_as.base_amount ASC ";
//$db->query($sql);
//$rows2 = $db->fetchAll();
//
//$rows = array_merge($rows,$rows2);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] =$rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
