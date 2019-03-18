<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

die;
//if (time()<1543579200){
//    die;
//}
//等级提升程序(每次只能升一级)

$db = new DB_COM();
$unit = get_la_base_unit();
$sql = "select us_id,base_amount/'{$unit}' as base_amount,us_account from us_asset WHERE asset_id='GLOP' AND (base_amount/$unit)>=100 ORDER BY base_amount DESC ";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    //积分
    foreach ($rows as $k=>$v){
        set_time_limit(0);
        $scale = $v['base_amount'];
        $us_scale = get_us_base($v['us_id'])['scale'];
        if ($us_scale!=1){
            //判断等级提升
            scale_upgrade($v['us_id'],$scale,$v['us_account']);
        }
//        else{
//            echo "已完成升级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$v['us_account']."<br />";
//        }
    }
}

//echo "OK";

function scale_upgrade($us_id,$scale,$us_account){

    //判断是否可以升级
    $us_scale = get_us_base($us_id)['scale'];
    //获取当前积分的等级
    $sca = get_scale_info($scale);
    if($us_scale<$sca['scale']){
        $db = new DB_COM();
        $pInTrans = $db->StartTrans();  //开启事务
        //升级记录表
        $data2['change_id'] = get_guid();
        $data2['us_id'] = $us_id;
        $data2['before_scale'] = $us_scale;
        $data2['after_scale'] = 1;
        $data2['scale'] = $scale;
        $data2['utime'] = time();
        $data2['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_scale_changes", $data2);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            echo "添加记录失败";
        }

        //修改用户等级
        $sql = "update us_base set scale=1 WHERE us_id='{$us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "修改用户等级失败";
        }

        //返还50ccvt
        //ba减钱
        $money = "50";
        $unit = get_la_base_unit();
        $sql = "select * from ba_base ORDER BY ctime asc limit 1";
        $db->query($sql);
        $rows = $db->fetchRow();
        $sql = "update ba_base set base_amount=base_amount-'{$money}'*'{$unit}' WHERE ba_id='{$rows['ba_id']}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "ba减钱失败";
        }

        //返还50ccvt
        $sql = "update us_base set base_amount=base_amount+'{$money}'*'{$unit}' WHERE us_id='{$us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "us加钱失败";
        }

        $flag = "9";
        $type = "up_retuen";
        $why = "升级返还";

        /******************************转账记录表***************************************************/
        //增币记录   赠送者
        $data['hash_id'] = hash('sha256', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
        $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
        $data['credit_id'] = $rows['ba_id'];
        $data['debit_id'] = $us_id;
        $data['tx_amount'] = $money*$unit;
        $data['credit_balance'] = get_ba_account($rows['ba_id'])-$data['tx_amount'];
        $data['tx_hash'] = hash('sha256', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $data['flag'] = $flag;
        $data['transfer_type'] = 'ba-us';
        $data['transfer_state'] = 1;
        $data['tx_detail'] = $why;
        $data['give_or_receive'] = 1;
        $data['ctime'] = time();
        $data['utime'] = date('Y-m-d H:i:s',time());
        $sql = $db->sqlInsert("com_transfer_request", $data);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
        }

        //接收者
        $dat['hash_id'] = hash('sha256', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_transfer_pre_hash($us_id);
        $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
        $dat['credit_id'] = $us_id;
        $dat['debit_id'] = $rows['ba_id'];
        $dat['tx_amount'] = $money*$unit;
        $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
        $dat['tx_hash'] = hash('sha256', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $dat['flag'] = $flag;
        $dat['transfer_type'] = 'ba-us';
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $why;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = time();
        $dat['utime'] = date('Y-m-d H:i:s',time());;
        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
        }

        /***********************资金变动记录表***********************************/
        //us添加基准资产变动记录
        $us_type = 'us_reg_send_balance';
        $ctime = date('Y-m-d H:i:s');
        $tx_id = hash('sha256', $us_id . $rows['ba_id'] . get_ip() . time() . microtime());
        $com_balance_us['hash_id'] = hash('sha256', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $tx_id;
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $rows['ba_id'];
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $money*$unit;
        $com_balance_us["credit_balance"] = get_us_account($us_id)+$com_balance_us["tx_amount"];
        $com_balance_us["utime"] = time();
        $com_balance_us["ctime"] = $ctime;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            $db->Rollback($pInTrans);
            return false;
        }

        //ba添加基准资产变动记录
        $us_type = 'ba_reg_send_balance';
        $com_balance_ba['hash_id'] = hash('sha256', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $tx_id;
        $prvs_hash = get_recharge_pre_hash($rows['ba_id']);
        $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_ba["credit_id"] = $rows['ba_id'];
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type;
        $com_balance_ba["tx_amount"] = $money*$unit;
        $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-$com_balance_ba["tx_amount"];
        $com_balance_ba["utime"] = time();
        $com_balance_ba["ctime"] = $ctime;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            $db->Rollback($pInTrans);
        }

        $db->Commit($pInTrans);
//        echo "升级完成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$us_account."<br />";
    }
}


//获取等级信息
function get_scale_info($scale){
    $db = new DB_COM();
    $sql = "select * from us_scale WHERE integral<='{$scale}' ORDER BY integral DESC limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

//获取用户信息
function get_us_base($us_id){
    $db = new DB_COM();
    $sql = "select * from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取上传交易hash
//======================================
function get_transfer_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}
//获取ba余额
function get_ba_account($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}