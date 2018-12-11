<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/11
 * Time: 下午3:22
 */


ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


us_id();

function us_id(){
    $db = new DB_COM();
    $sql = 'select phone from big_account_lock';
    $db->query($sql);
    $res = $db->fetchAll();
    $flag = 1;
    if($res){
        foreach ($res as $k => $v){
            $phone = $v['phone'] ;
            $sql = "select us_id from us_bind  where SUBSTR(bind_info,4,100) = {$phone}";
            $db->query($sql);
            $res = $db->fetchRow();
            $us_id = $res['us_id'];

            $sql = "update big_account_lock set lock_time = '2018-12-10 10:08:41' and us_id = '{$us_id}' where phone = {$phone}";
            $db->query($sql);
            if(!$db->affectedRows())
                die('failed'.$flag);
            $flag++;
        }
    }
    die('success'.$flag);

}