<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


die;

//荣耀积分移动

$db = new DB_COM();



//积分

$sql = "select * from us_glory_integral_change_log WHERE 1";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    foreach ($rows as $a=>$b){
        set_time_limit(0);
        $detail = $b['state'] == 1 ? "赞人消耗" : "踩人消耗";
        into_transfer($b['credit_id'],$b['debit_id'],$b['tx_amount'],$b['ctime'],$b['state'],$detail,'give_like');
    }
}else{
    echo "积分变动没有数据可以操作";
    die();
}

echo "ok";



function into_transfer($us_id,$give_us_id,$send_money,$time,$flag,$detail,$type){
    $db = new DB_COM();

    //us减钱
    $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        echo "us减钱错误";
        die;
    }

    //la加钱
    $sql = "update la_base set base_amount=base_amount+'{$send_money}' limit 1";
    $db->query($sql);
    if (!$db->affectedRows()){
        echo "la加钱错误";
        die;
    }


    //增加荣耀积分(减少荣耀积分)
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set";
        if ($flag==1){
            $sql .= " base_amount=base_amount+'{$send_money}'";
        }elseif ($flag==2){
            $sql .= " base_amount=base_amount-'{$send_money}'";
        }
        $sql .= " WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            echo "增加荣耀积分错误";
            die;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$give_us_id}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $give_us_id;
        $asset['us_nm'] = $us_base['us_nm'];
        $asset['us_account'] = $us_base['us_account'];
        $asset['base_amount'] = $send_money;
        $asset['lock_amount'] = 0;
        $asset['utime'] = time();
        $asset['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_asset", $asset);
        $id = $db->query($sql);
        if (!$id){
            echo "增加荣耀积分错误";
            die;
        }
    }

    /******************************转账记录表***************************************************/

    $la_id = get_la_id();
    $flag = $flag==1 ? 5 : 6;

    //赠送者
    $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($us_id);
    $transfer['prvs_hash'] = $prvs_hash == 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $us_id;
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = $send_money;
    $transfer['credit_balance'] = get_us_base_amount($transfer['credit_id']);
    $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s',$time));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $detail;
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = $time;
    $transfer['utime'] = date('Y-m-d H:i:s',$time);
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        echo "转账记录表错误";
        die;
    }


    //接收者(la)
    $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $la_id;
    $dat['debit_id'] = $us_id;
    $dat['tx_amount'] = $send_money;
    $dat['credit_balance'] = get_la_base_amount($la_id);
    $dat['tx_hash'] = hash('md5', $la_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-la';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $detail;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = $time;
    $dat['utime'] = date('Y-m-d H:i:s',$time);
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        echo "转账记录表错误";
        die;
    }

    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_us['tx_id'] = $transfer['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $give_us_id;
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $send_money;
    $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        echo "资金变动记录表错误";
        die;
    }
    //la添加基准资产变动记录
    $us_type = 'la_get_balance';
    $com_balance_ba['hash_id'] = hash('md5', $la_id. $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_ba['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($la_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $send_money;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        echo "资金变动记录表错误";
        die;
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
//获取la id
function get_la_id(){
    $db = new DB_COM();
    $sql = "select id from la_base limit 1";
    $db->query($sql);
    $id = $db->getField($sql,'id');
    return $id;
}

//获取la余额
function get_la_base_amount($la_id){
    $db = new DB_COM();
    $sql = "select base_amount from la_base WHERE id='{$la_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}