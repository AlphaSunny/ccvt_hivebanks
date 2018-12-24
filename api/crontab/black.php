<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/24
 * Time: 下午5:02
 */



ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
//die('fuck off');
require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

if(!$_REQUEST['us_nm'])
    die('请输入邀请码');
$us_nm = $_REQUEST['us_nm'];

$db = new DB_COM();


$sql = "select us_id from us_base where us_nm = '{$us_nm}'";
$db->query($sql);
$res = $db->fetchRow();
$us_id = $res['us_id'];

$sql = "select black_info from la_black_list where us_id = '{$us_id}'";
$db->query($sql);
$res = $db->fetchRow();

if($res['black_info']=='white_hat') {
    $sql = "update la_black_list set black_info='invite_invalid' where us_id = '{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        die('封禁成功！');
}else{
    $sql = "update la_black_list set black_info='white_hat' where us_id = '{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        die('解封成功！');
}