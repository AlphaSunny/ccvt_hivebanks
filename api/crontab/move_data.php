<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


$db = new DB_COM();


$sql = "select * from us_base where 1 ORDER BY ctime ASC ";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    foreach ($rows as $k=>$v){
        $sql = "select * from com_transfer_request WHERE debit_id='{$v['us_id']}' AND transfer_type=1 AND flag=1";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            if ($v['ctime']<'2018-10-01 00:00:00'){
                $send_money = "1000";
            }elseif($v['ctime']>='2018-10-01 00:00:00' and $v['ctime']<'2018-10-07 23:59:59'){
                $send_money = "500";
            }else{
                $send_money = "50";
            }
            into_transfer($v['us_id'],$send_money,$v['ctime'],1,'注册赠送');
        }
    }
}else{
    echo "注册赠送没有数据可以操作";
    die();
}

//邀请

//$sql = "select * from us_base WHERE invite_code!=0";
//$db->query($sql);
//$invite_rows = $db->fetchAll();
//if ($invite_rows){
//    foreach ($invite_rows as $a=>$b){
//        $invite_us_id = get_us_id($b['invite_code']);
//        $send_money = "50";
//        into_transfer($invite_us_id,$send_money,$b['ctime'],2,'邀请赠送');
//    }
//}else{
//    echo "邀请赠送没有数据可以操作";
//    die();
//}
//
////聊天奖励
//
//$sql = "select * from bot_Iss_records WHERE 1";
//$db->query($sql);
//$bot_rows = $db->fetchAll();
//if ($bot_rows){
//    foreach ($bot_rows as $c=>$d){
//        $send_money = $d['amount']/la_unit();
//        into_transfer($d['us_id'],$send_money,$d['send_time'],4,'聊天奖励');
//    }
//}else{
//    echo "聊天奖励没有数据可以操作";
//    die();
//}


echo "ok";



function into_transfer($us_id,$send_money,$time,$flag,$detail){
    $db = new DB_COM();

    //赠送者
    $data['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . $time);
    $data['prvs_hash'] = get_pre_hash(get_ba_id());
    $data['credit_id'] = get_ba_id();
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $send_money*la_unit();
    $data['credit_balance'] = get_ba_base_amount($data['credit_id']);
    $data['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 1;
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
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . $time);
    $dat['prvs_hash'] = get_pre_hash($us_id);
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = get_ba_id();
    $dat['tx_amount'] = $send_money*la_unit();
    $dat['credit_balance'] = get_us_base_amount($us_id);
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 1;
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

function get_ba_id(){
    $db = new DB_COM();
    $sql = "select ba_id from ba_base limit 1";
    $ba_id = $db->getField($sql,'ba_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
}
//la汇率
function la_unit(){
    $db = new DB_COM();
    $sql = "select unit from la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['unit'];
}

function get_us_id($invite_code){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE us_nm='{$invite_code}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];
}