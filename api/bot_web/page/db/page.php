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
    $sql = "SELECT * FROM bot_group WHERE ba_id = '{$ba_id}'  ORDER BY intime ASC ";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}


//======================================
// 函数: 获取点赞最大值
//======================================
function get_max_give_like()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_group WHERE ba_id = '{$ba_id}'  ORDER BY intime ASC ";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}