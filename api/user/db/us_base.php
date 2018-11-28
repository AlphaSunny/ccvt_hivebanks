<?php

/**
 * 检查邀请码是否存在
 * @param $invite_check
 * @return bool
 */
function invite_code_check($invite_check){

    $db = new DB_COM();
    $sql = "select us_nm from us_base where us_nm='{$invite_check}'";
    $db->query($sql);
    if($db->fetchRow())
        return true;
    return false;

}

/**
 * 根据邀请码获取用户
 * @param $invite_check
 * @return bool
 */
function get_invite_code_us($invite_check){

    $db = new DB_COM();
    $sql = "select us_id from us_base where us_nm='{$invite_check}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];

}

//======================================
// 函数: 创建注册用户
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function ins_base_user_reg_base_info($data_base)
{
    $data_base['base_amount'] = 0;
    $data_base['lock_amount'] =0;
    $data_base['us_level'] = 0;
    $data_base['security_level'] = 2;
    $data_base['utime'] = time();
    $data_base['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db ->sqlInsert("us_base", $data_base);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;

    //2018年 10.1-10.7注册送500ccvt
//    $array = array('2018-10-01','2018-10-02','2018-10-03','2018-10-04','2018-10-05','2018-10-06','2018-10-07');
//    $now = date('Y-m-d');
//    if(in_array($now,$array)){
//        send_to_us_ccvt($data_base['us_id'],'reg_send','500');
//    }


    //注册获取50ccvt
    send_to_us_ccvt($data_base['us_id'],'reg_send','50','注册赠送','1');
    //邀请人获取50ccvt
    if (isset($data_base['invite_code'])){
        send_to_us_ccvt(get_invite_code_us($data_base['invite_code']),'invite_send','50','邀请赠送','2');
    }




    return true;
}






//======================================
// 函数: 注册创建用户时给送糖果(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt($us_id,$type,$money,$why,$flag)
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
    //增币记录   赠送者
    $data['hash_id'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $money*$unit;
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-$data['tx_amount'];
    $data['tx_hash'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
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
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $rows['ba_id'];
    $dat['tx_amount'] = $money*$unit;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
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
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $data['tx_hash'];
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
    $com_balance_ba['hash_id'] = hash('md5', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $data['tx_hash'];
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


//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}' limit 1";
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
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  ctime DESC LIMIT 1";
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
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}













//======================================
// 函数: 获取用户基本信息
// 参数: token               用户token
// 返回: rows                用户基本信息数组
//         us_id            用户id
//         rest_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//======================================
function get_us_base_info_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();

    $sql = "select base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$us_id}'";
    $db->query($sql);
    $us_asset = $db->fetchRow();
    if (!$us_asset){
        $glory_of_integral = 0;
    }else{
        $glory_of_integral = $us_asset['base_amount'];
    }
    $row['glory_of_integral'] = $glory_of_integral;

    return $row;
}
//======================================
// 函数: 获取用户安全等级
// 参数: us_id            用户id
// 返回: security_level   用户安全等级
//======================================
function get_us_security_level_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT security_level FROM us_base WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $security_level = $db->getField($sql,'security_level');
    return $security_level;
}
//======================================
// 函数: 更新用户基本信息数据
// 参数: data_base            用户信息数组
// 返回: true                  成功
//       false                 失败
//======================================
function upd_us_base($data_base){
    $db = new DB_COM();
    $data_base['ctime'] = time();
    $where = "us_id = '{$data_base['us_id']}'";
    $sql = $db -> sqlUpdate('us_base', $data_base, $where);
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 更新用户安全等级数据
// 参数: us_id                用户id
// 返回: true                  成功
//       false                 失败
//======================================
function  upd_savf_level($us_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE us_base SET security_level = '{$savf_level}' WHERE us_id = '{$us_id}'";
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 检测用户是否存在
// 参数: us_id                用户id
// 返回: row                  用户信息数组
//======================================
function chexk_us_exit($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
    $db -> query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 更新用户的昵称
// 参数: us_id            用户id
//      us_account       用户的昵称
// 返回: id               成功id
//======================================
function  upd_us_accout($us_id,$us_account)
{
    $db = new DB_COM();
    $sql = "select * from us_base WHERE us_account='{$us_account}'AND us_id!='{$us_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        return false;
    }
    $sql = "UPDATE us_base SET us_account = '{$us_account}' WHERE us_id = '{$us_id}'";
    $id = $db -> query($sql);
    return $id;
}

//======================================
// 函数: 判断兑换码正确
// 参数:
//
// 返回: row           最新信息数组
//======================================
function check_voucher($voucher)
{
    $db = new DB_COM();
    $sql = "select * from us_voucher WHERE coupon_code='{$voucher}'";
    $db->query($sql);
    $vou = $db->fetchRow();
    if (!$vou){
        return 2;
    }elseif(strtotime($vou['expiry_date'])<time()){
        $sql = "update us_voucher set is_effective=2 WHERE id='{$vou['id']}'";
        $db -> query($sql);
        return 4;
    }elseif($vou['is_effective']!=1){
        return 3;
    }
}
//======================================
// 函数: 兑换
// 参数:
//
// 返回: row           最新信息数组
//======================================
function us_voucher($us_id,$voucher)
{
    //转账
    send_to_us_ccvt_voucher($us_id,$voucher,'7','兑换码兑换','voucher');
    return true;
}

//======================================
// 函数: 兑换码兑换(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt_voucher($us_id,$voucher,$flag,$why,$type)
{
    $db = new DB_COM();

    $sql = "select * from us_voucher WHERE coupon_code='{$voucher}'";
    $db->query($sql);
    $vou = $db->fetchRow();

    $pInTrans = $db->StartTrans();  //开启事务

    $money = $vou['amount'];

    $exchange_time = date('Y-m-d H:i:s');

    //修改兑换码表
    $sql = "update us_voucher set is_effective=2,us_id='{$us_id}',exchange_time='{$exchange_time}' WHERE id='{$vou['id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

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
    $data['hash_id'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $money*$unit;
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-$data['tx_amount'];
    $data['tx_hash'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
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
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $rows['ba_id'];
    $dat['tx_amount'] = $money*$unit;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
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
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $data['tx_hash'];
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
    $com_balance_ba['hash_id'] = hash('md5', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $data['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($rows['ba_id']);
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

//======================================
// 函数: 判断用户余额是否有
// 参数: us_id                用户id
// 返回: true                  成功
//       false                 失败
//======================================
function  check_us_amount($us_id,$account)
{
    $unit = get_la_base_unit();
    $us_account = get_us_account($us_id)/$unit;
    if ($us_account<$account){
        return false;
    }
    return true;

}

//======================================
// 函数: ccvt转换积分
// 参数:
//
// 返回: row           最新信息数组
//======================================
function turn_ccvt_integral($us_id,$account)
{
    //转换积分
    us_ccvt_to_integral($us_id,$account,'8','ccvt兑换积分','ccvt_inte');
    return true;
}


//======================================
// 函数: ccvt转换积分(荣耀积分的变动)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function us_ccvt_to_integral($us_id,$account,$flag,$why,$type)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $unit = get_la_base_unit();

    $us_account = get_us_account($us_id)/$unit;
    if ($us_account<$account){
        $db->Rollback($pInTrans);
        return 0;
    }

    //积分变动记录表
    $d['hash_id'] = hash('md5', $us_id . 'give_like_us' . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $d['credit_id'] = $us_id;
    $d['debit_id'] = $us_id;
    $d['tx_amount'] = $account*$unit;
    $d['ctime'] = time();
    $d['utime'] = date('Y-m-d H:i:s');
    $d['state'] = 1;
    $d['tx_detail'] = $why;
    $sql = $db->sqlInsert("us_glory_integral_change_log", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //用户减钱

    $sql = "update us_base set base_amount=base_amount-'{$account}'*'{$unit}' WHERE us_id='{$us_id}'";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //la加钱
    $sql = "update la_base set base_amount=base_amount+'{$account}'*'{$unit}' limit 1";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //增加荣耀积分(减少荣耀积分)
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$us_id}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set base_amount=base_amount+'{$account}'*'{$unit}' WHERE asset_id='GLOP' AND us_id='{$us_id}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return 0;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$us_id}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $us_id;
        $asset['us_nm'] = $us_base['us_nm'];
        $asset['us_account'] = $us_base['us_account'];
        $asset['base_amount'] = $account*$unit;
        $asset['lock_amount'] = 0;
        $asset['utime'] = time();
        $asset['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_asset", $asset);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return 0;
        }
    }


    /******************************转账记录表***************************************************/
    $la_id = get_la_id();
    //赠送者
    $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $transfer['prvs_hash'] = $prvs_hash == 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $us_id;
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = $account*$unit;
    $transfer['credit_balance'] = get_us_account($transfer['credit_id'])-$transfer['tx_amount'];
    $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $why;
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //接收者(la)
    $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $la_id;
    $dat['debit_id'] = $us_id;
    $dat['tx_amount'] = $account*$unit;
    $dat['credit_balance'] = get_la_base_amount($la_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $la_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-la';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $why;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $transfer['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $la_id;
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $account*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id)-$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }

    //la添加基准资产变动记录
    $us_type = 'la_get_balance';
    $com_balance_ba['hash_id'] = hash('md5', $la_id. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($la_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $account*$unit;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id)+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }



    $db->Commit($pInTrans);
    return true;

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

//获取用户荣耀积分
function get_us_integral($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$us_id}' limit 1";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


/**
 * @param $us_nm
 * @return bool
 * 判断该用户是否在邀请黑名单
 */
function black_list($us_nm){

    $db = new DB_COM();
    $sql = "select a.us_id from la_black_list a,us_base b where us_nm = {$us_nm} and a.us_id=b.us_id and a.black_info = 'invite_invalid'";
    $db->query($sql);

    if($db->fetchRow())
        return true;
    return false;
}

/**
 * @param $us_nm
 * @return bool
 * 把恶意刷注册量者加入黑名单
 */
function black_action($us_nm){

    $db = new DB_COM();
    $sql = "select us_id from us_base where us_nm = {$us_nm}";
    $db->query($sql);
    $us_id = $db->fetchRow();
    $us_id = $us_id['us_id'];

    $data_base['us_id'] = $us_id;
    $data_base['ctime'] = date('Y-m-d H:i:s',time());
    $data_base['black_info'] = 'invite_invalid';
    $sql = $db ->sqlInsert("la_black_list", $data_base);
    if($db->query($sql))
        return true;
    return false;

}

function black_judge($us_nm){

    //判断是否在黑名单中
    if(black_list($us_nm))
        return true;

    //注册间隔低于一分钟出现三次的，拉黑
    $db = new DB_COM();
    $sql = "select ctime from us_base where invite_code = {$us_nm} order by ctime desc";
    $db->query($sql);
    $count = $db->fetchAll();
    $flag = 0;
    if($count){
        foreach ($count as $key=>$value){
            var_dump($value['ctime']);
            var_dump(next($count)['ctime']);
            var_dump(strtotime($value['ctime'])- strtotime(next($count)['ctime']));
            if(strtotime($value['ctime'])- strtotime(next($count)['ctime'])<60)
                $flag ++;

            var_dump($flag);
            if($flag>1){
                black_action($us_nm);
                return true;
            }
        }
    }
    return false;

    //同一ip一分钟内注册多次的，拉黑


}