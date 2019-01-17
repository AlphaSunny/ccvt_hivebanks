<?php
//======================================
// 函数: 获取群组列表
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_group_list()
{
    $db = new DB_COM();
    $sql = "SELECT id,name,scale,(select count(*) from us_bind where bind_name='group' and bind_info=id) as bind_count FROM bot_group  WHERE is_test=1 AND is_audit=2 AND is_admin_del=1 ORDER BY scale DESC,bind_count desc;";
    $db -> query($sql);
    $row = $db -> fetchAll();
    if ($row){
        foreach ($row as $k=>$v){
            $sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$v['id']}'";
            $db->query($sql);
            $row[$k]['group_member_number'] = $db->getField($sql,'count');
            $row[$k]['glory_number'] = glory_number($v['id']);
            $sql = "select scale from bot_group_level_rules ORDER BY scale desc limit 1";
            $db->query($sql);
            if ($v['scale']==$db->getField($sql,'scale')){
                $row[$k]['is_top'] = 1;
                $row[$k]['next_level_bind_number'] = 0;
                $row[$k]['next_level_glory_number'] = 0;
            }else{
                $row[$k]['is_top'] = 0;
                $sql = "select bind_number,glory_number from bot_group_level_rules WHERE scale='{$v['scale']}'+1";
                $db->query($sql);
                $row[$k]['next_level_bind_number'] = $db->getField($sql,'bind_number');
                $row[$k]['next_level_glory_number'] = $db->getField($sql,'glory_number');
            }
        }
    }
    return $row;
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

