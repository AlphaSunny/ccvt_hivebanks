<?php
//======================================
// 函数: 获取微信信息表中最后一个标识符
// 参数: 无
// 返回: $row        最新信息数组
//======================================
function get_bot_last_mark()
{
    $db = new DB_COM();
    $sql = "SELECT bot_mark FROM bot_base ORDER BY bot_mark DESC LIMIT 1 ";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 注册微信用户
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function ins_bind_bot_info($data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_base", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}
//======================================
// 函数: 搜索微信用户是否存在
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_us_base($data)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE wechat='{$data['wechat']}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 搜索微信用户当日发言数量
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_base_message_count($data)
{
    $day_start = strtotime(date('Y-m-d 00:00:00'));
    $day_end = strtotime(date('Y-m-d 23:59:59'));

    $db = new DB_COM();
    $sql = "SELECT * FROM bot_message WHERE wechat='{$data['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
    $db->query($sql);
    $count = $db -> affectedRows();
    $rows['count'] = $count;

    $sql = "select group_name,count(bot_message_id) as count from bot_message where wechat='{$data['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by group_name";
    $db->query($sql);
    $row = $db->fetchAll();
    $rows['list'] = $row;

    return $rows;
}

//======================================
// 函数: 搜索微信用户余额
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_bot_amount($data)
{
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM us_base WHERE wechat='{$data['wechat']}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 搜索微信用户当日发言数量
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_us_all_message()
{
    $day_start = strtotime(date('Y-m-d 00:00:00'));
    $day_end = strtotime(date('Y-m-d 23:59:59'));

    $db = new DB_COM();
    $sql = "SELECT bot_nickname,bot_content,bot_send_time FROM bot_message WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time ASC";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}


//======================================
// 函数: 统计余额排行榜
// 参数: $data
//返回： rows               数据
//======================================
function statistics_amount_list()
{
    $db = new DB_COM();
    $sql = "SELECT us_account,base_amount FROM us_base ORDER BY us_account DESC limit 10";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数:微信机器人定时任务返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_timer()
{
    $db = new DB_COM();
    $sql = "SELECT a.time,a.content,a.group_id FROM bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0  ORDER BY a.intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人群组返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_bot_group()
{
    $db = new DB_COM();
    $sql = "SELECT id,name,ba_id,is_del,is_flirt FROM bot_group ORDER BY intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人全天开放日期列表返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_bot_date()
{
    $db = new DB_COM();
    $sql = "SELECT date FROM bot_date ORDER BY intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人二维码地址
// 参数: $data
//返回： rows               数据
//======================================
function bot_qrcode($data){
    $db = new DB_COM();
    $sql = "select * from bot_status limit 1";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set qr_path='{$data['qrcode']}', ctime='{$time}' where id='{$info['id']}'";
        $db->query($sql);
        return $db->affectedRows();
    }else{
        $sql = $db->sqlInsert("bot_status", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;
        return true;
    }
}

//======================================
// 函数:微信机器人登录状态
// 参数: $data
//返回： rows               数据
//======================================
function bot_alive($data){
    $db = new DB_COM();
    $sql = "select * from bot_status limit 1";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set robot_alive='{$data['robot_alive']}', ctime='{$time}' where id='{$info['id']}'";
        $db->query($sql);
        return $db->affectedRows();
    }else{
        $sql = $db->sqlInsert("bot_status", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;
        return true;
    }
}

//======================================
// 函数: 获取二维码地址
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function get_qrcode()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_status limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 获取key_code
// 参数:
//返回： true               成功
//        false             失败
//======================================
function get_key_code()
{
    $db = new DB_COM();
    $sql = "SELECT key_code FROM la_admin limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row['key_code'];
}

//======================================
// 函数: 更新群组成员
// 参数:  $data
//返回： true               成功
//        false             失败
//======================================
function storage_members($data)
{
    $db = new DB_COM();
    $sql = "select remark from bot_group_members where group_id='{$data['group_id']}'";

    $sql = "SELECT key_code FROM la_admin limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row['key_code'];
}

?>
