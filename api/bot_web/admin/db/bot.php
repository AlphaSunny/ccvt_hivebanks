<?php


//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list($is_audit)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group";
    if ($is_audit){
        $sql .= " where is_audit='{$is_audit}'";
    }
    $sql .= " ORDER BY intime DESC";
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
    $sql = "update bot_group set is_admin_del = '{$date['is_admin_del']}',uptime='{$time}' where id='{$date['group_id']}' ";
    $db->query($sql);
    return $db->affectedRows();
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
// 函数: 获取群组成员列表
// 参数: group_id      群组id
//
// 返回: row           最新信息数组
//======================================
function get_group_members_list($group_id,$status)
{
    $db = new DB_COM();
    $sql = "SELECT name,group_name,group_id FROM bot_group_members WHERE group_id='{$group_id}'";
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
        }
        $sql = "select count(bot_message_id) as count from bot_message WHERE wechat='{$v['name']}'";
        if ($status!=-1){
            $sql .= " AND bot_create_time between '{$start}' and '{$end}'";
        }
        $db->query($sql);
        $row['chat_num'] = $db->getField($sql,'count');
    }
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
    $sql = "SELECT t.id,t.time,t.content,t.is_del,g.name FROM bot_timer as t LEFT JOIN bot_group as g on t.group_id=g.id WHERE g.us_id = '{$us_id}' and t.is_del=0  ORDER BY t.intime ASC ";
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
    $sql = "update bot_timer set time = '{$date['time']}' , content = '{$date['content']}',uptime='{$time}' where id='{$date['timer_id']}' ";
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
// 函数: 查询任务信息
// 参数: timer_id    任务id
//
// 返回: row           最新信息数组
//======================================
function iss_records_list($da)
{
    $db = new DB_COM();
    $unit = get_la_base_unit();

    $sql = "SELECT bot_ls_id,us_id,ba_id,wechat,num,amount/'{$unit}' as amount,send_time FROM bot_Iss_records WHERE ba_id = '{$da['ba_id']}'";
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
    $sql .= " order by bot_create_time desc";
    $db->query($sql);
    $data = array();
    $rows = $db -> fetchAll();
    $data['rows'] = $rows;
    $data['all_amount'] = array_sum(array_map(function($val){return $val['amount'];}, $rows));
    $data['all_chat'] = array_sum(array_map(function($val){return $val['num'];}, $rows));
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
    $sql = "SELECT a.credit_id,a.debit_id,a.tx_amount/'{$unit}' as tx_amount,a.ctime,a.utime,b.us_account as give_account,c.us_account as receive_account FROM us_glory_integral_change_log as a LEFT JOIN us_base as b ON a.credit_id=b.us_id LEFT JOIN us_base as c ON a.debit_id=c.us_id ORDER BY a.ctime DESC";
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
    $sql = "select id,name from bot_group_type WHERE 1";
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
    $sql = "select id,name from bot_temporary_group WHERE us_id='{$us_id}' AND is_apply=1";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}


//======================================
// 函数: 判断群组是否已经提交过审核
//
// 返回: rows          最新信息数组
//======================================
function check_is_submit($group_id,$us_id)
{
    $db = new DB_COM();
    $sql = "select is_apply,name from bot_temporary_group WHERE id='{$group_id}' AND us_id='{$us_id}' limit 1";
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
    $date['intime'] = time();
    $sql = $db->sqlInsert("bot_group", $date);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}