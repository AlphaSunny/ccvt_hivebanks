<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//因时间原因,未封装,后面有时间封装


$day_start = strtotime(date('Y-m-d 08:00:00')); //早上八点
$day_end = strtotime(date('Y-m-d 22:00:00'));    //晚上十点

$db = new DB_COM();
$unit = get_la_base_unit();
//获取ba信息
$ba_info = get_ba_base_info();
//查询所有能送ccvt的群组
$sql = "select * from bot_group WHERE is_audit=2 AND is_test=1 AND is_give_ccvt=1";
$db->query($sql);
$groups = $db->fetchAll();
if ($groups){
    $pInTrans = $db->StartTrans();  //开启事务
    $ba_account = 0;
    foreach ($groups as $a=>$b){
        set_time_limit(0);
        //查询机器人昵称
        $sql = "select bot_name from bot_status WHERE us_id='{$b['us_id']}'";
        $db->query($sql);
        $bot_name = $db->getField($sql,'bot_name');
        $sql = "select wechat,count(bot_message_id) as count from bot_message where group_id='{$b['id']}' AND type='Text' AND CHAR_LENGTH(bot_content)>=5 AND is_effective='0' AND bot_content not LIKE '%@{$bot_name}%' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by wechat";
        $db->query($sql);
        $rows = $db->fetchAll();
        if ($rows){
            foreach ($rows as $k=>$v){
                set_time_limit(0);
                //判断用户表是否有这个微信
                $u_id = get_us_id($v['wechat']);
                if (!$u_id){
                    continue;
                }

                //判断用户是否积分为负数,
                $glory_integral = check_glory_integral($u_id);
                if ($glory_integral==1){
                    continue;
                }

                //判断当前用户绑定的是否是这个群
                $us_group = get_us_bind_group_id($u_id);
                if (!$us_group || $us_group!=$b['id']){
                    continue;
                }
                //判断今日是否已经增过币
                $send = send_money_if($ba_info['ba_id'],$v['wechat']);
                if ($send){
                    $db->Rollback($pInTrans);
                    echo $v['wechat']."已增过币";
                    continue;
                }

                //送币

                //获取等级(用户等级和群组等级对应)
                $sca = get_us_scale($u_id);      //用户等级
                $scale = "select * from bot_level_rules WHERE us_level='{$sca}' AND group_level='{$b['scale']}' limit 1";
                $db->query($scale);
                $s = $db->fetchRow();

                $give_account = $v['count'] >=5 ? $s['max_send'] : $v['count']*$s['one_send'];

                $sql = "update us_base set base_amount=base_amount+'{$give_account}'*'{$unit}' WHERE us_id='{$u_id}'";
                $db -> query($sql);
                if (!$db->affectedRows()){
                    $db->Rollback($pInTrans);
                    echo "us修改余额失败";
                    break;
                }

                //ba减钱
                $sql = "update ba_base set base_amount=base_amount-'{$give_account}'*'{$unit}' WHERE ba_id='{$ba_info['ba_id']}'";
                $db -> query($sql);
                if (!$db->affectedRows()){
                    $db->Rollback($pInTrans);
                    echo "ba修改余额失败";
                    break;
                }

                //增币记录
                $d['bot_ls_id'] = get_guid();
                $d['ba_id'] = $ba_info['ba_id'];
                $d['wechat'] = $v['wechat'];
                $d['num'] = $v['count'];
                $d['amount'] = $give_account*$unit;
                $d['is_replacement'] = 0;
                $d['send_time'] = date('Y-m-d H:i:s',time());
                $d['bot_create_time'] = time();
                $lgn_type = 'phone';
                $d['tx_hash'] = hash('md5', $ba_info['ba_id'] . $lgn_type . get_ip() . time() . date('Y-m-d H:i:s'));
                $d['us_id'] = $u_id;
                $d['group_id'] = $b['id'];
                $d['group_name'] = $b['name'];
                $d['bot_us_id'] = $b['us_id'];
                $sql = $db->sqlInsert("bot_Iss_records", $d);
                $id = $db->query($sql);
                if (!$id){
                    $db->Rollback($pInTrans);
                    echo "添加记录失败";
                    break;
                }

                if ($ba_account==0){
                    $ba_account = $ba_info['base_amount']-($give_account*$unit);
                }else{
                    $ba_account = $ba_account-($give_account*$unit);
                }

                /******************************转账记录表***************************************************/
                if ($k==0){
                    $transfer_get_pre_count = transfer_get_pre_count($ba_info['ba_id']);
                }else{
                    $transfer_get_pre_count = $transfer_get_pre_count+1;
                }
                //赠送者
                $data['hash_id'] = hash('sha256', $ba_info['ba_id'] . 4 . get_ip() . time() . rand(1000, 9999) . microtime());
                $data['prvs_hash'] = get_pre_hash($ba_info['ba_id']);
                $data['credit_id'] = $ba_info['ba_id'];
                $data['debit_id'] = $u_id;
                $data['tx_amount'] = -($give_account*$unit);
                $data['credit_balance'] = $ba_account;
                $data['tx_hash'] = hash('sha256', $ba_info['ba_id'] . 4 . get_ip() . time() . microtime());
                $data['flag'] = 4;
                $data['transfer_type'] = 'ba-us';
                $data['transfer_state'] = 1;
                $data['tx_detail'] = "聊天奖励";
                $data['give_or_receive'] = 1;
                $data['ctime'] = time();
                $data['utime'] = date('Y-m-d H:i:s',time());
                $data['tx_count'] = $transfer_get_pre_count;
                $sql = $db->sqlInsert("com_transfer_request", $data);
                $id = $db->query($sql);
                if (!$id){
                    $db->Rollback($pInTrans);
                    break;
                }
                //接收者
                $dat['hash_id'] = hash('sha256', $u_id . 4 . get_ip() . time() . rand(1000, 9999) . microtime());
                $prvs_hash = get_pre_hash($u_id);
                $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
                $dat['credit_id'] = $u_id;
                $dat['debit_id'] = $ba_info['ba_id'];
                $dat['tx_amount'] = $give_account*$unit;
                $dat['credit_balance'] = get_us_account($u_id)+($give_account*$unit);
                $dat['tx_hash'] = hash('sha256', $u_id . 4 . get_ip() . time() . microtime());
                $dat['flag'] = 4;
                $dat['transfer_type'] = 'ba-us';
                $dat['transfer_state'] = 1;
                $dat['tx_detail'] = "聊天奖励";
                $dat['give_or_receive'] = 2;
                $dat['ctime'] = time();
                $dat['utime'] = date('Y-m-d H:i:s',time());
                $dat['tx_count'] = transfer_get_pre_count($u_id);
                $sql = $db->sqlInsert("com_transfer_request", $dat);
                $id = $db->query($sql);
                if (!$id){
                    $db->Rollback($pInTrans);
                    break;
                }

                /***********************资金变动记录表***********************************/
                //us添加基准资产变动记录
                $us_type = 'us_send_balance';
                $ctime = date('Y-m-d H:i:s');
                $tx_id = hash('sha256', $u_id . $ba_info['ba_id'] . get_ip() . time() . microtime());
                $com_balance_us['hash_id'] = hash('sha256', $u_id . $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
                $com_balance_us['tx_id'] = $tx_id;
                $com_balance_us['prvs_hash'] = get_recharge_pre_hash($u_id);
                $com_balance_us["credit_id"] = $u_id;
                $com_balance_us["debit_id"] = $ba_info['ba_id'];
                $com_balance_us["tx_type"] = "ba_send";
                $com_balance_us["tx_amount"] = $give_account*$unit;
                $com_balance_us["credit_balance"] = get_us_account($u_id)+($give_account*$unit);
                $com_balance_us["utime"] = time();
                $com_balance_us["ctime"] = $ctime;
                $com_balance_us['tx_count'] = base_get_pre_count($u_id);

                $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
                if (!$db->query($sql)) {
                    $db->Rollback($pInTrans);
                    break;
                }
                if ($k==0){
                    $base_get_pre_count = base_get_pre_count($ba_info['ba_id']);
                }else{
                    $base_get_pre_count = $base_get_pre_count+1;
                }
                //ba添加基准资产变动记录
                $us_type = 'ba_send_balance';
                $com_balance_ba['hash_id'] = hash('sha256', $ba_info['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
                $com_balance_ba['tx_id'] = $tx_id;
                $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($ba_info['ba_id']);
                $com_balance_ba["credit_id"] = $ba_info['ba_id'];
                $com_balance_ba["debit_id"] = $u_id;
                $com_balance_ba["tx_type"] = "ba_send";
                $com_balance_ba["tx_amount"] = -($give_account*$unit);
                $com_balance_ba["credit_balance"] = $ba_account;
                $com_balance_ba["utime"] = time();
                $com_balance_ba["ctime"] = $ctime;
                $com_balance_ba['tx_count'] = $base_get_pre_count;

                $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
                if (!$db->query($sql)) {
                    $db->Rollback($pInTrans);
                    break;
                }

            }
        }
    }
    $db->Commit($pInTrans);
}

//给群主反40%
$start = strtotime(date('Y-m-d 00:00:00'));
$end = strtotime(date('Y-m-d 23:59:59'));

$sql = "select sum(amount)/'{$unit}' as all_amount,bot_us_id from bot_Iss_records WHERE bot_create_time BETWEEN '{$start}' AND '{$end}' GROUP BY bot_us_id";
$db->query($sql);
$grous = $db->fetchAll();
if ($grous){
    $pInTrans = $db->StartTrans();  //开启事务
    $ba_account = 0;
    foreach ($grous as $k=>$v){
        set_time_limit(0);
        if ($v['bot_us_id']!='' || $v['bot_us_id']!=NULL){
            $u_id = $v['bot_us_id'];

            //判断今日已经返现过
            $check_return = check_is_return($u_id);
            if ($check_return){
//                $db->Rollback($pInTrans);
                echo "已经返现过";
                continue;
            }

            //修改余额
            $give_account = round($v['all_amount']*0.4)*$unit;
            if ($give_account<=0){
//                $db->Rollback($pInTrans);
                echo "金额为0";
                continue;
            }
            $sql = "update us_base set base_amount=base_amount+'{$give_account}' WHERE us_id='{$u_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                echo "us修改余额失败";
                break;
            }
            //ba减钱
            $sql = "update ba_base set base_amount=base_amount-'{$give_account}' WHERE ba_id='{$ba_info['ba_id']}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                echo "ba修改余额失败";
                break;
            }
            if ($ba_account==0){
                $ba_account = $ba_info['base_amount']-($give_account);
            }else{
                $ba_account = $ba_account-($give_account);
            }
            /******************************转账记录表***************************************************/
            //赠送者
            if ($k==0){
                $transfer_get_pre_count = transfer_get_pre_count($ba_info['ba_id']);
            }else{
                $transfer_get_pre_count = $transfer_get_pre_count+1;
            }
            $data['hash_id'] = hash('sha256', $ba_info['ba_id'] . 12 . get_ip() . time() . rand(1000, 9999) . microtime());
            $data['prvs_hash'] = get_pre_hash($ba_info['ba_id']);
            $data['credit_id'] = $ba_info['ba_id'];
            $data['debit_id'] = $u_id;
            $data['tx_amount'] = -$give_account;
            $data['credit_balance'] = $ba_account;
            $data['tx_hash'] = hash('sha256', $ba_info['ba_id'] . 12 . get_ip() . time() . microtime());
            $data['flag'] = 12;
            $data['transfer_type'] = 'ba-us';
            $data['transfer_state'] = 1;
            $data['tx_detail'] = "群主返现";
            $data['give_or_receive'] = 1;
            $data['ctime'] = time();
            $data['utime'] = date('Y-m-d H:i:s',time());
            $data['tx_count'] = $transfer_get_pre_count;
            $sql = $db->sqlInsert("com_transfer_request", $data);
            $id = $db->query($sql);
            if (!$id){
                $db->Rollback($pInTrans);
                break;
            }
            //接收者
            $dat['hash_id'] = hash('sha256', $u_id . 12 . get_ip() . time() . rand(1000, 9999) . microtime());
            $prvs_hash = get_pre_hash($u_id);
            $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
            $dat['credit_id'] = $u_id;
            $dat['debit_id'] = $ba_info['ba_id'];
            $dat['tx_amount'] = $give_account;
            $dat['credit_balance'] = get_us_account($u_id)+($give_account);
            $dat['tx_hash'] = hash('sha256', $u_id . 12 . get_ip() . time() . microtime());
            $dat['flag'] = 12;
            $dat['transfer_type'] = 'ba-us';
            $dat['transfer_state'] = 1;
            $dat['tx_detail'] = "群主返现";
            $dat['give_or_receive'] = 2;
            $dat['ctime'] = time();
            $dat['utime'] = date('Y-m-d H:i:s',time());
            $dat['tx_count'] = transfer_get_pre_count($u_id);
            $sql = $db->sqlInsert("com_transfer_request", $dat);
            $id = $db->query($sql);
            if (!$id){
                $db->Rollback($pInTrans);
                break;
            }

            /***********************资金变动记录表***********************************/
            //us添加基准资产变动记录
            $us_type = 'us_send_balance';
            $ctime = date('Y-m-d H:i:s');
            $tx_id = hash('sha256', $u_id . $ba_info['ba_id'] . get_ip() . time() . microtime());
            $com_balance_us['hash_id'] = hash('sha256', $u_id . $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
            $com_balance_us['tx_id'] = $tx_id;
            $com_balance_us['prvs_hash'] = get_recharge_pre_hash($u_id);
            $com_balance_us["credit_id"] = $u_id;
            $com_balance_us["debit_id"] = $ba_info['ba_id'];
            $com_balance_us["tx_type"] = "group_cashback";
            $com_balance_us["tx_amount"] = $give_account;
            $com_balance_us["credit_balance"] = get_us_account($u_id)+($give_account);
            $com_balance_us["utime"] = time();
            $com_balance_us["ctime"] = $ctime;
            $com_balance_us['tx_count'] = base_get_pre_count($u_id);

            $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
            if (!$db->query($sql)) {
                $db->Rollback($pInTrans);
                break;
            }
            if ($k==0){
                $base_get_pre_count = base_get_pre_count($ba_info['ba_id']);
            }else{
                $base_get_pre_count = $base_get_pre_count+1;
            }
            //ba添加基准资产变动记录
            $us_type = 'ba_send_balance';
            $com_balance_ba['hash_id'] = hash('sha256', $ba_info['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . microtime());
            $com_balance_ba['tx_id'] = $tx_id;
            $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($ba_info['ba_id']);
            $com_balance_ba["credit_id"] = $ba_info['ba_id'];
            $com_balance_ba["debit_id"] = $u_id;
            $com_balance_ba["tx_type"] = "group_cashback";
            $com_balance_ba["tx_amount"] = -$give_account;
            $com_balance_ba["credit_balance"] = $ba_account;
            $com_balance_ba["utime"] = time();
            $com_balance_ba["ctime"] = $ctime;
            $com_balance_ba['tx_count'] = $base_get_pre_count;

            $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
            if (!$db->query($sql)) {
                $db->Rollback($pInTrans);
                break;
            }
        }
    }
    $db->Commit($pInTrans);
}



echo "OK!";

//判断用户积分是否为负数
function check_glory_integral($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$us_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    $status = 0;
    if ($row){
        if ($row['base_amount']<0){
            $status = 1;
        }
    }
    return $status;
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
    $wechat = str_replace("'"," ",$wechat);
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
//判断是否今日群主已经返现
function check_is_return($us_id){
    $db = new DB_COM();
    $start = strtotime(date('Y-m-d 16:00:00'));
    $end = strtotime(date('Y-m-d 23:59:59'));
    $sql = "select * from com_base_balance WHERE credit_id='{$us_id}' AND tx_type='group_cashback' AND utime BETWEEN '{$start}' AND '{$end}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

//======================================
// 函数: 获取充值的前置hash
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