<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/30
 * Time: 下午1:32
 */

function reg_auto(){
    $db = new DB_COM();
    $sql = "select phone,name from big_account";
    $db->query($sql);
    $phones = $db->fetchAll();

    //判断有无注册信息
//    is_reg($phones);

    foreach ($phones as $k=>$v)
    {
        $pwd_origin = get_pwd(8);
        $tmp_phone = $v['phone'];
        if(!$tmp_phone)
            continue;
//        var_dump($v);
//        var_dump($tmp_phone);die;
        $sql = "select us_id from us_bind  where SUBSTR(bind_info,4,100) = {$tmp_phone}";
        $db->query($sql);
        if($db->fetchRow())
            continue;
        $bind_data = array();
        $bind_data['bind_flag'] = 1;
        $bind_data['bind_info'] = sha1($pwd_origin);
        $bind_data['bind_name'] = 'password_login';
        $bind_data['bind_type'] = 'hash';
        $bind_data['us_id'] = get_guid();
        $bind_data['bind_id'] = get_guid();
        $bind_data['utime'] = time();
        $bind_data['ctime'] = date('Y-m-d H:i:s',time());

        $sql = $db->sqlInsert('us_bind',$bind_data);
        $res_pwd = $db->query($sql);

        $bind_phone = array();
        $bind_phone['bind_info'] = '86-'.$tmp_phone;
        $bind_phone['bind_type'] = 'text';
        $bind_phone['bind_name'] = 'cellphone';
        $bind_phone['us_id'] = $bind_data['us_id'];
        $bind_phone['bind_id'] = get_guid();
        $bind_phone['utime'] = time();
        $bind_phone['ctime'] = date('Y-m-d H:i:s',time());
        $bind_phone['bind_flag'] = 1;
        $db->sqlInsert('us_bind',$bind_phone);

        $sql = $db->sqlInsert('us_bind',$bind_phone);
        $res_phone = $db->query($sql);

        $base_info = array();
        $base_info['us_account'] = 'ccvt_'.$tmp_phone;
        $base_info['us_id'] = $bind_data['us_id'];
        $base_info['base_amount'] = 0;
        $base_info['security_level'] = 2;
        $base_info['utime'] = time();
        $base_info['ctime'] = date('Y-m-d H:i:s' , time());
        $db->sqlInsert('us_base',$base_info);


        $sql = $db->sqlInsert('us_base',$base_info);
        $res_base = $db->query($sql);

        $BI_info = array();
        $BI_info['us_id'] = $base_info['us_id'];
        $BI_info['name'] = $v['name'];
        $BI_info['pwd'] = $pwd_origin;
        $BI_info['ctime'] = date("Y-m-d H:i:s",time());
        $BI_info['us_account'] = $base_info['us_account'];

        $sql = $db->sqlInsert('big_account_info',$BI_info);
        $BI_info_res = $db->query($sql);


        if(!($res_pwd&&$res_phone&&$res_base&&$BI_info_res&&gift_ccvt($BI_info['us_id'],'reg_send',50,'注册赠送',1)))
            die('2');

    }

        die('1');

}

function gift_ccvt($us_id,$type,$money,$why,$flag){

    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    //送币
    $unit = 100000000;
    $sql = "update us_base set base_amount=base_amount+'{$money}'*'{$unit}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //ba减钱
    $sql = "select * from ba_base ORDER BY ctime asc limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();

    $sql = "update ba_base set base_amount=base_amount-'{$money}'*'{$unit}' WHERE ba_id='{$rows['ba_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }


    /******************************转账记录表***************************************************/
    //增币记录   赠送者
    $data['hash_id'] = hash('sha256', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
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
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('sha256', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
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
        return false;
    }

    /***********************资金变动记录表***********************************/
    //us添加基准资产变动记录
    $us_type = 'us_reg_send_balance';
    $ctime = date('Y-m-d H:i:s');
    $tx_id = hash('sha256', $us_id . $rows['ba_id'] . get_ip() . time() . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
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
    $com_balance_ba['hash_id'] = hash('sha256', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
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
        return false;
    }

    $db->Commit($pInTrans);
    return true;
}

function get_pwd($length){

    $string = '8a5b2de3fh4iyj9mcnpk6qrs7tuvwxgz';


    $res = '';
    for ($i = 0 ; $i<$length;$i++){
        $random = rand(0,29);
        $res .= substr($string,$random,1);
    }

    return $res;

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



