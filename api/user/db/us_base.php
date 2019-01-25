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
    $sql = "select us_id,invite_code from us_base where us_nm='{$invite_check}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;

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


    //注册获取50ccvt
    send_to_us_ccvt($data_base['us_id'],'reg_send','50','注册赠送','1');
    //邀请人获取50ccvt
    if (isset($data_base['invite_code'])){
        send_to_us_ccvt(get_invite_code_us($data_base['invite_code'])['us_id'],'invite_send','50','邀请赠送','2');
        //父级赠送20ccvt
        $father_invite_code = get_invite_code_us($data_base['invite_code'])['invite_code'];
        if ($father_invite_code!=0){
            send_to_us_ccvt(get_invite_code_us($father_invite_code)['us_id'],'two_invite_send','20','二级邀请赠送','2');
        }
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
    $data['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$rows['ba_id']) : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = -($money*$unit);
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-($money*$unit);
    $data['tx_hash'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $why;
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $data["tx_count"] = transfer_get_pre_count($rows['ba_id']);
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
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
    $dat["tx_count"] = transfer_get_pre_count($us_id);
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
    $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $money*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id)+$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us["tx_count"] = base_get_pre_count($us_id);

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
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$rows['ba_id']) : $prvs_hash;
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = -($money*$unit);
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-($money*$unit);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($rows['ba_id']);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;


}

//获取用户可用余额
function get_us_available_account($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}' limit 1";
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

    $sql = "select g.name from us_bind as b INNER JOIN bot_group as g on b.bind_info=g.id WHERE b.us_id='{$us_id}' AND b.bind_type='text' AND b.bind_name='group'";
    $db->query($sql);
    $group = $db->fetchRow();
    $row['group_name'] = $group['name'];

    //获取申请的群
    $sql = "select name,group_type from bot_group WHERE us_id='{$us_id}' ORDER BY id ASC limit 1";
    $db->query($sql);
    $application_group = $db->fetchRow();
    $row['application_group'] = $application_group ? $application_group['name'] : "";
    $row['application_group_type'] = $application_group ? $application_group['group_type'] : "";

    //离下一级差多荣耀积分
    $sql = "select integral from us_scale WHERE scale='{$row['scale']}'+1";
    $db->query($sql);
    $next = $db->getField($sql,'integral');
    $row['next'] = $next;
    $next_scale_poor = $next-$glory_of_integral;
    echo $next_scale_poor;die;
    $row['next_scale_poor'] = $next_scale_poor >=0 ? $next_scale_poor : 0;


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
    $data['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = -($money*$unit);
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-($money*$unit);
    $data['tx_hash'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $why;
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $data["tx_count"] = transfer_get_pre_count($rows['ba_id']);
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
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
    $dat["tx_count"] = transfer_get_pre_count($us_id);
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
    $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $money*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id)+$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us["tx_count"] = base_get_pre_count($us_id);

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
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = -($money*$unit);
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-($money*$unit);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($rows['ba_id']);

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
    $us_account = get_us_available_account($us_id)/$unit;
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
    $transfer['prvs_hash'] = $prvs_hash === 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $us_id;
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = -($account*$unit);
    $transfer['credit_balance'] = get_us_account($transfer['credit_id'])-($account*$unit);
    $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $why;
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $transfer["tx_count"] = transfer_get_pre_count($us_id);
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //接收者(la)
    $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $dat['hash_id'] : $prvs_hash;
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
    $dat["tx_count"] = transfer_get_pre_count($la_id);
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
    $com_balance_us['prvs_hash'] = $prvs_hash===0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $la_id;
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = -($account*$unit);
    $com_balance_us["credit_balance"] = get_us_account($us_id)-($account*$unit);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');
    $com_balance_us["tx_count"] = base_get_pre_count($us_id);

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
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $account*$unit;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id)+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($la_id);
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

/**
 * @param $us_nm
 * @return bool
 * 判断是否是白帽子
 */
function white_hat($us_nm){
    $db = new DB_COM();

    $sql = "select a.us_id from la_black_list a,us_base b where a.black_info = 'white_hat' and b.us_nm = '{$us_nm}' and b.us_id=a.us_id";
    $db->query($sql);
    $res = $db->fetchRow();
    if($res)
        return true;
    return false;
}

function black_judge($us_nm){

    return false;
    //判断是否是白帽子
    if(white_hat($us_nm))
        return false;

    //判断是否在黑名单中
    if(black_list($us_nm))
        return true;

    //注册间隔低于一分钟且来自同一ip同一邀请码的，拉黑
    $db = new DB_COM();
    $sql = "select ctime,reg_ip from us_base where invite_code = {$us_nm} order by ctime desc";
    $db->query($sql);
    $count = $db->fetchAll();
    if($count){
        foreach ($count as $key=>$value){

            if($key+1==count($count))
                continue;
            if(strtotime($value['ctime'])- strtotime($count[$key+1]['ctime'])<60 && $value['reg_ip'] == $count[$key+1]['reg_ip'] &&$value['reg_ip']!=NULL)
            {
                black_action($us_nm);
                return true;
            }
        }
    }

    return false;

}

//======================================
// 函数: 判断资金密码
// 参数: account          账号
// 返回:
//======================================
function check_pass_hash($us_id,$pass_hash)
{
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM us_bind where us_id = '{$us_id}' AND bind_name='pass_hash' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    if (!$row){
        return false;
    }else{
        if ($row['bind_info']!=$pass_hash){
            return false;
        }
    }
    return true;
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
// 函数: 用户转账(记录转账记录表)
// 参数: $data        内容
// 返回:
//======================================
function  us_us_transfer_request($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务

    //扣除用户可用余额(加入锁定金额)
    $unit = get_la_base_unit();
    $sql = "update us_base set base_amount=base_amount-'{$data['num']}'*'{$unit}' WHERE us_id='{$data['us_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //加入锁定金额
    $sql = "update us_base set lock_amount=lock_amount+'{$data['num']}'*'{$unit}' WHERE us_id='{$data['trans_us_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //转账记录表
    $d['us_id'] = $data['us_id'];
    $d['transfer_id'] = $data['trans_us_id'];
    $d['tx_amount'] = $data['num']*$unit;
    $d['tx_hash'] = hash('md5', $data['us_id'] . $data['trans_us_id'] . get_ip() . time() . date('Y-m-d H:i:s'));
    $d['tx_time'] = date('Y-m-d H:i:s',time());
    $d['utime'] = time();
    $sql = $db->sqlInsert("us_us_transfer_request", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    /******************************转账记录表***************************************************/
    $flag = 13;
    $why = "用户转账";
    //增币记录  赠送者
    $transfer['hash_id'] = hash('md5', $data['us_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($data['us_id']);
    $transfer['prvs_hash'] = $prvs_hash === 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $data['us_id'];
    $transfer['debit_id'] = $data['trans_us_id'];
    $transfer['tx_amount'] = -($data['num']*$unit);
    $transfer['credit_balance'] = get_us_account($data['us_id'])-($data['num']*$unit);
    $transfer['tx_hash'] = hash('md5', $data['us_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-us';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $why;
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s',time());
    $transfer["tx_count"] = transfer_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('md5', $data['trans_us_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($data['trans_us_id']);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $data['trans_us_id'];
    $dat['debit_id'] = $data['us_id'];
    $dat['tx_amount'] = $data['num']*$unit;
    $dat['credit_balance'] = get_us_account($data['trans_us_id'])+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $data['trans_us_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $why;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());
    $dat["tx_count"] = transfer_get_pre_count($data['trans_us_id']);
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
    $com_balance_us['hash_id'] = hash('md5', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $transfer['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $data['trans_us_id'];
    $com_balance_us["tx_type"] = "us_us_transfer_out";
    $com_balance_us["tx_amount"] = -($data['num']*$unit);
    $com_balance_us["credit_balance"] = get_us_account($data['us_id'])-($data['num']*$unit);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us["tx_count"] = base_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    //us添加基准资产变动记录
    $us_type = 'ba_reg_send_balance';
    $com_balance_ba['hash_id'] = hash('md5', $data['trans_us_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($data['trans_us_id']);
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $data['trans_us_id'];
    $com_balance_ba["debit_id"] = $data['us_id'];
    $com_balance_ba["tx_type"] = "us_us_transfer_in";
    $com_balance_ba["tx_amount"] = $data['num']*$unit;
    $com_balance_ba["credit_balance"] = get_us_account($data['trans_us_id'])+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($data['trans_us_id']);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;

}
//======================================
// 函数: 用户转账
// 参数: $data        内容
// 返回:
//======================================
function  us_send_ccvt_record($us_id,$qa_id,$qa_flag)
{
    $db = new  DB_COM();
    $sql = "select * from us_us_transfer_request WHERE qa_id='{$qa_id}' AND us_id='{$us_id}' AND qa_flag=0";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        //转账
        us_send_ccvt($row['us_id'],$row['transfer_id'],$row['tx_amount'],'16',"转账撤回",$qa_flag,$qa_id);
        return true;
    }
    return false;
}

//======================================
// 函数: 转账(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function us_send_ccvt($us_id,$trans_us_id,$money,$flag,$why,$qa_flag,$qa_id)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    if ($qa_flag==2){
        //订单取消
        //转账us加钱
        $sql = "update us_base set base_amount=base_amount+'{$money}' WHERE us_id='{$us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return false;
        }

        //被转us减钱(锁定金额减)
        $sql = "update us_base set lock_amount=lock_amount-'{$money}' WHERE us_id='{$trans_us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return false;
        }

        /******************************转账记录表***************************************************/
        //增币记录  赠送者
        $data['hash_id'] = hash('md5', $trans_us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
        $prvs_hash = get_transfer_pre_hash($trans_us_id);
        $data['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
        $data['credit_id'] = $trans_us_id;
        $data['debit_id'] = $us_id;
        $data['tx_amount'] = -($money);
        $data['credit_balance'] = get_us_account($trans_us_id)-$money;
        $data['tx_hash'] = hash('md5', $trans_us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $data['flag'] = $flag;
        $data['transfer_type'] = 'us-us';
        $data['transfer_state'] = 1;
        $data['tx_detail'] = $why;
        $data['give_or_receive'] = 1;
        $data['ctime'] = time();
        $data['utime'] = date('Y-m-d H:i:s',time());
        $data["tx_count"] = transfer_get_pre_count($trans_us_id);
        $sql = $db->sqlInsert("com_transfer_request", $data);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return false;
        }

        //接收者
        $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
        $prvs_hash = get_transfer_pre_hash($us_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
        $dat['credit_id'] = $us_id;
        $dat['debit_id'] = $trans_us_id;
        $dat['tx_amount'] = $money;
        $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
        $dat['tx_hash'] = hash('md5', $trans_us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $dat['flag'] = $flag;
        $dat['transfer_type'] = 'us-us';
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $why;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = time();
        $dat['utime'] = date('Y-m-d H:i:s',time());
        $dat["tx_count"] = transfer_get_pre_count($us_id);
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
        $com_balance_us['hash_id'] = hash('md5', $trans_us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
        $com_balance_us['tx_id'] = $data['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($trans_us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
        $com_balance_us["credit_id"] = $trans_us_id;
        $com_balance_us["debit_id"] = $us_id;
        $com_balance_us["tx_type"] = "us_us_transfer_cancel";
        $com_balance_us["tx_amount"] = -($money);
        $com_balance_us["credit_balance"] = get_us_account($trans_us_id)-$money;
        $com_balance_us["utime"] = time();
        $com_balance_us["ctime"] = $ctime;
        $com_balance_us["tx_count"] = base_get_pre_count($trans_us_id);
        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            $db->Rollback($pInTrans);
            return false;
        }

        //us添加基准资产变动记录
        $us_type = 'ba_reg_send_balance';
        $com_balance_ba['hash_id'] = hash('md5', $us_id. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
        $com_balance_ba['tx_id'] = $data['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
        $com_balance_ba["credit_id"] = $us_id;
        $com_balance_ba["debit_id"] = $trans_us_id;
        $com_balance_ba["tx_type"] = "us_us_transfer_cancel";
        $com_balance_ba["tx_amount"] = $money;
        $com_balance_ba["credit_balance"] = get_us_account($us_id)+$com_balance_ba["tx_amount"];
        $com_balance_ba["utime"] = time();
        $com_balance_ba["ctime"] = $ctime;
        $com_balance_ba["tx_count"] = base_get_pre_count($us_id);
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            $db->Rollback($pInTrans);
            return false;
        }

    }elseif ($qa_flag==1){
        //被转账us锁定金额转到可用余额
        $sql = "update us_base set base_amount=base_amount+'{$money}',lock_amount=lock_amount-'{$money}' WHERE us_id='{$trans_us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return false;
        }
    }

    //修改订单状态
    $utime = time();
    $sql = "update us_us_transfer_request set utime='{$utime}',qa_flag='{$qa_flag}' WHERE qa_id='{$qa_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;


}

//======================================
// 函数: 根据code获取微信号
// 参数: code          code
// 返回:
//======================================
function  get_code_wechat($code)
{
    $db = new DB_COM();
    $sql = "select wechat from bot_exclusive_code WHERE code='{$code}' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}


/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_base_balance表）
 */
function base_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by ctime desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;

    return $tx_count+1;
}

/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_transfer_request表）
 */
function transfer_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by ctime desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;
    return $tx_count+1;
}