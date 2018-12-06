<?php

//======================================
// 函数: 获取荣耀积分记录总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_leaderboard_total()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset WHERE 1";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取荣耀积分记录
// 参数: $offset    $limit
// 返回: rows             用户登录信息数组
//======================================
function get_leaderboard($offset,$limit)
{
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "SELECT a.base_amount/'{$unit}' as base_amount,b.us_account,b.wechat FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id WHERE a.asset_id = 'GLOP' order by a.base_amount desc limit $offset , $limit";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}


//======================================
// 函数: 获取聊天记录总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_chat_total($wechat)
{
    $db = new DB_COM();
    $sql = "SELECT bot_message_id FROM bot_message WHERE wechat='{$wechat}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取荣耀积分记录
// 参数: $offset    $limit
// 返回: rows             用户登录信息数组
//======================================
function get_chat_list($wechat)
{
    $db = new DB_COM();
    $sql = "select b.bot_nickname,b.bot_content,b.bot_send_time,b.type,b.wechat,(select us_id from us_base WHERE wechat=b.wechat limit 1) as us_id from bot_message as b WHERE b.wechat='{$wechat}' ORDER BY b.bot_create_time ASC ";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}