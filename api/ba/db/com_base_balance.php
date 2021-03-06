<?php
//======================================
// 函数: 获取账户变动录记录总数
// 参数: us_id        用户id
// 返回: count        记录总数
//======================================
function  get_log_balance_total($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$us_id}'";//fzg:hash_id=>credit_id
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

//======================================
// 函数: 获取com_base_balance基本信息
// 参数: ba_id                  用户ba_id
// 返回: row                    用户基本信息数组
//         tx_type              交易类型
//         tx_amount            交易金额
//         credit_balance       借方交易后余额
//         hash_id              HASH值
//         ctime                变动时间
//======================================
function get_log_balance($ba_id,$offset,$limit)
{
    $db = new DB_COM();
    $sql = "SELECT tx_type,tx_amount,credit_balance,hash_id,ctime FROM com_base_balance WHERE credit_id = '{$ba_id}' order by ctime desc limit $offset , $limit";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 插入用户com_base_balance变动基本信息
// 参数: data_base               基本信息数组
//         hash_id               HASH值
//         tx_id                 交易ID（借贷双方同）
//         credit_id             借方ID
//         debit_id              贷方ID
//         tx_type               交易类型
//         tx_amount             交易金额
//         credit_balance        借方交易后余额
//         utime                 变动时间戳
//         ctime                 变动时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_us_rechargeAndwithdraw_com_base_banlance($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_base_balance", $data);
    $row = $db->query($sql);
    return $row;
}

//======================================
// 函数: 插入bacom_base_balance变动基本信息
// 参数: data_base               基本信息数组
//         hash_id               HASH值
//         tx_id                 交易ID（借贷双方同）
//         credit_id             借方ID
//         debit_id              贷方ID
//         tx_type               交易类型
//         tx_amount             交易金额
//         credit_balance        借方交易后余额
//         utime                 变动时间戳
//         ctime                 变动时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_ba_rechargeAndwithdraw_com_base_banlance($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_base_balance", $data);
    $row = $db->query($sql);
    return $row;
}
//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ba_id);
    return $hash_id;
}
//======================================
// 函数: 获取提现的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_withdraw_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ba_id);
    return $hash_id;
}
//======================================
// 函数: 获取ca充值的前置hash
// 参数: ca_id                 caID
// 返回: hash_id               前置hashid
//======================================
function  get_ca_recharge_pre_hash($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ca_id}'  ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ca_id); //FZG
    return $hash_id;
}
//======================================
// 函数: 获取ca提现的前置hash
// 参数: ca_id                 caID
// 返回: hash_id               前置hashid
//======================================
function  get_ca_withdraw_pre_hash($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ca_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return hash('md5',$ca_id);
    return $hash_id;
}


/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_base_balance表）
 */
function base_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by tx_count desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;

    return $tx_count+1;
}

/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_transfer_request表）
 */
function transfer_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by tx_count desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;
    return $tx_count+1;
}
