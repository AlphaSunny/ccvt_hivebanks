<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//二级邀请补发
$ba_id = get_ba_base_info()['ba_id'];
$db = new DB_COM();
//$sql = "select * from us_base WHERE invite_code!=0";
//$db->query($sql);
//$rows = $db->fetchAll();
//foreach ($rows as $k=>$v){
//    $sql = "select us_id from us_base WHERE us_nm=(select invite_code from us_base WHERE us_nm='{$v['invite_code']}')";
//    $db->query($sql);
//    $us_id = $db->getField($sql,'us_id');
//    if ($us_id){
//        $time = date('Y-m-d H:i:s');
//        into_transfer($us_id,'20'*get_la_base_unit(),$time,'2',"二级邀请赠送","two_invite_send","ba-us",$ba_id);
//    }
//}

$sql = "select * from us_base WHERE 1";
$db->query($sql);
$rows = $db->fetchAll();
foreach ($rows as $k=>$v){
    $sql = "select count(us_id) as count from us_base WHERE invite_code in (select us_nm from us_base WHERE invite_code='{$v['us_nm']}' GROUP BY us_nm)";
    $db->query($sql);
    $data = $db->fetchRow();
    if ($data['count']>0){
        $time = date('Y-m-d H:i:s');
        into_transfer($v['us_id'],$data['count']*"20"*get_la_base_unit(),$time,'2',"二级邀请赠送(补发)","two_invite_send","ba-us",$ba_id);
    }


}

echo "OK!";


function into_transfer($us_id,$send_money,$time,$flag,$detail,$type,$transfer_type,$ba_id){
    $db = new DB_COM();

    $sql = "update us_base set base_amount=base_amount+'{$send_money}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        echo "us加钱(减钱)错误";
    }

    //ba减钱
    $sql = "update ba_base set base_amount=base_amount-'{$send_money}' WHERE ba_id='{$ba_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        echo "ba减钱错误";
    }

    /******************************转账记录表***************************************************/
    //赠送者
    $data['hash_id'] = hash('md5', $ba_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($ba_id);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $ba_id;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $send_money;
    $data['credit_balance'] = get_ba_account($ba_id);
    $data['tx_hash'] = hash('md5', $ba_id . $flag . get_ip() . time() . microtime());
    $data['flag'] = $flag;
    $data['transfer_type'] = $transfer_type;
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $detail;
    $data['give_or_receive'] = 1;
    $data['ctime'] = strtotime($time);
    $data['utime'] = $time;
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        echo $us_id."转账记录表错误";
    }

    //接收者
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
    $prvs_hash = get_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $ba_id;
    $dat['tx_amount'] = $send_money;
    $dat['credit_balance'] = get_us_account($us_id);
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
    $dat['flag'] = $flag;
    $dat['transfer_type'] = $transfer_type;
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $detail;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = strtotime($time);
    $dat['utime'] = $time;
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        echo $us_id."转账记录表错误";
    }

    /***********************资金变动记录表***********************************/
    //us添加基准资产变动记录
    $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_us['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $ba_id;
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $send_money;
    $com_balance_us["credit_balance"] = get_us_account($us_id);
    $com_balance_us["utime"] = strtotime($time);
    $com_balance_us["ctime"] = $time;
    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        echo $us_id."资金变动记录表";
    }

    //ba添加基准资产变动记录
    $com_balance_ba['hash_id'] = hash('md5', $ba_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
    $com_balance_ba['tx_id'] = $data['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($ba_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $ba_id;
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $send_money;
    $com_balance_ba["credit_balance"] = get_ba_account($ba_id);
    $com_balance_ba["utime"] = strtotime($time);
    $com_balance_ba["ctime"] = $time;
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        echo $ba_id."资金变动记录表";
    }
}

//查询ba是否有余额且ba的余额是否够今日增送的额度
function sel_ba_amout($ba_id,$day_start,$day_end){
    $db = new DB_COM();
    $remark = 0;
    //ba余额
    $db->query("select base_amount from ba_base where ba_id='{$ba_id}'");
    $ba_amount = $db->fetchRow();
    if (!$ba_amount || $ba_amount['base_amount']<=0){
        $remark = -1;
    }
    $unit = get_la_base_unit();

    $ba_amount = $ba_amount['base_amount']<=0 ? $ba_amount['base_amount'] : $ba_amount['base_amount']/$unit;
    //这个ba微信用户今日发言数
    $db->query("select * from bot_message where ba_id='{$ba_id}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'");
    $count = $db->affectedRows();
    if ($ba_amount<$count){
        $remark = -1;
    }

    $data['remark'] = $remark;
    $data['ba_amount'] = $ba_amount;
    $data['message_count'] = $count;
    return $data;
}

//判断是否今日已经增过币
function send_money_if($ba_id,$wechat){
    $db = new DB_COM();
    $start = strtotime(date('Y-m-d 00:00:00'));
    $end = strtotime(date('Y-m-d 23:59:59'));
    $sql = "select * from bot_Iss_records WHERE ba_id='{$ba_id}' AND wechat='{$wechat}' AND bot_create_time BETWEEN '{$start}' AND '{$end}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//获取ba信息
function get_ba_base_info(){
    $db = new DB_COM();
    $sql = "select * from ba_base ORDER BY ctime asc limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}


//获取us_id
function get_us_id($wechat){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE wechat='{$wechat}' limit 1";
    $db->query($sql);
    $us_id = $db -> getField($sql,'us_id');
    if($us_id == null)
        return 0;
    return $us_id;
}
//用户绑定群id
function get_us_bind_group_id($us_id){
    $db = new DB_COM();
    $sql = "select bind_info from us_bind WHERE us_id='{$us_id}' AND bind_name='group' limit 1";
    $db->query($sql);
    $group_id = $db -> getField($sql,'bind_info');
    if($group_id == null)
        return 0;
    return $group_id;
}
//获取用户等级
function get_us_scale($us_id){
    $db = new DB_COM();
    $sql = "select scale from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $scale = $db -> getField($sql,'scale');
    return $scale;
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


//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取上传交易hash
//======================================
function get_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}