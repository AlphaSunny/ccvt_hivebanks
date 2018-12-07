<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/2
 * Time: 下午7:15
 */

/**
 * @param $user
 * @param $password
 * @return bool
 * 检查登陆账号密码
 */
function login_check($user,$password){

    $db = new DB_COM();
    $sql = "select *  from la_admin where user = '{$user}' and pwd = '{$password}'";
    $db->query($sql);
    $res = $db->fetchRow();

    if($res)
        return true;
    return false;

}

/**
 * @param $user
 * @return int
 * 登陆失败计数：登陆错误超过三次则限制登陆30分钟
 */
function login_failed_log_count($user,$login_time){

    $time = $login_time-1800;

    $db = new DB_COM();
    $sql = "select log_id from la_login_log where login_status = 0 and user = '{$user}' and login_time>'{$time}' ";
    $db->query($sql);
    return $db->affectedRows();

}

/**
 * @param $data
 * @return bool
 * 记录登陆情况
 */
function login_log($data){

    $db = new DB_COM();

    $sql = $db->sqlInsert('la_login_log',$data);
    $res = $db->query($sql);
    if($res)
        return true;
    return false;
}

/**
 * @param $user
 * 登陆成功返回 用户信息和可见菜单
 */
function login_user_info($user){

    $db = new DB_COM();
    $sql = "select id,user,real_name,pid,last_login_time,last_login_city,last_login_ip from la_admin where user='{$user}'";
    $db->query($sql);
    $res = $db->fetchRow();

    $return_array = array();
    $pid_array = array();
    $pid_array = explode(',',$res['pid']);
    $pid_list  = array();
    foreach ($pid_array as $pid){

        $sql = "select pname,subname from la_permit where pid='{$pid}'";
        $db->query($sql);
        $pid_single = $db->fetchAll();
        $pid_list[] = $pid_single;

    }
    $return_array['menu'] = $pid_list;
    $return_array['user_info'] = $res;

    return $return_array;

}

/**
 * @param $user
 * @param $ip_login
 * @param $city_login
 * @param $time_login
 * @return int
 *
 * 更新用户登陆记录（最近一次登陆时间，城市，ip）
 */
function login_bingo_update($user,$ip_login,$city_login,$time_login){

    $db = new DB_COM();
    $sql = "update la_admin set last_login_time = '{$time_login}' , last_login_city='{$city_login}' , last_login_ip='{$ip_login}'
            where user = '{$user}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;

}




//======================================
//  查询la
// 参数: user         la的ID
// 返回:
//       count        影响的行数
//======================================
function get_la_by_user($id){
    $db = new DB_COM();
    $sql = "select * from la_admin where id='{$id}' ";
    $db->query($sql);
    return $count = $db->affectedRows();
}




/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/14
 * Time: 下午12:17
 */

function la_user_check($token)
{

    $key = Config::TOKEN_KEY;
// 获取token并解密
    $des = new Des();
    $decryption_code = $des -> decrypt($token, $key);
    $now_time = time();
    $code_conf =  explode(',',$decryption_code);

    if(!isset($code_conf[0])||!isset($code_conf[1]))
        exit_error('114','Token timeout please retrieve!');
// 获取token中的需求信息
    $user = $code_conf[0];
    $timestamp = $code_conf[1];

    if($timestamp < $now_time){
        exit_error('114','Token timeout please retrieve!');
    }

//判断la是否存在
    $row = get_la_by_user($user);
    if(!$row){
        exit_error('120','用户不存在');
    }

    return $user;

}