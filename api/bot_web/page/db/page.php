<?php

//======================================
// 函数: 点赞功能
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function give_like_us($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $unit = la_unit();

    //积分变动记录表
    $d['hash_id'] = hash('md5', $data['us_id'] . 'give_like_us' . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $d['credit_id'] = $data['us_id'];
    $d['debit_id'] = $data['give_us_id'];
    $d['tx_amount'] = $data['give_num']*$unit;
    $d['ctime'] = time();
    $d['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("us_glory_integral_change_log", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //用户减钱

    $sql = "update us_base set base_amount=base_amount-'{$data['give_num']}'*'{$unit}' WHERE us_id='{$data['us_id']}'";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //la加钱
    $sql = "update la_base set base_amount=base_amount+'{$data['give_num']}'*'{$unit}' limit 1";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //增加荣耀积分
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$data['us_id']}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set base_amount=base_amount+'{$data['give_num']}'*'{$unit}' WHERE asset_id='GLOP' AND us_id='{$data['us_id']}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return 0;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$data['us_id']}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $data['us_id'];
        $asset['us_nm'] = $us_base['us_nm'];
        $asset['us_account'] = $us_base['us_account'];
        $asset['base_amount'] = $data['give_num']*$unit;
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
    //赠送者
    $transfer['hash_id'] = hash('md5', $data['us_id'] . 5 . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($data['us_id']);
    $transfer['prvs_hash'] = $prvs_hash == 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $data['us_id'];
    $transfer['debit_id'] = $data['give_us_id'];
    $transfer['tx_amount'] = $data['give_num']*$unit;
    $transfer['credit_balance'] = get_us_base_amount($transfer['credit_id']);
    $transfer['tx_hash'] = hash('md5', $data['us_id'] . 5 . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = 5;
    $transfer['transfer_type'] = 1;
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = '点赞消耗';
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }
    echo 5;

    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $transfer['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $data['give_us_id'];
    $com_balance_us["tx_type"] = 'give_like';
    $com_balance_us["tx_amount"] = $data['give_num']*$unit;
    $com_balance_us["credit_balance"] = get_us_base_amount($data['us_id']);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    echo 6;



    $db->Commit($pInTrans);
    return true;
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

//获取us余额
function get_us_base_amount($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


//======================================
// 函数: 获取点赞最大值
//======================================
function get_max_give_like()
{
    $db = new DB_COM();
    $sql = "SELECT max_give_like FROM bot_status limit 1";
    $db -> query($sql);
    $row = $db -> getField($sql,'max_give_like');
    return $row;
}

//======================================
// 函数: 判断是否当日已经达到最大上限
//======================================
function check_max_give($us_id,$give_num)
{
    $db = new DB_COM();
    $max = get_max_give_like();
    $unit = la_unit();
    $start = strtotime(date('Y-m-d 00:00:00'));
    $end  = strtotime(date('Y-m-d 23:59:59'));
    $sql = "SELECT sum(tx_amount)/'{$unit}' as give_all FROM us_glory_integral_change_log WHERE credit_id='{$us_id}' AND ctime BETWEEN '{$start}' AND '{$end}'";
    $db -> query($sql);
    $give_all= $db -> getField($sql,'give_all');
    if ($give_all==$max){
        return 1;
    }elseif($give_num+$give_all>$max){
        return 2;
    }else{
        return 3;
    }
}

//la汇率
function la_unit(){
    $db = new DB_COM();
    $sql = "select unit from la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['unit'];
}
