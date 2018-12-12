<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


$db = new DB_COM();

$unit = get_la_base_unit();

//注册
//$sql = "select us_id,ctime from us_base WHERE 1";
//$db->query($sql);
//$reg_user = $db->fetchAll();
//foreach ($reg_user as $k=>$v){
//    if ($v['ctime']<'2018-10-01 00:00:00'){
//        $send_money = "1000"*$unit;
//    }elseif($v['ctime']>='2018-10-01 00:00:00' and $v['ctime']<'2018-10-07 23:59:59'){
//        $send_money = "500"*$unit;
//    }else{
//        $send_money = "50"*$unit;
//    }
//    $reg_user[$k]['send_money'] = $send_money;
//    $reg_user[$k]['flag'] = 1;
//    $reg_user[$k]['detail'] = "注册赠送";
//    $reg_user[$k]['type'] = "reg_send";
//}

//邀请
//$sql = "select b.us_id,a.ctime from us_base as a LEFT JOIN us_base as b on a.invite_code=b.us_nm WHERE a.invite_code!=0";
//$db->query($sql);
//$invite_rows = $db->fetchAll();
//foreach ($invite_rows as $k=>$v){
//    $invite_rows[$k]['send_money'] = "50"*$unit;
//    $invite_rows[$k]['flag'] = 2;
//    $invite_rows[$k]['detail'] = "邀请赠送";
//    $invite_rows[$k]['type'] = "invite_send";
//}

//群聊奖励
//$sql = "select us_id,send_time as ctime,amount as send_money from bot_Iss_records where 1";
//$db->query($sql);
//$bot_rows = $db->fetchAll();
//foreach ($bot_rows as $k=>$v){
//    $bot_rows[$k]['flag'] = 4;
//    $bot_rows[$k]['detail'] = "聊天奖励";
//    $bot_rows[$k]['type'] = "ba_send";
//}

//点赞(点踩)(ccvt兑换积分)
$sql = "select credit_id as us_id,utime as ctime,tx_amount as send_money,tx_detail as detail,state as flag from us_glory_integral_change_log WHERE 1";
$db->query($sql);
$glory = $db->fetchAll();
foreach ($glory as $k=>$v){
    if ($v['flag']==1 && $v['detail']=="点赞"){
        $flag = 5;
        $type = "give_like";
    }elseif ($v['flag']==1 && $v['detail']=="ccvt兑换积分"){
        $flag = 8;
        $type = "ccvt_inte";
    }elseif ($v['flag']==2){
        $flag = 6;
        $type = "give_like";
    }
    $glory[$k]['flag'] = $flag;
    $glory[$k]['type'] = $type;
}
print_r($glory);
echo count($glory);
die;




echo "ok";



function into_transfer($us_id,$send_money,$time,$flag,$detail,$type){
    $db = new DB_COM();
    $unit = get_la_base_unit();
    //us加钱
    $sql = "update us_base set base_amount=base_amount+'{$send_money}'*'{$unit}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        echo "us加钱错误";
        die;
    }

    //ba减钱
    $ba_id = get_ba_id();


    $sql = "update ba_base set base_amount=base_amount-'{$send_money}'*'{$unit}' WHERE ba_id='{$ba_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        echo "ba减钱错误";
        die;
    }

/******************************转账记录表***************************************************/
    //赠送者
    $data['hash_id'] = hash('md5', $ba_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($ba_id);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $ba_id;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $send_money*$unit;
    $data['credit_balance'] = get_ba_base_amount($data['credit_id']);
    $data['tx_hash'] = hash('md5', $ba_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $detail;
    $data['give_or_receive'] = 1;
    $data['ctime'] = strtotime($time);
    $data['utime'] = $time;
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        echo $us_id."错误";
        die();
    }

    //接收者
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $ba_id;
    $dat['tx_amount'] = $send_money*$unit;
    $dat['credit_balance'] = get_us_base_amount($us_id);
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $detail;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = strtotime($time);
    $dat['utime'] = $time;
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        echo $us_id."错误";
        die();
    }


    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_us['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $ba_id;
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $send_money*$unit;
    $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
    $com_balance_us["utime"] = strtotime($time);
    $com_balance_us["ctime"] = $time;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        return false;
    }

   //ba添加基准资产变动记录
    $us_type = 'ba_give_balance';
    $com_balance_ba['hash_id'] = hash('md5', $ba_id. $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_ba['tx_id'] = $data['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($ba_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $ba_id;
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $send_money*$unit;
    $com_balance_ba["credit_balance"] = get_ba_base_amount($ba_id);
    $com_balance_ba["utime"] = strtotime($time);
    $com_balance_ba["ctime"] = $time;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        return false;
    }
}





//获取ba余额
function get_ba_base_amount($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}

//获取us余额
function get_us_base_amount($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


//======================================
// 函数: 获取上传交易hash
//======================================
function get_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取资金变动记录表的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

function get_ba_id(){
    $db = new DB_COM();
    $sql = "select ba_id from ba_base limit 1";
    $ba_id = $db->getField($sql,'ba_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
}

function get_us_id($invite_code){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE us_nm='{$invite_code}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];
}