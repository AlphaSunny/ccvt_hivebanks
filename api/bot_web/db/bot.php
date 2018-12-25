<?php


//======================================
// 函数: 检查查询是否是当前用户
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function check_us_group($us_id,$group_id)
{
    $db = new DB_COM();
    $sql = "SELECT us_id FROM bot_group WHERE id = '{$group_id}' limit 1";
    $db -> query($sql);
    $row = $db -> getField($sql,'us_id');
    if ($row!=$us_id){
        return false;
    }
    return true;
}

//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT g.id,g.name,g.us_id,g.is_del,g.is_flirt,g.is_audit,g.why,g.scale,g.is_give_ccvt,g.group_type,g.is_admin_del,g.send_address,g.bind_account_notice,g.is_welcome,g.welcome,t.name as group_type_name FROM bot_group as g LEFT JOIN bot_group_type as t on g.group_type=t.id WHERE g.us_id = '{$us_id}' AND g.is_test=1 ORDER BY g.intime ASC ";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}
//======================================
// 函数: 检查名称已存在
// 参数:
//
// 返回: row           最新信息数组
//======================================
function check_group_name($ba_id,$group_name,$vail,$id='')
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group WHERE ba_id = '{$ba_id}' AND name='{$group_name}'";
    if ($vail=='edit'){
        $sql .= " AND id!='{$id}'";
    }
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}



//======================================
// 函数: 添加群组
// 参数: group_name      群组名称
//
// 返回: row           最新信息数组
//======================================
function add_group($data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_group", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 修改群组
// 参数: date      群组名称
//
// 返回: row           最新信息数组
//======================================
function save_group($date)
{
    $db = new DB_COM();
    $time = time();
    $sql = "update bot_group set name = '{$date['name']}' , 
         is_del = '{$date['is_del']}', is_flirt = '{$date['is_flirt']}',send_address = '{$date['send_address']}',bind_account_notice='{$date['bind_account_notice']}',
         is_welcome = '{$date['is_welcome']}',welcome = '{$date['welcome']}',
         uptime='{$time}' where id='{$date['group_id']}' ";
    $db->query($sql);
    if (!$db->affectedRows()){
        return false;
    }
    return true;
}

//======================================
// 函数: 查询群组
// 参数: group_id      群组id
//
// 返回: row           最新信息数组
//======================================
function get_group_info($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group WHERE id = '{$group_id}'";
    $db->query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 获取群组成员列表总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_group_members_list_total($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group_members WHERE group_id='{$group_id}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取群组成员列表
// 参数: group_id      群组id
//
// 返回: row           最新信息数组
//======================================
function get_group_members_list($group_id,$status,$offset,$limit)
{
    $db = new DB_COM();
    $sql = "SELECT name,group_name,group_id FROM bot_group_members WHERE group_id='{$group_id}' limit $offset , $limit";
    $db -> query($sql);
    $row = $db -> fetchAll();
    $end = time();
    foreach ($row as $k=>$v) {
        switch ($status){
            case 1:
                $start = strtotime(date('Y-m-d 00:00:00'));
                break;
            case 2:
                $start = strtotime(date('Y-m-d 00:00:00', strtotime("-1 day")));
                $end = strtotime(date('Y-m-d 23:59:59', strtotime("-1 day")));
                break;
            case 3:
                $start = strtotime(date('Y-m-d 00:00:00', strtotime("-3 day")));
                break;
            case 4:
                $start = strtotime(date('Y-m-d 00:00:00', strtotime("-7 day")));
                break;
        }
        $sql = "select count(bot_message_id) as count from bot_message WHERE wechat='{$v['name']}' AND group_name='{$v['group_name']}'";
        if ($status!=-1){
            $sql .= " AND bot_create_time between '{$start}' and '{$end}'";
        }
        $db->query($sql);
        $row[$k]['chat_num'] = $db->getField($sql,'count');
    }
    array_multisort(array_column($row,'chat_num'),SORT_DESC,$row);
    return $row;
}

//======================================
// 函数: 删除群组
// 参数:
//
// 返回: row           最新信息数组
//======================================
function del_group($group_id)
{
    $db = new DB_COM();
    $sql = "delete from bot_group WHERE id='{$group_id}'";
    $db->query($sql);
    $count = $db -> affectedRows();
    return $count;
}


//======================================
// 函数: 获取任务列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_timer_list($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT t.id,t.time,t.content,t.is_del,t.send_type,t.tx_content,t.type,g.name FROM bot_timer as t LEFT JOIN bot_group as g on t.group_id=g.id WHERE g.us_id = '{$us_id}' and t.is_del=0  ORDER BY t.intime ASC ";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}
//======================================
// 函数: 添加任务
// 参数:
//
// 返回: row           最新信息数组
//======================================
function add_timer($data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_timer", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 修改任务
// 参数:
//
// 返回: row           最新信息数组
//======================================
function save_timer($date)
{
    $db = new DB_COM();
    $time = time();
    $sql = "update bot_timer set time = '{$date['time']}' , content = '{$date['content']}',send_type='{$date['send_type']}', type='{$date['type']}',uptime='{$time}' where id='{$date['timer_id']}' ";
    $db->query($sql);
    return $db->affectedRows();
}

//======================================
// 函数: 删除任务
// 参数:
//
// 返回: row           最新信息数组
//======================================
function del_timer($timer_id)
{
    $db = new DB_COM();
    $sql = "update bot_timer set is_del = 1  where id='{$timer_id}' ";
    $db->query($sql);
    return $db->affectedRows();
}

//======================================
// 函数: 查询任务信息
// 参数: timer_id    任务id
//
// 返回: row           最新信息数组
//======================================
function get_timer_info($timer_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_timer WHERE id = '{$timer_id}'";
    $db->query($sql);
    $row = $db -> fetchRow();
    return $row;
}


//======================================
// 函数: 获取群聊记录
// 参数: group_id      群组id
//      status      1:今日 2:昨天  3:3天内  4:七天内
// 返回: row           最新信息数组
//======================================
function get_message_list($group_id,$status)
{
    $db = new DB_COM();
    $sql = "select bot_nickname,bot_content,bot_send_time,type,group_name from bot_message as b LEFT JOIN bot_group as g ON b.group_name=g.name WHERE g.id='{$group_id}' ";

    $end = time();
    switch ($status){
        case 1:
            $start = strtotime(date('Y-m-d 00:00:00'));
            break;
        case 2:
            $start = strtotime(date('Y-m-d 00:00:00',strtotime("-1 day")));
            $end = strtotime(date('Y-m-d 23:59:59',strtotime("-1 day")));
            break;
        case 3:
            $start = strtotime(date('Y-m-d 00:00:00',strtotime("-3 day")));
            break;
        case 4:
            $start = strtotime(date('Y-m-d 00:00:00',strtotime("-7 day")));

    }

    $sql .=" AND bot_create_time between '{$start}' and '{$end}' order by bot_create_time asc";
    $db->query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 获取天奖励列表总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_iss_record_total($da)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_Iss_records WHERE bot_us_id = '{$da['us_id']}'";
    if ($da['start_time'] && !$da['end_time']){
        $sql .= " and send_time>'{$da['start_time']}'";
    }elseif (!$da['start_time'] && $da['end_time']){
        $sql .= " and send_time<'{$da['end_time']}'";
    }elseif ($da['start_time'] && $da['end_time']){
        $sql .= " and send_time between '{$da['start_time']}' and '{$da['end_time']}'";
    }

    if ($da['nickname']){
        $nickname = $da['nickname'];
        $sql .=" and wechat LIKE '$nickname%'";
    }
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 查询聊天奖励列表
// 参数: timer_id    任务id
//
// 返回: row           最新信息数组
//======================================
function iss_records_list($da,$offset,$limit)
{
    $db = new DB_COM();
    $unit = get_la_base_unit();

    $sql = "SELECT bot_ls_id,us_id,ba_id,wechat,num,amount/'{$unit}' as amount,send_time FROM bot_Iss_records WHERE bot_us_id = '{$da['us_id']}'";
    if ($da['start_time'] && !$da['end_time']){
        $sql .= " and send_time>'{$da['start_time']}'";
    }elseif (!$da['start_time'] && $da['end_time']){
        $sql .= " and send_time<'{$da['end_time']}'";
    }elseif ($da['start_time'] && $da['end_time']){
        $sql .= " and send_time between '{$da['start_time']}' and '{$da['end_time']}'";
    }

    if ($da['nickname']){
        $nickname = $da['nickname'];
        $sql .=" and wechat LIKE '%$nickname%'";
    }
    $sql .= " order by bot_create_time desc limit $offset , $limit";
    $db->query($sql);
    $data = array();
    $rows = $db -> fetchAll();
    $data['rows'] = $rows;
    $sql = "SELECT sum(amount/'{$unit}') as amount,sum(num) as num FROM bot_Iss_records WHERE bot_us_id = '{$da['us_id']}'";
    if ($da['start_time'] && !$da['end_time']){
        $sql .= " and send_time>'{$da['start_time']}'";
    }elseif (!$da['start_time'] && $da['end_time']){
        $sql .= " and send_time<'{$da['end_time']}'";
    }elseif ($da['start_time'] && $da['end_time']){
        $sql .= " and send_time between '{$da['start_time']}' and '{$da['end_time']}'";
    }
    $sql .= " group by bot_us_id";
    $db->query($sql);
    $ss = $db->fetchRow();
    $data['all_amount'] = $ss['amount'] ? $ss['amount'] : 0;
    $data['all_chat'] = $ss['num'] ? $ss['num'] : 0;
//    $data['all_amount'] = array_sum(array_map(function($val){return $val['amount'];}, $rows));
//    $data['all_chat'] = array_sum(array_map(function($val){return $val['num'];}, $rows));
    //群主返现金额
    return $data;
}


//======================================
// 函数: 获取积分记录
//
// 返回: row           最新信息数组
//======================================
function glory_integral_list()
{
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "SELECT a.credit_id,a.debit_id,a.tx_detail,a.tx_amount/'{$unit}' as tx_amount,a.ctime,a.utime,b.wechat as give_account,c.wechat as receive_account FROM us_glory_integral_change_log as a LEFT JOIN us_base as b ON a.credit_id=b.us_id LEFT JOIN us_base as c ON a.debit_id=c.us_id ORDER BY a.ctime DESC";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}


//======================================
// 函数: 获取群组类型列表
//
// 返回: rows          最新信息数组
//======================================
function get_group_type_list()
{
    $db = new DB_COM();
    $sql = "select id,name from bot_group_type WHERE is_del=1";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 判断微信机器人是否登录
//
// 返回: rows          最新信息数组
//======================================
function check_bot_login($us_id)
{
    $db = new DB_COM();
    $sql = "select robot_alive from bot_status WHERE us_id='{$us_id}'";
    $db -> query($sql);
    $row = $db -> getField($sql,'robot_alive');
    if ($row!=1){
        return false;
    }
    return true;
}

//======================================
// 函数: 获取临时群组列表
//
// 返回: rows          最新信息数组
//======================================
function get_group_temporary_list($us_id)
{
    $db = new DB_COM();
    //判断只能提交一个群
    $sql = "select * from bot_group WHERE us_id='{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    if (!$rows){
        $sql = "select id,name from bot_temporary_group WHERE us_id='{$us_id}' AND is_apply=1";
        $db -> query($sql);
        $rows = $db -> fetchAll();
        return $rows;
    }
    return [];

}


//======================================
// 函数: 判断群组是否已经提交过审核
//
// 返回: rows          最新信息数组
//======================================
function check_is_submit($group_id,$us_id)
{
    $db = new DB_COM();
//    $sql = "select is_apply,name from bot_temporary_group WHERE id='{$group_id}' AND us_id='{$us_id}' limit 1";
    $sql = "select is_apply,name from bot_temporary_group WHERE us_id='{$us_id}' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 提交过审核
//
// 返回: rows          最新信息数组
//======================================
function group_submit_audit($data)
{
    $db = new DB_COM();
    $date['name'] = $data['group_name'];
    $date['us_id'] = $data['us_id'];
    $date['group_type'] = $data['group_type_id'];
    $date['intime'] = time();
    $sql = "select us_nm from us_base WHERE us_id='{$data['us_id']}'";
    $db->query($sql);
    $data['invite_code'] = $db->getField($sql,'us_nm');
    $sql = $db->sqlInsert("bot_group", $date);
    $q_id = $db->query($sql);
    if ($q_id){
        //改变临时表
        $time = time();
        $sql = "update bot_temporary_group set is_apply=2,uptime='{$time}' WHERE id='{$data['group_id']}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            return false;
        }
    }else{
        return false;
    }
    return true;
}

//======================================
// 函数: 获取关键词总数
//
// 返回: rows          最新信息数组
//======================================
function get_key_words_list_total($us_id)
{
    $db = new DB_COM();
    $sql = "select * from bot_key_words WHERE us_id='{$us_id}' AND is_del=0";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取关键词列表
//
// 返回: rows          最新信息数组
//======================================
function get_key_words_list($us_id,$offset,$limit)
{
    $db = new DB_COM();
    $sql = "select k.*,g.name as group_name from bot_key_words as k INNER JOIN bot_group as g on k.group_id=g.id WHERE k.us_id='{$us_id}' AND k.is_del=0 limit $offset , $limit";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 添加关键词
// 参数:
//
// 返回: row           最新信息数组
//======================================
function add_key_words($data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_key_words", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 修改关键词
// 参数:
//
// 返回: row           最新信息数组
//======================================
function save_key_words($data)
{
    $db = new DB_COM();
    $sql = "update bot_key_words set ask = '{$data['ask']}' , answer = '{$data['answer']}',send_type='{$data['send_type']}', group_id='{$data['group_id']}',utime='{$data['utime']}' where id='{$data['id']}' ";
    $db->query($sql);
    return $db->affectedRows();
}
//======================================
// 函数: 删除关键词
// 参数:
//
// 返回: row           最新信息数组
//======================================
function del_key_words($key_id)
{
    $db = new DB_COM();
    $sql = "update bot_key_words set is_del = 1  where id='{$key_id}' ";
    $db->query($sql);
    return $db->affectedRows();
}