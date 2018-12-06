<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/6
 * Time: 下午3:24
 */
require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

lock_auto();

function lock_auto(){

    $db = new DB_COM();
    $sql = 'select phone,amount from big_account_lock ';
    $db->query($sql);
    $bInfo = $db->fetchAll();
    $flag = 1;
    foreach($bInfo as $k=>$v)
    {
        $tmp_phone = $v['phone'];
        $tmp_amount = $v['amount'];
        $sql = "select us_id from us_bind  where SUBSTR(bind_info,4,100) = {$tmp_phone}";
        $db->query($sql);
        if($db->fetchRow()){
            if(!(ba_cut($tmp_amount)&&us_add()&&log_info()))
                die($flag);
        }
        $flag ++;
    }
    die($flag.'success');
}

function ba_cut($amount){
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount - $amount*100000000 where  ba_id='6C69520E-E454-127B-F474-452E65A3EE75'";
    $db->query($sql);
    $res = $db->affectedRows();
    if($res)
    {
        return true;
    }
    return false;
}
function us_add($amount,$us_id){
    $db = new DB_COM();
    $sql = "update us_base set lock_amount = lock_amount+$amount*100000000 where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    return false;

}
function log_info(){
    return true;
}
