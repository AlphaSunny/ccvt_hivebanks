<?php
//======================================
// 函数: 获取用户基本信息
// 参数: token               用户token
// 返回: rows                用户基本信息数组
//         us_id            用户id
//         rest_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//======================================
function get_us_base_info_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();

    $sql = "select base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$us_id}'";
    $db->query($sql);
    $us_asset = $db->fetchRow();
    if (!$us_asset){
        $glory_of_integral = 0;
    }else{
        $glory_of_integral = $us_asset['base_amount'];
    }
    $row['glory_of_integral'] = $glory_of_integral;

    return $row;
}
//======================================
// 函数: 获取用户安全等级
// 参数: us_id            用户id
// 返回: security_level   用户安全等级
//======================================
function get_us_security_level_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT security_level FROM us_base WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $security_level = $db->getField($sql,'security_level');
    return $security_level;
}
//======================================
// 函数: 更新用户基本信息数据
// 参数: data_base            用户信息数组
// 返回: true                  成功
//       false                 失败
//======================================
function upd_us_base($data_base){
    $db = new DB_COM();
    $data_base['ctime'] = time();
    $where = "us_id = '{$data_base['us_id']}'";
    $sql = $db -> sqlUpdate('us_base', $data_base, $where);
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 更新用户安全等级数据
// 参数: us_id                用户id
// 返回: true                  成功
//       false                 失败
//======================================
function  upd_savf_level($us_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE us_base SET security_level = '{$savf_level}' WHERE us_id = '{$us_id}'";
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 检测用户是否存在
// 参数: us_id                用户id
// 返回: row                  用户信息数组
//======================================
function chexk_us_exit($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
    $db -> query($sql);
    $row = $db->fetchRow();
    return $row;
}

//======================================
// 函数: 登录成功插入机器人bot_status表
// 参数: us_id                用户id
// 返回: row                  用户信息数组
//======================================
function into_bot_status($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_status WHERE us_id = '{$us_id}'";
    $db -> query($sql);
    $row = $db->fetchRow();
    if (!$row){
        $data['ctime'] = time();
        $data['ip_address'] = "54.92.77.38:8000";
        $data['us_id'] = $us_id;
        $sql = "select replace(bind_info,'86-','')bind_info from us_bind where us_id='{$us_id}' AND bind_name='cellphone'";
        $db->query($sql);
        $data['notice_phone'] = $db->getField($sql,'bind_info');
        $sql = $db->sqlInsert("bot_status", $data);
        $db->query($sql);
    }
}