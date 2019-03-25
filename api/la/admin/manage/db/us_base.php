<?php
//======================================
//  获取用户的列表总数
// 参数:
//======================================
function get_us_base_info_total($us_nm,$phone_email)
{
    $db = new DB_COM();
    $sql = "a.*,b.bind_info FROM us_base as a left join us_bind as b on a.us_id=b.us_id where";
    if ($us_nm){
        $sql .= " b.bind_name='cellphone' and a.us_nm like '%{$us_nm}%'";
    }
    if ($phone_email){
        $sql .= " (b.bind_name='cellphone' or b.bind_name='email') and replace(b.bind_info,'86-','') like '%{$phone_email}%'";
    }
    if (!$phone_email && !$us_nm){
        $sql .= " b.bind_name='cellphone'";
    }
    $db->query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
//  获取用户的列表
// 参数:
// 返回: rows          用户信息数组
//        us_id        用户ID
//        us_nm         用户编号（内部唯一）
//        us_account    用户表示账号（内部唯一）
//        base_amount   基准资产余额
//        lock_amount   锁定余额
//        us_type       用户类型
//        us_level      用户等级
//        security_level安全等级
//        utime         更新时间
//        ctime         创建时间
//======================================
function get_us_base_info($offset,$limit,$filter,$time_filter,$us_nm,$phone_email)
{
    $db = new DB_COM();
    $sql = "a.*,b.bind_info FROM us_base as a left join us_bind as b on a.us_id=b.us_id where";
    if ($us_nm){
        $sql .= " b.bind_name='cellphone' and a.us_nm like '%{$us_nm}%'";
    }
    if ($phone_email){
        $sql .= " (b.bind_name='cellphone' or b.bind_name='email') and replace(b.bind_info,'86-','') like '%{$phone_email}%'";
    }
    if (!$phone_email && !$us_nm){
        $sql .= " b.bind_name='cellphone'";
    }
    if ($filter){
        $sql .= " order BY base_amount $filter";
    }
    if ($time_filter){
        $sql .= " order BY ctime $time_filter";
    }
    $sql .= " limit $offset,$limit";
    echo $sql;;die;
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        foreach ($rows as $k=>$v){
            $rows[$k]['base_amount'] = $v['base_amount']/get_la_base_unit();
            $rows[$k]['lock_amount'] = $v['lock_amount']/get_la_base_unit();
        }
    }
    return $rows;
}
//======================================
//  获取用户的基本信息通过us_id
// 参数: us_id         用户id
// 返回: rows          用户信息数组
//        us_id        用户ID
//        us_nm         用户编号（内部唯一）
//        us_account    用户表示账号（内部唯一）
//        base_amount   基准资产余额
//        lock_amount   锁定余额
//        us_type       用户类型
//        us_level      用户等级
//        security_level安全等级
//        utime         更新时间
//        ctime         创建时间
//======================================
function get_us_base_info_by_us_id($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base where us_id = '{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchrow();
    return $rows;
}
