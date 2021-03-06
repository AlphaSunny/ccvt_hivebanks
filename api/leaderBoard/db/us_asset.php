<?php

//======================================
// 函数: 获取荣耀积分记录总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_leaderboard_total($search_content,$group_id)
{
    $db = new DB_COM();
    $sql = "SELECT a.asset_id FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0";
    if ($search_content!=''){
        $sql .= " and b.wechat like '%{$search_content}%'";
    }
    $sql .= " and bind.bind_name='group'";
    if ($group_id!="all"){
        $sql .= " and bind.bind_info='{$group_id}'";
    }
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取荣耀积分记录
// 参数: $offset  $limit
// 返回: rows             用户登录信息数组
//======================================
function get_leaderboard($offset,$limit,$search_content,$group_id)
{
    $db = new DB_COM();
    $s_time = strtotime(date('Y-m-d 00:00:00'), time());
    $e_time = strtotime(date('Y-m-d 23:59:59'), time());
    $unit = get_la_base_unit();
    if ($search_content){
        $sql = "SELECT b.us_account,b.wechat,b.us_id,b.scale,gr.id as group_id,gr.name as group_name,
          (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点赞' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_praise,
          (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点踩' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_point_on 
          FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id LEFT JOIN bot_group as gr ON bind.bind_info=gr.id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0 and bind.bind_name='group'";
        if ($group_id!="all"){
            $sql .= " and bind.bind_info='{$group_id}'";
        }
        $sql .= " order by a.base_amount desc";
        $db->query($sql);
        $row1 = $db->fetchAll();
        foreach ($row1 as $k=>$v){
            $row1[$k]['sorting'] = $k+1;
        }

        $sql = "SELECT b.us_account,b.wechat,b.us_id,b.scale,gr.id as group_id,gr.name as group_name,
           (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点赞' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_praise,
           (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点踩' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_point_on 
           FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id LEFT JOIN bot_group as gr ON bind.bind_info=gr.id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0 and b.wechat like '%{$search_content}%' and bind.bind_name='group'";
        if ($group_id!="all"){
            $sql .= " and bind.bind_info='{$group_id}'";
        }
        $sql .= " order by a.base_amount desc";
        $db->query($sql);
        $row2 = $db->fetchAll();
        if ($row2){
            foreach ($row1 as $a=>$b){
                foreach ($row2 as $k=>$v){
                    if ($v['us_id']==$b['us_id']){
                        $row2[$k]['sorting'] = $b['sorting'];
                    }
                }
            }
            $rows = array_slice($row2,$offset,$limit);
        }else{
            $rows = array();
        }
    }else{
        $sql = "SELECT b.us_account,b.wechat,b.us_id,b.scale,gr.id as group_id,gr.name as group_name,
           (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点赞' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_praise,
           (select sum(tx_amount/'{$unit}') from us_glory_integral_change_log WHERE debit_id=a.us_id AND tx_detail='点踩' AND ctime BETWEEN '{$s_time}' AND '{$e_time}') as all_point_on 
           FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id LEFT JOIN bot_group as gr ON bind.bind_info=gr.id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0 and bind.bind_name='group'";
        if ($group_id!="all"){
            $sql .= " and bind.bind_info='{$group_id}'";
        }
        $sql .= " order by a.base_amount desc limit $offset , $limit";
        $db->query($sql);
        $rows = $db->fetchAll();
        foreach ($rows as $k=>$v){
            $rows[$k]['sorting'] = $offset+$k+1;
        }
    }
    foreach ($rows as $k=>$v){
        if ($v['all_praise']==null){
            $rows[$k]['all_praise'] = 0;
        }
        if ($v['all_point_on']==null){
            $rows[$k]['all_point_on'] = 0;
        }
    }

    return $rows;
}


//======================================
// 函数: 获取聊天记录总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_chat_total($data)
{
    $db = new DB_COM();
    $sql = "SELECT bot_message_id FROM bot_message WHERE 1";
    if ($data['wechat']!=''){
        $sql .= " and wechat='{$data['wechat']}'";
    }
    if ($data['search_content']!=''){
        $sql .= " and bot_content like '%{$data['search_content']}%'";
    }
    if (intval($data['group_id'])!=''){
        $sql .= " and group_id='{$data['group_id']}'";
    }
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取聊天记录
// 参数:
// 返回: rows             数组
//======================================
function get_chat_list($data,$offset,$limit)
{
    $db = new DB_COM();
    $sql = "select b.bot_nickname,b.bot_content,b.bot_send_time,b.type,b.wechat,(select us_id from us_base WHERE wechat=b.wechat limit 1) as us_id from bot_message as b WHERE 1";
    if ($data['wechat']!=''){
        $sql .= " and b.wechat='{$data['wechat']}'";
    }
    if ($data['search_content']!=''){
        $sql .= " and b.bot_content like '%{$data['search_content']}%'";
    }
    if (intval($data['group_id'])!=''){
        $sql .= " and b.group_id='{$data['group_id']}'";
    }
    $sql .= " ORDER BY b.bot_send_time desc limit $offset , $limit";
    $db->query($sql);
    $rows = $db->fetchAll();
    foreach ($rows as $k=>$v){
        $s_time = strtotime(date('Y-m-d 00:00:00'), time());
        $e_time = strtotime(date('Y-m-d 23:59:59'), time());
        $unit = get_la_base_unit();
        $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE debit_id='{$v['us_id']}' AND state=1 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
        $db->query($sql);
        $all_zan = $db->getField($sql, 'all_am');
        if (!$all_zan) {
            $all_zan = 0;
        }
        $rows[$k]['all_praise'] = $all_zan;
        $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE debit_id='{$v['us_id']}' AND state=2 AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
        $db->query($sql);
        $all_cai = $db->getField($sql, 'all_am');
        if (!$all_cai) {
            $all_cai = 0;
        }
        $rows[$k]['all_point_on'] = $all_cai;
    }
    array_multisort(array_column($rows,'bot_send_time'),SORT_ASC,$rows);
    return $rows;
}


//======================================
// 函数: 获取积分排名
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_ranking($give_us_id,$give_num){
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "select base_amount/'$unit' as base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
    $db->query($sql);
    $num_first = $db->getField($sql,'base_amount');
    $num_first = $num_first ? $num_first : "0";
//    if ($num_first!=''){
    $result = array();
    $num = $num_first+$give_num;
    $sql = "select base_amount/'$unit' as base_amount from us_asset WHERE base_amount>=0 ORDER by base_amount DESC ";
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        $base_amount_list = array_map(function($val){return $val['base_amount'];}, $rows);
    }
    $now_rand = '';
    foreach ($base_amount_list as $k=>$v){
        if ($num_first==$v){
            $now_rand = $k;
            break;
        }
    }
    $result['now_rand'] = $now_rand;
    $afert_rand = '';
    if ($now_rand){
        $afert_rand = for_key($now_rand,$num,$base_amount_list);
    }
    $result['afert_rand'] = $afert_rand;
//    }
    return $result;
}
function for_key($key,$v,$arr){
    $res = '';
    $lenth = $key  ;
    for ($i = $lenth; $i >= 0  ;$i--)
    {
        if($v<$arr[$i]) {
            $res = $i + 1;
            break;
        }
    }
    return $res ;
}


//======================================
// 函数: 点赞功能
// 参数: $data
//
// 返回: row           最新信息数组
//======================================
function give_like_us($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $unit = get_la_base_unit();

    //积分变动记录表
    $d['hash_id'] = hash('md5', $data['us_id'] . 'give_like_us' . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $d['credit_id'] = $data['us_id'];
    $d['debit_id'] = $data['give_us_id'];
    $d['tx_amount'] = $data['give_num']*$unit;
    $d['ctime'] = time();
    $d['utime'] = date('Y-m-d H:i:s');
    $d['state'] = $data['state'];
    $d['tx_detail'] = $data['state'] ==1 ? "点赞" : "点踩";
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

    //判断积分排名是否变化
    if ($data['state']==1){
        $ranking = get_ranking($data['give_us_id'],$data['give_num']);
        if ($ranking['now_rand']!=$ranking['afert_rand']){
            $sql = "select b.wechat,bi.bind_info from us_base as b INNER JOIN us_bind as bi on b.us_id=bi.us_id WHERE b.us_id='{$data['give_us_id']}' AND bi.bind_name='group'";
            $db->query($sql);
            $rank = $db->fetchRow();
            if ($rank){
                $change_record['wechat'] = $rank['wechat'];
                $change_record['first_rand'] = $ranking['now_rand']+1;
                $change_record['after_rand'] = $ranking['afert_rand']+1;
                $change_record['group_id'] = $rank['bind_info'];
                $change_record['ctime'] = date('Y-m-d H:i:s');
                $change_record['utime'] = time();
                $sql = $db->sqlInsert("bot_ranking_change_record", $change_record);
                $id = $db->query($sql);
                if (!$id){
                    $db->Rollback($pInTrans);
                    return 0;
                }
            }
        }
    }


    //增加荣耀积分(减少荣耀积分)
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set";
        if ($data['state']==1){
            $sql .= " base_amount=base_amount+'{$data['give_num']}'*'{$unit}'";
        }elseif ($data['state']==2){
            $sql .= " base_amount=base_amount-'{$data['give_num']}'*'{$unit}'";
        }
        $sql .= " WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return 0;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$data['give_us_id']}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $data['give_us_id'];
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
    $la_id = get_la_id();
    //赠送者
    $flag = $data['state'] == 1 ? 5 : 6;
    $transfer['hash_id'] = hash('sha256', $data['us_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($data['us_id']);
    $transfer['prvs_hash'] = $prvs_hash === 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $data['us_id'];
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = -($data['give_num']*$unit);
    $transfer['credit_balance'] = get_us_base_amount($transfer['credit_id'])-($data['give_num']*$unit);
    $transfer['tx_hash'] = hash('sha256', $data['us_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $transfer['tx_count'] = transfer_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //接收者(la)
    $dat['hash_id'] = hash('sha256', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $la_id;
    $dat['debit_id'] = $data['us_id'];
    $dat['tx_amount'] = $data['give_num']*$unit;
    $dat['credit_balance'] = get_la_base_amount($la_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('sha256', $la_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-la';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s');
    $dat['tx_count'] = transfer_get_pre_count($la_id);
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
    $tx_id = hash('sha256', $data['us_id'] . $la_id . get_ip() . time() . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash===0 ? $com_balance_us['hash_id'] : $prvs_hash;
//    var_dump($com_balance_us['hash_id']);
//    var_dump($prvs_hash);
//    var_dump($prvs_hash==0);
//    var_dump($prvs_hash===0);die;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $la_id;
    $com_balance_us["tx_type"] = 'give_like';
    $com_balance_us["tx_amount"] = -($data['give_num']*$unit);
    $com_balance_us["credit_balance"] = get_us_base_amount($data['us_id'])-($data['give_num']*$unit);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');
    $com_balance_us['tx_count'] = base_get_pre_count($data['us_id']);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }

    //la添加基准资产变动记录
    $us_type = 'la_get_balance';
    $com_balance_ba['hash_id'] = hash('sha256', $la_id. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($la_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $data['us_id'];
    $com_balance_ba["tx_type"] = 'give_like';
    $com_balance_ba["tx_amount"] = $data['give_num']*$unit;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id)+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba['tx_count'] = base_get_pre_count($la_id);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }



    $db->Commit($pInTrans);
    return true;
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

//======================================
// 函数: 获取资金变动记录表的前置hash
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

//获取us余额
function get_us_base_amount($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}

//获取us可用余额
function get_us_base_true_amount($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


//======================================
// 函数: 判断是否当日已经达到最大上限
//======================================
function check_max_give($us_id,$give_num,$state,$give_us_id)
{
    $db = new DB_COM();
    if ($state==1){
        $max = get_praise_pointon_maxnum()['max_give_like'];
    }elseif ($state==2){
        $max = get_praise_pointon_maxnum()['max_give_no_like'];
    }

    $unit = get_la_base_unit();
    $base_amount = get_us_base_true_amount($us_id)/$unit;
    if ($give_num>$base_amount){
        return 4;
        false;
    }


    $start = strtotime(date('Y-m-d 00:00:00'));
    $end  = strtotime(date('Y-m-d 23:59:59'));
    $sql = "SELECT sum(tx_amount)/'{$unit}' as give_all FROM us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state='{$state}' AND ctime BETWEEN '{$start}' AND '{$end}'";
    $db -> query($sql);
    $give_all= $db -> getField($sql,'give_all');
    if ($give_all==$max){
        return 1;
    }elseif($give_num+$give_all>$max){
        return 2;
    }else{
//        if ($state==2){
//            $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
//            $db->query($sql);
//            $row = $db->fetchRow();
//            if (!$row || $row['base_amount']==0 || $give_num>($row['base_amount']/$unit)){
//                return 3;
//            }
//        }
    }
}


//======================================
// 函数: 已点赞多少,已踩多少
//======================================
function praise_or_pointon_num($us_id)
{
    $db = new DB_COM();
    $s_time = strtotime(date('Y-m-d 00:00:00'), time());
    $e_time = strtotime(date('Y-m-d 23:59:59'), time());
    $unit = get_la_base_unit();
    $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=1 AND tx_detail='点赞' AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
    $db->query($sql);
    $all_zan = $db->getField($sql,'all_am');
    if (!$all_zan){$all_zan=0;}

    $sql = "select sum(tx_amount)/'{$unit}' as all_am from us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state=2 AND tx_detail='点踩' AND ctime BETWEEN '{$s_time}' AND '{$e_time}'";
    $db->query($sql);
    $all_cai = $db->getField($sql,'all_am');
    if (!$all_cai){$all_cai=0;}

    $rows = array();
    $rows['all_zan'] = $all_zan;
    $rows['all_cai'] = $all_cai;
    return $rows;
}

//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list()
{
    $db = new DB_COM();
    $sql = "SELECT id,name,scale,(select count(*) from us_bind where bind_name='group' and bind_info=id ) as bind_count FROM bot_group  WHERE is_test=1 AND is_audit=2 AND is_admin_del=1 ORDER BY scale DESC,bind_count desc;";
    $db -> query($sql);
    $row = $db -> fetchAll();
    if ($row){
        foreach ($row as $k=>$v){
            if ($v['bind_count']==0){
                unset($row[$k]);
            }
        }
    }
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
    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by tx_count desc limit 1";
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
    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by tx_count desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;
    return $tx_count+1;
}


//======================================
// 函数: 获取前十的留言
//======================================
function get_leave_message(){
    $db = new DB_COM();
    $sql = "SELECT b.wechat,b.scale,b.us_id FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0 and bind.bind_name='group' order by a.base_amount desc limit 0 , 10";
    $db->query($sql);
    $list = $db->fetchAll();
    if ($list){
        foreach ($list as $k=>$v){
            $sql = "select bind_info from us_bind WHERE bind_type='text' AND bind_name='leave_message' AND us_id='{$v['us_id']}'";
            $db->query($sql);
            $list[$k]['leave_message'] = $db->getField($sql,'bind_info');
        }
    }
    return $list;
}
