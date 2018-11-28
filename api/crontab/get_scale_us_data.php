<?php
require_once "../inc/common.php";
require_once "us_scale_upgrade.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//获取升级用户信息

$db = new DB_COM();

//用户
$sql = "select * from us_base as us LEFT JOIN us_asset as us_as on us.us_id=us_as.us_id where us.scale=1 ORDER BY us_as.base_amount DESC limit 20";
