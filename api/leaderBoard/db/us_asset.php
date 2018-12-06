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