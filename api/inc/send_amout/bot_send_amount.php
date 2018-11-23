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

    //存储聊天记录
    $sql = $db->sqlInsert("bot_message", $data);
    $bot_message_id = $db->query($sql);
    if (!$bot_message_id){
        $db->Rollback($pInTrans);
        exit_error('190','存储失败');
    }


    $db->Commit($pInTrans);



}
