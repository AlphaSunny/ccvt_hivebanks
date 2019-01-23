<?php

die('hold on');

ini_set('date.timezone','Asia/Shanghai');
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');


require_once('config.php');
require_once('log.php');
require_once('mysql.php');
require_once('db_connect.php');
require_once('des.php');
//======================================
// 函数: GET/POST必须参数是否为空检查
// 参数: $type          GET或POST
// 参数: $args          需检查的参数数组
// 返回: 无
// 说明: 若参数有一个为空则直接异常退出
//======================================
function chk_empty_args($type = 'GET', $args)
{
  if (Config::AUTO_TEST_FLAG)
    return;

  if (empty($type))
    exit_error();

  if ($type != 'GET' AND $type != 'POST')
    exit_error();

  foreach ($args as $arg) {
    $arg_str = '';

    if ($type == 'GET' && isset($_GET[$arg]))
      $arg_str = trim($_GET[$arg]);

    if ($type == 'POST' && isset($_POST[$arg]))
      $arg_str = trim($_POST[$arg]);

    if (empty($arg_str))
      exit_error('120', "{$arg} {$type} parameter is empty");
  }
  return;
}

//======================================
// 函数: 获取GET/POST的参数，添加反斜杠处理
// 参数: $type          GET或POST
// 参数: $arg           参数
// 参数: $max_len       最大长度（默认50）
// 返回: 处理后的参数
// 说明:
//======================================
function get_arg_str($type, $arg, $max_len = 100)
{
  if (Config::AUTO_TEST_FLAG)
    return get_test_arg($arg);

  $arg_str = '';
  if ($type == 'GET' && isset($_GET[$arg]))
    $arg_str = substr(trim($_GET[$arg]), 0, $max_len);

  if ($type == 'POST' && isset($_POST[$arg]))
    $arg_str = substr(trim($_POST[$arg]), 0, $max_len);

  // PHP已开启自转义
  if (get_magic_quotes_gpc())
    return $arg_str;

  return addslashes($arg_str);
}


//======================================
// 函数: 取得分页相关参数(limit, offset)
// 参数: $type          GET或POST
// 返回: array($limit, $offset)
// 说明: 分页相关参数(limit, offset)处理
//======================================
function get_paging_arg($type)
{
  $limit = Config::REC_LIMIT;
  $offset = 0;
  if ($type == 'GET' && isset($_GET['limit']))
    $limit = intval($_GET['limit']);
  if ($type == 'POST' && isset($_POST['limit']))
    $limit = intval($_POST['limit']);
  if ($type == 'GET' && isset($_GET['offset']))
    $offset = intval($_GET['offset']);
  if ($type == 'POST' && isset($_POST['offset']))
    $offset = intval($_POST['offset']);

  $limit = min($limit,Config::REC_LIMIT_MAX);

  return array($limit, $offset);
}

//======================================
// 函数: 取得下拉列表选项
// 参数: $list          全体列表数组
// 参数: $select        默认选择项目
// 返回: 下拉列表选项
// 说明:
//======================================
function get_select_option($list, $select)
{
  $option = '';
  foreach ($list as $key=>$val) {
    if ($key == $select) {
      $option .= '<option value="' . $key . '" selected="selected">' . $val . '</option>';
    } else {
      $option .= '<option value="' . $key . '">' . $val . '</option>';
    }
  }
  return $option;
}

//======================================
// 函数: 取得单选框列表选项
// 参数: $name          控件名
// 参数: $list          全体列表数组
// 参数: $checked       默认选择项目
// 返回: 下拉列表选项
// 说明:
//======================================
function get_radio_input($name, $list, $checked)
{
  $input = '';
  foreach ($list as $key=>$val) {
    if ($key == $checked) {
      $input .= '<input type="radio" name="' . $name . '" value="' . $key . '" title="' . $val . '" checked>';
    } else {
      $input .= '<input type="radio" name="' . $name . '" value="' . $key . '" title="' . $val . '">';
    }
  }
  return $input;
}

//======================================
// 函数: 将用户输入内容转型放入数据库(HTML代码无效)
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function str_to_html($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace("<", "&lt;", $value);
    $rtn_str = str_replace(">", "&gt;", $rtn_str);
    $rtn_str = str_replace(chr(34), "&quot;", $rtn_str);
    $rtn_str = str_replace(chr(13), "<br>", $rtn_str);
    $rtn_str = str_replace("\n", "<br>", $rtn_str);
    $rtn_str = str_replace(chr(9), "　　　　", $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 将用户输入内容转型放入数据库(HTML代码有效)
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function str_to_html_able($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace(chr(34), "&quot;", $value);
    $rtn_str = str_replace(chr(13), "<br>", $rtn_str);
    $rtn_str = str_replace("\n", "<br>", $rtn_str);
    $rtn_str = str_replace(chr(9), "　　　　", $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 将数据库存放的用户输入内容转换回再修改内容
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function html_to_str($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace("&nbsp;", " ", $value);
    $rtn_str = str_replace("&lt;", "<", $rtn_str);
    $rtn_str = str_replace("&gt;", ">", $rtn_str);
    $rtn_str = str_replace("&quot;", chr(34), $rtn_str);
    $rtn_str = str_replace("<br>", chr(13), $rtn_str);
    $rtn_str = str_replace("<br />", chr(13), $rtn_str);
    $rtn_str = str_replace("<br/>", chr(13), $rtn_str);
    $rtn_str = str_replace("&#32;", chr(9), $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 取得唯一标示符GUID
// 参数: 无
// 返回: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX（8-4-4-4-12，共36位）
// 说明: 随机数前缀+根据当前时间生成的唯一ID转成大写的MD5码
// 说明: 32位重排+分隔符4位生成36位GUID
//======================================
function get_guid()
{
  $charid = strtoupper(md5(uniqid(mt_rand(), true)));
  $hyphen = chr(45);  // "-"
  $uuid = substr($charid, 6, 2).substr($charid, 4, 2).substr($charid, 2, 2).substr($charid, 0, 2).$hyphen;
  $uuid .= substr($charid, 10, 2).substr($charid, 8, 2).$hyphen;
  $uuid .= substr($charid,14, 2).substr($charid,12, 2).$hyphen;
  $uuid .= substr($charid,16, 4).$hyphen;
  $uuid .= substr($charid,20,12);
  return $uuid;
}

//======================================
// 函数: 返回当前URL
// 参数: 无
// 返回:
//======================================
function get_url()
{
  $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
  return $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
}

//======================================
// 函数: 取得用户访问IP
// 参数: 无
// 返回: XXX.XXX.XXX.XXX
// 返回:
//======================================
function get_ip()
{
  $ip=false;
  if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
    $ip = $_SERVER["HTTP_CLIENT_IP"];
  }
  if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
    if($ip) {
      array_unshift($ips, $ip);
      $ip = FALSE;
    }
    for($i = 0; $i < count($ips); $i++) {
      if (!preg_match("/^(10|172\.16|192\.168)\./", $ips[$i])) {
        $ip = $ips[$i];
        break;
      }
    }
  }
  return($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}

//======================================
// 函数: 取得用户访问IP的长整数
// 参数: 无
// 返回: IP地址对应的长整数
// 返回: 若无法取得返回 0
//======================================
function get_int_ip()
{
  $ip = ip2long(get_ip());
  if ($ip)
    return $ip;
  return 0;
}

//======================================
// 函数: 将日志里面的数组或JSON数据转成可识别的字符串形式
// 功能: 如果是JSON数据先转成数组形式
// 功能: 如果是数组则直接转成字符串形式
// 功能: 否则直接返回
// 参数: $rtn_data      需转换的数据
// 返回: 数组和JSON转成{"key1":"value1","key2":"value2"} 形式的字符串
//======================================
function get_log_msg_str($rtn_data)
{
  $rtn_arry = $rtn_data;
  // 非数组则尝试转成数组格式
  if (!is_array($rtn_arry)) {
    $rtn_arry = json_decode($rtn_data, true);
    // 转换结果为空数组或非数组则直接返回原有结果
    if (empty($rtn_arry) || !is_array($rtn_arry))
      return $rtn_data;
  }

  $buff = "";
  foreach ($rtn_arry as $k => $v) {
    if (!is_array($v)) {
      $buff .= '"' . $k . '":"' . $v . '",';
    } else {
      $buff .= '"' . $k . '":' . get_log_msg_str($v) . ',';
    }
  }

  $buff = trim($buff, ",");
  return '{' . $buff . '}';
}

//======================================
// 函数: 禁止游客访问
// 参数: 无
// 返回: 无
// 说明: 若session中没有设置staff_id，直接退出
//======================================
function exit_guest()
{
  if (!session_id())
    session_start();

  if (!isset($_SESSION['staff_id']))
    exit('Login failure, please login again.');
}

//======================================
// 函数: 异常退出
// 参数: $errcode       错误代码（默认-1）
// 参数: $errmsg        错误信息（默认系统繁忙，稍候再试）
// 返回: 无
// 说明: 返回异常退出的json数据
//======================================
function exit_error($errcode = '-1', $errmsg = '')
{
  // 未设置错误信息
  if (empty($errmsg)) {
    // 通用错误码
    switch ($errcode) {
    case '90':
        $errmsg = '活动尚未开始，请耐心等待';
        break;
    case '100':
        $errmsg = '活动已经结束，感谢您的参与';
        break;
    case '101':
        $errmsg = '登录验证失败，请重新登录';
        break;
    case '110':
        $errmsg = '服务异常中断，请与管理员联系';
        break;
    case '114':
        $errmsg = '登录已过期，请重新登录';
        break;
    case '119':
        $errmsg = '登录已失效，请重新登录';
        break;
    case '120':
        $errmsg = '参数错误';
        break;
    case '130':
        $errmsg = '禁止操作';
        break;
    case '140':
        $errmsg = 'ID不存在';
        break;
    case '150':
        $errmsg = '数字签名错误';
        break;
    case '190':
        $errmsg = '未知错误';
        break;
    default:
        $errmsg = '系统繁忙，稍候再试';
        break;
    }
  }

  $rtn_ary = array();
  $rtn_ary['errcode'] = $errcode;
  $rtn_ary['errmsg'] = $errmsg;
  $rtn_str = json_encode($rtn_ary);
  php_end($rtn_str, Config::WARN_LEVEL);
}

//======================================
// 函数: 正常退出
// 参数: $msg         正常退出信息（默认空）
// 返回: 无
// 说明: 返回正常退出的json数据
//======================================
function exit_ok($msg='')
{
  $rtn_ary = array();
  $rtn_ary['errcode'] = '0';
  $rtn_ary['errmsg'] = $msg;
  $rtn_str = json_encode($rtn_ary);
  php_end($rtn_str);
}
function exit_succress($data,$msg = '')
{
    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = $msg;
    $rtn_ary["row"] = $data;
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}
//======================================
// 函数: PHP程序运行开始处理
// 参数: $log_level   日志等级(1跟踪，2 正常，4警告，8异常)
// 返回: 无
// 说明: PHP运行开始，日志等级默认1跟踪
//======================================
function php_begin($log_level = Config::DEBUG_LEVEL)
{
//  // LOG日志是否执行判定
//  if (Config::PHP_LOG_LEVEL > 0) {
//    // 初始化PHP运行日志
//      $log_file =  Config::PHP_LOG_FILE_PREFIX . date('Y-m-d') . '.log';
//
//    $logHandler = new LogFileHandler($log_file);
//    $log = Log::Init($logHandler, Config::PHP_LOG_LEVEL);
//    // 记录信息，调用程序，用户IP，调用参数
//    $msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//
//    switch($log_level)
//    {
//      // 记录正常日志
//      case Config::INFO_LEVEL:
//        // 日志记录正常日志
//        Log::INFO($msg);
//        break;
//      // 记录跟踪日志
//      default:
//        // 日志记录跟踪日志
//        Log::DEBUG($msg);
//        break;
//    }
//  }
  return;
}

//======================================
// 函数: PHP程序运行结束处理
// 参数: $rtn_data    返回信息(ApiRtnData类)
// 参数: $log_level   日志等级(1跟踪，2 正常，4警告，8异常)
// 返回: $rtn_data
// 说明: PHP运行结束处理，日志等级默认1跟踪
//======================================
function php_end($rtn_data, $log_level = Config::DEBUG_LEVEL)
{

//    // LOG日志是否执行判定
//  if (Config::PHP_LOG_LEVEL > 0) {
//    // 初始化PHP运行日志
//      $log_file =  Config::PHP_LOG_FILE_PREFIX . date('Y-m-d') . '.log';
//    $logHandler = new LogFileHandler($log_file);
//    $log = Log::Init($logHandler, Config::PHP_LOG_LEVEL);
//    // 记录信息，调用程序，用户IP，返回数据
//    $msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Rtn:" . get_log_msg_str($rtn_data);
//
//    switch($log_level)
//    {
//      // 记录异常日志
//      case Config::ERROR_LEVEL:
//        $beg_msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//        Log::ERROR($beg_msg);
//        Log::ERROR($msg);
//        break;
//      // 记录警告日志
//      case Config::WARN_LEVEL:
//        $beg_msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//        Log::WARN($beg_msg);
//        Log::WARN($msg);
//        break;
//      // 记录正常日志
//      case Config::INFO_LEVEL:
//        Log::INFO($msg);
//        break;
//      // 记录跟踪日志
//      default:
//        Log::DEBUG($msg);
//        break;
//    }
//  }

  if (isset($_GET['callback'])) {
    $callback = $_GET['callback'];
    exit("{$callback}({$rtn_data});");
  } else {
    exit($rtn_data);
  }


}

function getMillisecond(){
    list($s1,$s2)=explode(' ',microtime());
    return (float)sprintf('%.0f',(floatval($s1)+floatval($s2))*1000);
}


//======================================
// 函数: 验证token信息
// 参数: token,type:如果为空,只返回id,则返回所以
// 返回: id
// 说明: 若验证错误,直接返回错误信息
//======================================

function check_token($token,$type=''){
    $key = Config::TOKEN_KEY;
    // 获取token并解密
    $des = new Des();
    $decryption_code = $des -> decrypt($token, $key);
    $now_time = time();
    $code_conf =  explode(',',$decryption_code);
    if (count($code_conf) <= 1)
        exit_error('114','Token timeout please retrieve!');

    // 获取token中的需求信息
    $us_id = $code_conf[0];
    $timestamp = $code_conf[1];
    if($timestamp < $now_time){
        exit_error('114','Token timeout please retrieve!');
    }
    if ($type)
        return $code_conf;
    else
        return $us_id;
}

//======================================
// 函数: 获取la的数字货币单位
// 参数:
// 返回: 数字货币单位
//======================================
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["unit"];
}


//======================================
// 函数: 获取点赞(点踩)最大值
// 参数:
// 返回:
//======================================
function get_praise_pointon_maxnum()
{
    $db = new DB_COM();

    $m_config = array();
    $sql = "select option_key,option_value from com_option_config WHERE option_key IN ('max_give_like','max_give_no_like')";
    $db->query($sql);
    $list = $db->fetchAll();
    foreach($list as $item){
        $m_config[$item['option_key']] = $item['option_value'];
    }
    return $m_config;
}
//======================================
// 函数: 获取转账最大(小)值
// 参数:
// 返回:
//======================================
function get_transfer_maximum_minimum_value()
{
    $db = new DB_COM();

    $m_config = array();
    $sql = "select option_key,option_value from com_option_config WHERE option_key IN ('transfer_big','transfer_small')";
    $db->query($sql);
    $list = $db->fetchAll();
    foreach($list as $item){
        $m_config[$item['option_key']] = $item['option_value'];
    }
    return $m_config;
}

//======================================
// 函数: 所有变动记录
// 参数:$credit_id  :us_id   $send_money:金额(没有乘汇率)  $flag   $detail  $type   $transfer_type   $transfer_us_id(用于转账类型)
// 返回:
//注://ba-us(分给余额加减和锁定余额   锁仓余额(big_us_lock)、员工动态调整(dynamic_tuning)这两个是加锁定余额)  us-la(点赞)  us-us(转账)   us-ba(离职回收,用户提现)
//======================================
function into_transfer_balance($us_id,$send_money,$flag,$detail,$type,$transfer_type,$transfer_us_id=''){
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $ba_id = get_ba_id();
    $la_id = get_la_us_id();
    $unit = get_la_base_unit();
    $send_money = $send_money*$unit;

    switch ($transfer_type){
        case "ba-us":
            //用户加钱
            $sql = "update us_base set";
            if ($type=='big_us_lock' or $type=='dynamic_tuning'){
                $sql .= " lock_amount=lock_amount+'{$send_money}'";
            }else{
                $sql .= " base_amount=base_amount+'{$send_money}'";
            }
            $sql .= "WHERE us_id='{$us_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }

            //ba减钱
            $sql = "update ba_base set base_amount=base_amount-'{$send_money}' WHERE ba_id='{$ba_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }
            break;
        case "us-la":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }

            //la加钱
            $sql = "update la_base set base_amount=base_amount+'{$send_money}' limit 1";
            $db->query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }
            break;
        case "us-us":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }

            //用户加钱
            $sql = "update us_base set base_amount=base_amount+'{$send_money}' WHERE us_id='{$transfer_us_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }
            break;
        case "us-ba":
            $sql = "update us_base set";
            if ($type=='gone_staff'){
                //用户锁定减钱
                $sql .= " lock_amount=lock_amount-'{$send_money}'";
            }elseif ($type=='ba_out'){
                //用户可用余额减钱
                $sql .= " base_amount=base_amount-'{$send_money}'";
            }
            $sql .= " WHERE us_id='{$us_id}'";
            $db -> query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }

            //ba加钱
            $sql = "update ba_base set base_amount=base_amount+'{$send_money}' WHERE ba_id='{$ba_id}'";
            $db->query($sql);
            if (!$db->affectedRows()){
                $db->Rollback($pInTrans);
                return false;
            }
            break;
    }

    //判断类型,指定值
    switch ($transfer_type){
        case "ba-us":
            $credit_id = $ba_id;
            $debit_id = $us_id;
            $transfer_credit_balance = get_ba_base_amount($credit_id)-$send_money;
            $dat_credit_balance = get_u_amount($debit_id)+$send_money;
            break;
        case "us-la":
            $credit_id = $us_id;
            $debit_id = $la_id;
            $transfer_credit_balance = get_u_amount($credit_id)-$send_money;
            $dat_credit_balance = get_l_base_amount($debit_id)+$send_money;
            break;
        case "us-us":
            $credit_id = $us_id;
            $debit_id = $transfer_us_id;
            $transfer_credit_balance = get_u_amount($credit_id)-$send_money;
            $dat_credit_balance = get_u_amount($debit_id)+$send_money;
            break;
        case "us-ba":
            $credit_id = $us_id;
            $debit_id = $ba_id;
            $transfer_credit_balance = get_u_amount($credit_id)-$send_money;
            $dat_credit_balance = get_ba_base_amount($debit_id)+$send_money;
            break;
    }
    /******************************转账记录表(提现不存)***************************************************/
    if ($type!='ba_out'){
        //赠送者
        $transfer['hash_id'] = hash('md5', $credit_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
        $prvs_hash = get_transfer_hash($credit_id);
        $transfer['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$credit_id) : $prvs_hash;
        $transfer['credit_id'] = $credit_id;
        $transfer['debit_id'] = $debit_id;
        $transfer['tx_amount'] = -$send_money;
        $transfer['credit_balance'] = $transfer_credit_balance;
        $transfer['tx_hash'] = hash('md5', $credit_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $transfer['flag'] = $flag;
        $transfer['transfer_type'] = $transfer_type;
        $transfer['transfer_state'] = 1;
        $transfer['tx_detail'] = $detail;
        $transfer['give_or_receive'] = 1;
        $transfer['ctime'] = time();
        $transfer['utime'] = date('Y-m-d H:i:s');
        $transfer['tx_count'] = transfer_request_get_pre_count($credit_id);
        $sql = $db->sqlInsert("com_transfer_request", $transfer);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return false;
        }

        //接收者
        $dat['hash_id'] = hash('md5', $debit_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
        $prvs_hash = get_transfer_hash($debit_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$debit_id) : $prvs_hash;
        $dat['credit_id'] = $debit_id;
        $dat['debit_id'] = $credit_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = $dat_credit_balance;
        $dat['tx_hash'] = hash('md5', $debit_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
        $dat['flag'] = $flag;
        $dat['transfer_type'] = $transfer_type;
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $detail;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = time();
        $dat['utime'] = date('Y-m-d H:i:s');
        $dat['tx_count'] = transfer_request_get_pre_count($debit_id);

        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return false;
        }
    }

    /***********************资金变动记录表***********************************/
    //减钱记录
    $com_balance_us['hash_id'] = hash('md5', $credit_id . $type . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $com_balance_us['tx_id'] = $transfer['tx_hash'] ? $transfer['tx_hash'] : hash('md5', $credit_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $prvs_hash = get_balance_pre_hash($credit_id);
    $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('md5',$credit_id) : $prvs_hash;
    $com_balance_us["credit_id"] = $credit_id;
    $com_balance_us["debit_id"] = $debit_id;
    $com_balance_us["tx_type"] = $transfer_type=='us-us' ? $type."_out" : $type;
    $com_balance_us["tx_amount"] = -$send_money;
    $com_balance_us["credit_balance"] = $transfer_credit_balance;
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');
    $com_balance_us['tx_count'] = base_balance_get_pre_count($credit_id);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    //加钱记录
    $com_balance_ba['hash_id'] = hash('md5', $debit_id. $type . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $com_balance_ba['tx_id'] = $dat['tx_hash'] ? $dat['tx_hash'] : hash('md5', $debit_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));;;
    $prvs_hash = get_balance_pre_hash($debit_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash===0 ? hash('md5',$debit_id) : $prvs_hash;
    $com_balance_ba["credit_id"] = $debit_id;
    $com_balance_ba["debit_id"] = $credit_id;
    $com_balance_ba["tx_type"] = $transfer_type=='us-us' ? $type."_in" : $type;
    $com_balance_ba["tx_amount"] = $send_money;
    $com_balance_ba["credit_balance"] = $dat_credit_balance;
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = date('Y-m-d H:i:s');
    $com_balance_ba['tx_count'] = base_balance_get_pre_count($debit_id);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;


}
////获取ba余额
//function get_ba_base_amount($ba_id){
//    $db = new DB_COM();
//    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}'";
//    $db->query($sql);
//    $amount = $db->getField($sql,'base_amount');
//    return $amount;
//}
//
////获取us余额
//function get_u_amount($us_id){
//    $db = new DB_COM();
//    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}'";
//    $db->query($sql);
//    $amount = $db->getField($sql,'base_amount');
//    return $amount;
//}
//
////获取ba_id余额
//function get_ba_id(){
//    $db = new DB_COM();
//    $sql = "select ba_id from ba_base ORDER BY ctime ASC limit 1";
//    $ba_id = $db->getField($sql,'ba_id');
//    if ($ba_id==null){
//        return 0;
//    }
//    return $ba_id;
//}
//
////获取la id
//function get_la_us_id(){
//    $db = new DB_COM();
//    $sql = "select id from la_base limit 1";
//    $db->query($sql);
//    $id = $db->getField($sql,'id');
//    return $id;
//}
//
////获取la余额
//function get_l_base_amount($la_id){
//    $db = new DB_COM();
//    $sql = "select base_amount from la_base WHERE id='{$la_id}'";
//    $db->query($sql);
//    $amount = $db->getField($sql,'base_amount');
//    return $amount;
//}
//
////======================================
//// 函数: 获取上传交易hash
////======================================
//function get_transfer_hash($credit_id){
//    $db = new DB_COM();
//    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
//    $hash_id = $db->getField($sql, 'hash_id');
//    if($hash_id == null)
//        return 0;
//    return $hash_id;
//}
////======================================
//// 函数: 获取资金变动记录表的前置hash
//// 参数: ba_id                 baID
//// 返回: hash_id               前置hashid
////======================================
//function  get_balance_pre_hash($credit_id)
//{
//    $db = new DB_COM();
//    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$credit_id}'  ORDER BY  ctime DESC LIMIT 1";
//    $hash_id = $db->getField($sql, 'hash_id');
//    if($hash_id == null)
//        return 0;
//    return $hash_id;
//}
//
///**
// * @param $credit_id
// * @return int|mixed
// * 获取上一个交易的链高度 （com_base_balance表）
// */
//function base_balance_get_pre_count($credit_id)
//{
//    $db = new DB_COM();
//    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by ctime desc limit 1";
//    $tx_count = $db->getField($sql, 'tx_count');
//    if($tx_count == null)
//        return 1;
//
//    return $tx_count+1;
//}
//
///**
// * @param $credit_id
// * @return int|mixed
// * 获取上一个交易的链高度 （com_transfer_request表）
// */
//function transfer_request_get_pre_count($credit_id)
//{
//    $db = new DB_COM();
//    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by ctime desc limit 1";
//    $tx_count = $db->getField($sql, 'tx_count');
//    if($tx_count == null)
//        return 1;
//    return $tx_count+1;
//}



?>