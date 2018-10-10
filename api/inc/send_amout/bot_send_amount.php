<?php
/**
 * Created by PhpStorm.
 * User: Gavin
 * Date: 2018年08月24日
 * Time: 13:35:52
 */

function send_amount($data) {
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务

    //查询bot_id
//    $sql = "SELECT bot_id FROM bot_base where bot_mark='{$data['bot_nickname']}'";
//    $db -> query($sql);
//    $row = $db -> fetchRow();
//    if(!$row){
//        $db->Rollback($pInTrans);
//        exit_error('101',"未找到微信用户");
//    }
//    $data['bot_id'] = $row['bot_id'];

    //存储聊天记录
    $sql = $db->sqlInsert("bot_message", $data);
    $bot_message_id = $db->query($sql);
    if (!$bot_message_id){
        $db->Rollback($pInTrans);
        exit_error('190','存储失败');
    }

    $num = 1;

    //用户加币
//    $sql = "UPDATE bot_base SET base_amount=base_amount+'{$num}' WHERE bot_id = '{$data['bot_id']}'";
//    $db->query($sql);
//    $count = $db->affectedRows();
//    if (!$count){
//        $db->Rollback($pInTrans);
//        exit_error("101", "更新余额失败");
//    }

    //加币记录表
//    $dat['bot_ls_id'] = get_guid();
//    $dat['bot_receive_id'] = $data['bot_id'];
//    $dat['bot_mark'] = $data['bot_nickname'];
//    $dat['bot_num'] = $num;
//    $dat['bot_create_time'] = time();
//    $sql = $db->sqlInsert("bot_Iss_records", $dat);
//    $bot_ls_id = $db->query($sql);
//    if (!$bot_ls_id){
//        $db->Rollback($pInTrans);
//        exit_error('190','存储送币记录失败');
//    }

    $db->Commit($pInTrans);



}
