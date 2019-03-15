<?php
//======================================
// 函数: 获取搜索条件列表
// 参数:
//======================================
function  get_search_list()
{
    $db = new DB_COM();
    $sql = "SELECT scale from bot_group_level_rules WHERE 1";
    $db -> query($sql);
    $rows['scale_list'] = $db -> fetchAll();

    $sql = "select id,name from bot_group_type WHERE is_del=1";
    $db->query($sql);
    $rows['type_list'] = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 获取群组总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_group_list_total($search_name,$scale,$type_id)
{
    $db = new DB_COM();
    $sql = "SELECT a.id FROM bot_group as a left JOIN bot_group_type as b ON a.group_type=b.id WHERE a.is_test=1 AND a.is_audit=2 AND a.is_admin_del=1  AND a.is_del=1";
    if ($search_name){
        $sql .= " and a.name like '%{$search_name}%'";
    }
    if ($scale){
        $sql .= " and a.scale= '{$scale}'";
    }
    if ($type_id){
        $sql .= " and a.group_type= '{$type_id}'";
    }
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list($offset,$limit,$search_name,$scale,$type_id)
{
    $db = new DB_COM();
    $sql = "SELECT a.id,a.qr_code_address,a.name,a.scale,b.name as type_name,(select count(*) from us_bind where bind_name='group' and bind_info=a.id) as bind_count FROM bot_group as a left JOIN bot_group_type as b ON a.group_type=b.id WHERE a.is_test=1 AND a.is_audit=2 AND a.is_admin_del=1 AND a.is_del=1";
    if ($search_name){
        $sql .= " and a.name like '%{$search_name}%'";
    }
    if ($scale){
        $sql .= " and a.scale= '{$scale}'";
    }
    if ($type_id){
        $sql .= " and a.group_type= '{$type_id}'";
    }
    $sql .= "  ORDER BY a.scale DESC,bind_count desc limit $offset , $limit";
    $db -> query($sql);
    $row = $db -> fetchAll();
    if ($row){
        $unit = get_la_base_unit();
        foreach ($row as $k=>$v){
            $row[$k]['glory_number'] = glory_number($v['id']);
            //24小时内聊天奖励
            $sql = "select sum(amount)/'$unit' as send_amount from bot_Iss_records WHERE group_id='{$v['id']}' AND send_time >=(NOW() - interval 24 hour)";
            $db->query($sql);
            $send_amount = $db->getField($sql,'send_amount');
            $row[$k]['send_amount'] = $send_amount ? $send_amount : 0;

            //24小时内聊天数量
            $sql = "select sum(num) as all_num from bot_Iss_records WHERE group_id='{$v['id']}' AND send_time >=(NOW() - interval 24 hour)";
            $db->query($sql);
            $all_num = $db->getField($sql,'all_num');
            $row[$k]['all_num'] = $all_num ? $all_num : 0;
        }
    }
    return $row;
}

//======================================
// 函数: 获取信息
// 返回: row           最新信息数组
//======================================
function get_group_info($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT a.id,a.name,a.scale,a.us_id,a.dis,a.qr_code_address,b.name as type_name,(select count(*) from us_bind where bind_name='group' and bind_info='{$group_id}') as bind_count FROM bot_group as a left JOIN bot_group_type as b ON a.group_type=b.id WHERE a.id='{$group_id}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    if ($row){
        $sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$row['id']}'";
        $db->query($sql);
        $row['group_member_number'] = $db->getField($sql,'count');
        $sql = "select count(id) as count from bot_memeber_change_record WHERE group_id='{$row['id']}' AND to_days(ctime) = to_days(now())";
        $db->query($sql);
        $row['this_day_in'] = $db->getField($sql,'count');
        $row['glory_number'] = glory_number($row['id']);
        $sql = "select scale from bot_group_level_rules ORDER BY scale desc limit 1";
        $db->query($sql);
        if ($row['scale']==$db->getField($sql,'scale')){
            $row['is_top'] = 1;
            $row['next_level_bind_number'] = 0;
            $row['next_level_glory_number'] = 0;
        }else{
            $row['is_top'] = 0;
            $sql = "select bind_number,glory_number from bot_group_level_rules WHERE scale='{$row['scale']}'+1";
            $db->query($sql);
            $row['next_level_bind_number'] = $db->getField($sql,'bind_number');
            $row['next_level_glory_number'] = $db->getField($sql,'glory_number');
        }
        //群主
        $sql = "select wechat from us_base where us_id='{$row['us_id']}'";
        $db->query($sql);
        $row['group_lord'] = $db->getField($sql,'wechat');
    }
    $row['row'] = $row;

    $weeks = get_weeks();
    $unit = get_la_base_unit();
    foreach ($weeks as $k=>$v){
        $bind_rows[$k-1]['date'] = $v;
        $sql = "select sum(amount)/'$unit' as num from bot_Iss_records WHERE group_id='{$group_id}' AND DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(send_time)), '%Y-%m-%d')='{$v}'";
        //$sql = "select count(us_id) as num from us_bind where bind_name='group' AND bind_info='{$group_id}' AND DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(ctime)), '%Y-%m-%d')='{$v}'";
        $db->query($sql);
        $num = $db->getField($sql,'num');
        $bind_rows[$k-1]['num'] = $num ? $num : 0;
    }
    $row['bind_rows'] = $bind_rows;
    return $row;

}

/**
 * 获取最近七天所有日期
 */
function get_weeks($time = '', $format='Y-m-d'){
    $time = $time != '' ? $time : time();
    //组合数据
    $date = [];
    for ($i=1; $i<=7; $i++){
        $date[$i] = date($format ,strtotime( '+' . $i-7 .' days', $time));
    }
    return $date;
}


//======================================
// 函数: 根据用户等级表查出所有星数之和
//======================================
function glory_number($group_id){
    $db = new DB_COM();
    $sql = "select scale from us_scale where scale!=0";
    $db->query($sql);
    $rows = $db->fetchAll();
    $all_glory = 0;
    if ($rows){
        foreach ($rows as $k=>$v){
            $sql = "select count(a.us_id) as count from us_bind as a left join us_base as b on a.us_id=b.us_id WHERE a.bind_name='group' AND a.bind_info='{$group_id}' AND b.scale='{$v['scale']}'";
            $db->query($sql);
            $all_glory = $all_glory+$db->getField($sql,'count');
        }
    }
    return $all_glory;
}



//======================================
// 函数: 绑定列表总数
// 参数: group_id
//
// 返回: count           最新信息数组
//======================================
function  get_bnd_total($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT b.wechat,b.scale FROM us_bind as a left join us_base as b on a.us_id=b.us_id WHERE a.bind_name='group' AND b.wechat!='null' AND bind_info='{$group_id}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取绑定列表
// 参数: group_id
// 返回: row           最新信息数组
//======================================
function bnd_list($group_id,$offset,$limit)
{
    $db = new DB_COM();
    $sql = "SELECT b.wechat,b.scale FROM us_bind as a left join us_base as b on a.us_id=b.us_id WHERE a.bind_name='group' AND b.wechat!='null' AND bind_info='{$group_id}' ORDER by a.ctime DESC limit $offset,$limit";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}


//======================================
// 函数: 群成员奖励列表总数
// 参数:
// 返回: count        记录总数
//======================================
function  get_group_reward_total($da)
{
    $db = new DB_COM();
    $sql = "SELECT bot_ls_id FROM bot_Iss_records as a left join us_base as b on a.us_id=b.us_id WHERE a.group_id = '{$da['group_id']}'";
    if ($da['start_time'] && !$da['end_time']){
        $sql .= " and a.send_time>'{$da['start_time']}'";
    }elseif (!$da['start_time'] && $da['end_time']){
        $sql .= " and a.send_time<'{$da['end_time']}'";
    }elseif ($da['start_time'] && $da['end_time']){
        $sql .= " and a.send_time between '{$da['start_time']}' and '{$da['end_time']}'";
    }

    if ($da['nickname']){
        $nickname = $da['nickname'];
        $sql .=" and b.wechat LIKE '%$nickname%'";
    }
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 群成员奖励列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_reward_list($offset,$limit,$da)
{
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "select a.num,a.amount/'{$unit}' as amount,a.send_time,b.wechat from bot_Iss_records as a left JOIN us_base as b on a.us_id=b.us_id WHERE a.group_id='{$da['group_id']}'";
    if ($da['start_time'] && !$da['end_time']){
        $sql .= " and a.send_time>'{$da['start_time']}'";
    }elseif (!$da['start_time'] && $da['end_time']){
        $sql .= " and a.send_time<'{$da['end_time']}'";
    }elseif ($da['start_time'] && $da['end_time']){
        $sql .= " and a.send_time between '{$da['start_time']}' and '{$da['end_time']}'";
    }

    if ($da['nickname']){
        $nickname = $da['nickname'];
        $sql .=" and b.wechat LIKE '%$nickname%'";
    }
    $sql .= " order by bot_create_time desc limit $offset , $limit";
    $db -> query($sql);
    $row = $db -> fetchAll();
    return $row;
}