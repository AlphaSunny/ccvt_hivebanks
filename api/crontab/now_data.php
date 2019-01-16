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
//    $reg_user[$k]['transfer_type'] = "ba-us";
//}

//二级邀请奖励
$sql = "select us_id,ctime from us_base WHERE 1";
$db->query($sql);
$two_invite_send = $db->fetchAll();
foreach ($two_invite_send as $k=>$v){
    $sql = "select count(us_id) as count from us_base WHERE invite_code in (select us_nm from us_base WHERE invite_code=(select us_nm from us_base WHERE us_id='{$v['us_id']}') GROUP BY us_nm)";
    echo $sql;
    $db->query($sql);
    $data = $db->fetchRow();
    if ($data['count']==0){
        unset($two_invite_send[$k]);
    }else{
        $two_invite_send[$k]['send_money'] = $data['count']*20*$unit;
        $two_invite_send[$k]['ctime'] = date('Y-m-d H:i:s',strtotime($v['ctime'])+10);
        $two_invite_send[$k]['flag'] = 2;
        $two_invite_send[$k]['detail'] = "二级邀请赠送";
        $two_invite_send[$k]['type'] = "two_invite_send";
        $two_invite_send[$k]['transfer_type'] = "ba-us";
    }
}

print_r($two_invite_send);die;

//邀请
$sql = "select b.us_id,a.ctime from us_base as a LEFT JOIN us_base as b on a.invite_code=b.us_nm WHERE a.invite_code!=0";
$db->query($sql);
$invite_rows = $db->fetchAll();
foreach ($invite_rows as $k=>$v){
    $invite_rows[$k]['send_money'] = "50"*$unit;
    $invite_rows[$k]['flag'] = 2;
    $invite_rows[$k]['detail'] = "邀请赠送";
    $invite_rows[$k]['type'] = "invite_send";
    $invite_rows[$k]['transfer_type'] = "ba-us";
}



//群聊奖励
$sql = "select us_id,send_time as ctime,amount as send_money from bot_Iss_records where 1";
$db->query($sql);
$bot_rows = $db->fetchAll();
foreach ($bot_rows as $k=>$v){
    $bot_rows[$k]['flag'] = 4;
    $bot_rows[$k]['detail'] = "聊天奖励";
    $bot_rows[$k]['type'] = "ba_send";
    $bot_rows[$k]['transfer_type'] = "ba-us";
}


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
    $glory[$k]['transfer_type'] = "us-la";
}


//兑换码兑换
$sql = "select us_id,amount as send_money,exchange_time as ctime from us_voucher WHERE is_effective=2";
$db->query($sql);
$voucher = $db->fetchAll();
foreach ($voucher as $k=>$v){
    $voucher[$k]['send_money'] = $v['send_money']*$unit;
    $voucher[$k]['flag'] = 7;
    $voucher[$k]['detail'] = "兑换码兑换";
    $voucher[$k]['type'] = "voucher";
    $voucher[$k]['transfer_type'] = "ba-us";
}


//ba调账(活动奖励啥的)
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=3 AND give_or_receive=2";
$db->query($sql);
$tiaozhang = $db->fetchAll();
foreach ($tiaozhang as $k=>$v){
    $tiaozhang[$k]['type'] = "ba_tran";
    $tiaozhang[$k]['transfer_type'] = "ba-us";
}


//升级返还
$sql = "select us_id,ctime from us_scale_changes WHERE 1";
$db->query($sql);
$scale_changes = $db->fetchAll();
foreach ($scale_changes as $k=>$v){
    $scale_changes[$k]['send_money'] = "50"*$unit;
    $scale_changes[$k]['flag'] = 9;
    $scale_changes[$k]['detail'] = "升级返还";
    $scale_changes[$k]['type'] = "up_retuen";
    $scale_changes[$k]['transfer_type'] = "ba-us";
}


//锁仓(锁仓余额)
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=10 AND give_or_receive=2";
$db->query($sql);
$suocang = $db->fetchAll();
foreach ($suocang as $k=>$v){
    $suocang[$k]['type'] = "big_us_lock";
    $suocang[$k]['transfer_type'] = "ba-us";
}


$list = array_merge($reg_user,$invite_rows,$bot_rows,$glory,$voucher,$tiaozhang,$scale_changes,$suocang);
array_multisort(array_column($list,'ctime'),SORT_ASC,$list);

echo count($list);
die;
$ba_id = get_ba_id();
$la_id = get_la_id();
foreach ($list as $k=>$v){
    set_time_limit(0);
    into_transfer($v['us_id'],$v['send_money'],$v['ctime'],$v['flag'],$v['detail'],$v['type'],$v['transfer_type'],$ba_id,$la_id);
}


echo "ok";



function into_transfer($us_id,$send_money,$time,$flag,$detail,$type,$transfer_type,$ba_id,$la_id){
    $db = new DB_COM();
    //us加钱(减钱)
    if ($flag==10){
        //锁仓
        $sql = "update us_base set lock_amount=lock_amount+'{$send_money}' WHERE us_id='{$us_id}'";
        echo $sql;
        $db -> query($sql);
        if (!$db->affectedRows()){
            echo "us锁仓错误";
            file_put_contents("fail.log","us锁仓错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
        }
    }else{
        if ($transfer_type=='us-la'){
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql;
        }else{
            $sql = "update us_base set base_amount=base_amount+'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql;
        }
        $db -> query($sql);
        if (!$db->affectedRows()){
            file_put_contents("fail.log","us加钱(减钱)错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo "us加钱(减钱)错误";
        }
    }

    if ($transfer_type!='us-la'){
        //ba减钱
        $sql = "update ba_base set base_amount=base_amount-'{$send_money}' WHERE ba_id='{$ba_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            file_put_contents("fail.log","ba减钱错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo "ba减钱错误";
        }
    }else{
        //la加钱
        $sql = "update la_base set base_amount=base_amount+'{$send_money}' limit 1";
        $db->query($sql);
        if (!$db->affectedRows()){
            file_put_contents("fail.log","la加钱错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo "la加钱错误";
        }
    }

/******************************转账记录表***************************************************/
    if ($transfer_type=='ba-us'){
        //赠送者
        $data['hash_id'] = hash('md5', $ba_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($ba_id);
        $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
        $data['credit_id'] = $ba_id;
        $data['debit_id'] = $us_id;
        $data['tx_amount'] = $send_money;
        $data['credit_balance'] = get_ba_base_amount($data['credit_id']);
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
            file_put_contents("fail.log","转账记录表错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $us_id."转账记录表错误";
        }

        //接收者
        $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($us_id);
        $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
        $dat['credit_id'] = $us_id;
        $dat['debit_id'] = $ba_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = get_us_base_amount($us_id);
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
            file_put_contents("fail.log","转账记录表错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $us_id."转账记录表错误";
        }
    }elseif ($transfer_type=='us-la'){
        //赠送者
        $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($us_id);
        $transfer['prvs_hash'] = $prvs_hash == 0 ? $transfer['hash_id'] : $prvs_hash;
        $transfer['credit_id'] = $us_id;
        $transfer['debit_id'] = $la_id;
        $transfer['tx_amount'] = $send_money;
        $transfer['credit_balance'] = get_us_base_amount($us_id);
        $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
        $transfer['flag'] = $flag;
        $transfer['transfer_type'] = $transfer_type;
        $transfer['transfer_state'] = 1;
        $transfer['tx_detail'] = $detail;
        $transfer['give_or_receive'] = 1;
        $transfer['ctime'] = strtotime($time);
        $transfer['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $transfer);
        $id = $db->query($sql);
        if (!$id){
            file_put_contents("fail.log","转账记录表错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $us_id."转账记录表错误";
        }

        //接收者(la)
        $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($la_id);
        $dat['prvs_hash'] = $prvs_hash == 0 ? $dat['hash_id'] : $prvs_hash;
        $dat['credit_id'] = $la_id;
        $dat['debit_id'] = $us_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = get_la_base_amount($la_id);
        $dat['tx_hash'] = hash('md5', $la_id . $flag . get_ip() . time() . microtime());
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
            file_put_contents("fail.log","转账记录表错误"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $la_id."转账记录表错误";
        }
    }

    /***********************资金变动记录表***********************************/
    if ($transfer_type=='ba-us'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $ba_id;
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            file_put_contents("fail.log","资金变动记录表"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
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
        $com_balance_ba["credit_balance"] = get_ba_base_amount($ba_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            file_put_contents("fail.log","资金变动记录表"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $ba_id."资金变动记录表";
        }
    }elseif ($transfer_type=='us-la'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $transfer['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $la_id;
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            file_put_contents("fail.log","资金变动记录表"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $us_id."资金变动记录表";
        }

        //la添加基准资产变动记录
        $com_balance_ba['hash_id'] = hash('md5', $la_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($la_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_ba["credit_id"] = $la_id;
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type;
        $com_balance_ba["tx_amount"] = $send_money;
        $com_balance_ba["credit_balance"] = get_la_base_amount($la_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            file_put_contents("fail.log","资金变动记录表"."--".date('Y-m-d H:i:s',time())."\n",FILE_APPEND);
            echo $la_id."资金变动记录表";
        }
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
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}'";
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
    $sql = "select ba_id from ba_base ORDER BY ctime ASC limit 1";
    $ba_id = $db->getField($sql,'ba_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
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

function get_us_id($invite_code){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE us_nm='{$invite_code}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];
}