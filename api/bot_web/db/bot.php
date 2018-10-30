<?php

//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group WHERE ba_id = '{$ba_id}'  ORDER BY intime ASC ";
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
    $sql = "update bot_group set name = '{$date['name']}' , is_del = '{$date['is_del']}', is_flirt = '{$date['is_flirt']}',uptime='{$time}' where id='{$date['group_id']}' ";
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
function get_group_members_list($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT name,group_name,group_id FROM bot_group_members WHERE group_id='{$group_id}'";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}


//======================================
// 函数: 获取任务列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_timer_list($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT t.id,t.time,t.content,t.is_del,g.name FROM bot_timer as t LEFT JOIN bot_group as g on t.group_id=g.id WHERE g.ba_id = '{$ba_id}' and t.is_del=0  ORDER BY t.intime ASC ";
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
    $sql = "update bot_timer set time = '{$date['time']}' , content = '{$date['content']}', ba_id = '{$date['ba_id']}',uptime='{$time}' where id='{$date['timer_id']}' ";
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
    if ($status!=2){
        $end = time();
    }

    $sql .=" AND bot_create_time between '{$start}' and '{$end}'";
    $db->query($sql);
    $rows = $db -> fetchAll();
    return $rows;


}