<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/21
 * Time: 下午6:51
 */

function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ba_id);//FZG  (return 0;)
    return $hash_id;
}

function  get_withdraw_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ba_id);//FZG  (return 0;)
    return $hash_id;
}