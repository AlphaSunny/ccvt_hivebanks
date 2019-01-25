<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


//群等级提升程序(每次只能升一级)


$db = new DB_COM();

$sql = "select scale from bot_group WHERE id!=1 group by scale order by scale DESC";
$db->query($sql);
$scale_list = $db->fetchAll();
if ($scale_list){
    foreach ($scale_list as $k=>$v){
        set_time_limit(0);
        //获取下一级所需绑定数,星数
        $next_group_level = get_next_group_level($v['scale']);
        $sql = "select id,name,(select count(*) from us_bind where bind_name='group' and bind_info=gr.id) as bind_count from bot_group as gr WHERE gr.scale='{$v['scale']}'";
        $db->query($sql);
        $rows = $db->fetchAll();
        if ($rows){
            foreach ($rows as $a=>$b){
                //获取当前群所有的星数
                $all_glory_number = glory_number($b['id']);
                if ($b['bind_count']>=$next_group_level['bind_number'] && $all_glory_number>=$next_group_level['glory_number']){
                    echo $b['name']."&nbsp;&nbsp;&nbsp;".$v['scale']."--".($v['scale']+1).'<br />';
                    //scale_upgrade($b['id'],$v['scale'],$v['scale']+1,$b['bind_count'],$all_glory_number);
                }
            }
        }
    }
}

////群
//$sql = "select id,name,(select count(*) from us_bind where bind_name='group' and bind_info=gr.id) as bind_count,(select count(*) from us_base where scale=1 and us_id in (select us_id from us_bind where bind_name='group' and bind_info=gr.id)) as one_scale_user_count
//from bot_group as gr where gr.scale=1 and (select count(*) from us_bind where bind_name='group' and bind_info=gr.id)>=10
//and (select count(*) from us_base where scale=1 and us_id in (select us_id from us_bind where bind_name='group' and bind_info=gr.id))>=2;";
//$db->query($sql);
//$group_rows = $db->fetchAll();
//foreach ($group_rows as $k=>$v){
//    scale_upgrade($v['id'],1,2,$v['bind_count'],$v['one_scale_user_count']);
//}

//print_r(json_encode($group_rows));die;



echo "OK";

//升级程序
function scale_upgrade($group_id,$before_scale,$after_scale,$bind_count,$one_scale_user_count){
        $db = new DB_COM();
        $pInTrans = $db->StartTrans();  //开启事务
        //升级记录表
        $data2['change_id'] = get_guid();
        $data2['group_id'] = $group_id;
        $data2['before_scale'] = $before_scale;
        $data2['after_scale'] = $after_scale;
        $data2['bind_count'] = $bind_count;
        $data2['us_one_scale_count'] = $one_scale_user_count;
        $data2['utime'] = time();
        $data2['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("bot_group_scale_changes", $data2);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            echo "添加记录失败";
        }

        //修改群等级
        $sql = "update bot_group set scale='{$after_scale}' WHERE id='{$group_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "修改群等级失败";
        }

        $db->Commit($pInTrans);
}

//======================================
// 函数: 获取下一级所需绑定数,星数
//======================================
function get_next_group_level($scale){
    $db = new DB_COM();
    $sql = "select * from bot_group_level_rules where scale='{$scale}'+1";
    $db->query($sql);
    $row = $db->fetchRow();
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