<?php

//======================================
// 函数: 获取ba用户基本信息
// 参数: ba_id            用户ba_id
// 返回: row              用户基本信息数组
//         ba_id            用户id
//         base_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//         ba_type          代理商类型
//         ba_level         安全等级
//======================================
function get_ba_base_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取ba用户ba_id
// 参数: bit_type            代理商类型
// 返回: ba_id               用户ba_id
//======================================
function  us_get_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT ba_id FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $ba_id = $db -> getField($sql,'ba_id');
    return $ba_id;
}
//======================================
// 函数: 更新ba用户base_amount
// 参数: ba_id             用户ba_id
//      base_amount       订单base_amount
// 返回: true              更新成功
// 返回: false              更新失败
//======================================
function upd_ba_base_amount_info($ba_id,$base_amount) {
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET base_amount = '{$base_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 插入ba_base ba用户基本信息
// 参数: data_base             用户基本信息数组
//        base_amount         用户id
//        lock_amount         用户可用余额
//        ba_level            用户锁定余额
//        security_level      用户安全等级
//        ba_id               用户ba_id
//        ba_type             代理商类型
//        utime               用户更新时间
//        ctime               用户创建时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_base_ba_reg_base_info($data_base)
{
    $data_base['base_amount'] = 0;
    $data_base['lock_amount'] =0;
    $data_base['ba_level'] = 0;
    $data_base['security_level'] = 2;
    $data_base['utime'] = time();
    $data_base['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db ->sqlInsert("ba_base", $data_base);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 拒绝充值订单，更新用户base_amount,lock_amount
// 参数: ba_id            用户ba_id
//      base_amount       充值订单基准货币金额
//      lock_amount       充值订单基准货币锁定金额
// 返回: true              更新成功
// 返回: false             更新失败
//======================================
function upd_refuse_ba_base_amount_info($ba_id,$base_amount,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_base_amount = $rows["base_amount"] + $base_amount;
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ba_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 接受充值订单，更新用户lock_amount
// 参数: ba_id              用户ba_id
//      lock_amount        充值订单基准货币锁定金额
// 返回: true               更新成功
// 返回: false              更新失败
//======================================
function upd_ba_lock_amount_info($ba_id,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT lock_amount FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    //目前lock_amount-该订单的lock_amount
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ba_base SET lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);

    return $count;
}
//======================================
// 函数: 更新ba用户security_level
// 参数: ba_id            用户ba_id
//      savf_level        安全等级
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function  upd_savf_level($ba_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET security_level = '{$savf_level}' WHERE ba_id = '{$ba_id}'";
    $id = $db -> query($sql);
    return $id;
}
//======================================
// 函数: 更新ba用户的昵称
// 参数: ba_id            用户ba_id
//      ba_account       用户的昵称
// 返回: id                成功id
//======================================
function  upd_ba_accout($ba_id,$ba_account)
{
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET ba_account = '{$ba_account}' WHERE ba_id = '{$ba_id}'";
    $id = $db -> query($sql);
    return $id;
}
//======================================
// 函数: 获取基准ba用户列表的昵称
// 参数: bit_type          基准货币类型
// 返回: row               ba用户列表
//======================================
function get_base_ba_list($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_type = '{$bit_type}' and base_amount > 0 limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取ba用户设定的汇率的昵称
// 参数: bit_type          基准货币类型
// 返回: row               ba用户列表
//======================================
function  ba_get_base_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}


//======================================
// 函数: 判断是否存在ccvt用户账号
// 参数: account          账号
// 返回:
//======================================
function  check_us_account($account)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base where us_account = '{$account}' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: ba转账
// 参数: $data        内容
// 返回:
//======================================
function  send_ccvt_record($data)
{
    //转账
    send_to_us_ccvt($data['us_id'],'ba_tran',$data['num'],'3',$data['why']);
    return true;
}


//======================================
// 函数: ba转账(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt($us_id,$type,$money,$flag,$why)
{
    $db = new DB_COM();

    $pInTrans = $db->StartTrans();  //开启事务
    //送币
    $unit = get_la_base_unit();
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
    //增币记录  赠送者
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
    $prvs_hash = get_recharge_pre_hash_ba($us_id);
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
    $prvs_hash = get_recharge_pre_hash_ba($rows['ba_id']);
    $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
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
function  get_recharge_pre_hash_ba($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取上传交易hash
//======================================
function get_transfer_pre_hash_ba($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}