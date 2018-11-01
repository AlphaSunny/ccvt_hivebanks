<?php
//======================================
// 函数: 获取微信信息表中最后一个标识符
// 参数: 无
// 返回: $row        最新信息数组
//======================================
function get_bot_last_mark()
{
    $db = new DB_COM();
    $sql = "SELECT bot_mark FROM bot_base ORDER BY bot_mark DESC LIMIT 1 ";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 注册微信用户
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function ins_bind_bot_info($data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_base", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}
//======================================
// 函数: 搜索微信用户是否存在
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_us_base($data)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE wechat='{$data['wechat']}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 搜索微信用户当日发言数量
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_base_message_count($data)
{
    $day_start = strtotime(date('Y-m-d 00:00:00'));
    $day_end = strtotime(date('Y-m-d 23:59:59'));

    $db = new DB_COM();
    $sql = "SELECT * FROM bot_message WHERE wechat='{$data['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'";
    $db->query($sql);
    $count = $db -> affectedRows();
    $rows['count'] = $count;

    $sql = "select group_name,count(bot_message_id) as count from bot_message where wechat='{$data['wechat']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by group_name";
    $db->query($sql);
    $row = $db->fetchAll();
    $rows['list'] = $row;

    return $rows;
}

//======================================
// 函数: 搜索微信用户余额
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_bot_amount($data)
{
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM us_base WHERE wechat='{$data['wechat']}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 搜索微信用户当日发言数量
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function search_us_all_message()
{
    $day_start = strtotime(date('Y-m-d 00:00:00'));
    $day_end = strtotime(date('Y-m-d 23:59:59'));

    $db = new DB_COM();
    $sql = "SELECT bot_nickname,bot_content,bot_send_time FROM bot_message WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time ASC";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}


//======================================
// 函数: 统计余额排行榜
// 参数: $data
//返回： rows               数据
//======================================
function statistics_amount_list()
{
    $db = new DB_COM();
    $sql = "SELECT us_account,base_amount FROM us_base ORDER BY us_account DESC limit 10";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数:微信机器人定时任务返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_timer()
{
    $db = new DB_COM();
    $sql = "SELECT a.time,a.content,a.group_id FROM bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0  ORDER BY a.intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人群组返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_bot_group()
{
    $db = new DB_COM();
    $sql = "SELECT id,name,ba_id,is_del,is_flirt FROM bot_group ORDER BY intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人全天开放日期列表返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_bot_date()
{
    $db = new DB_COM();
    $sql = "SELECT date FROM bot_date ORDER BY intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人二维码地址
// 参数: $data
//返回： rows               数据
//======================================
function bot_qrcode($data){
    $db = new DB_COM();
    $sql = "select * from bot_status limit 1";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set qr_path='{$data['qrcode']}', ctime='{$time}' where id='{$info['id']}'";
        $db->query($sql);
        return $db->affectedRows();
    }else{
        $sql = $db->sqlInsert("bot_status", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;
        return true;
    }
}

//======================================
// 函数:微信机器人登录状态
// 参数: $data
//返回： rows               数据
//======================================
function bot_alive($data){
    $db = new DB_COM();
    $sql = "select * from bot_status limit 1";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set robot_alive='{$data['robot_alive']}', ctime='{$time}' where id='{$info['id']}'";
        $db->query($sql);
        if ($db->affectedRows()){
            if ($data['robot_alive']==2){
                $sql = "select * from bot_log_login WHERE login_out_time=='' ORDER BY intime desc";
                $db->query($sql);
                $lo = $db->fetchRow();
                if ($lo){
                    $sql = "update bot_log_login set login_out_time='{$time}'";
                    $db->query($sql);
                    return $db->affectedRows();
                }else{
                    return 1;
                }
            }else{
                $d['login_in_time'] = $time;
                $d['intime'] = $time;
                $sql = $db->sqlInsert("bot_log_login", $data);
                $q_id = $db->query($sql);
                if ($q_id == 0)
                    return false;
                return true;
            }
        }
    }else{
        $sql = $db->sqlInsert("bot_status", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;

        $d['login_in_time'] = $time;
        $d['intime'] = $time;
        $sql = $db->sqlInsert("bot_log_login", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;

        return true;
    }
}

//======================================
// 函数: 获取二维码地址
// 参数: $data
//返回： true               成功
//        false             失败
//======================================
function get_qrcode()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_status limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 获取key_code
// 参数:
//返回： true               成功
//        false             失败
//======================================
function get_key_code()
{
    $db = new DB_COM();
    $sql = "SELECT key_code FROM la_admin limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row['key_code'];
}

//======================================
// 函数: 更新群组成员
// 参数:  $data
//返回： true               成功
//        false             失败
//======================================
function storage_members($data)
{
    //插入数据
//    $sql= "insert into bot_group_members (member_id,name,group_id,group_name,intime) values ";
//    foreach (json_decode($data['name']) as $k=>$value){
//        $sql .= "('".get_guid()."','".$value."','".$data['group_id']."','".$data['group_name']."','".time()."'),";
//    }

    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_group_members", $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 删除群组成员
// 参数:
//
// 返回: row           最新信息数组
//======================================
function del_storage_members($group_id)
{
    $db = new DB_COM();
    $sql = "DELETE from bot_group_members where group_id='{$group_id}'";
    $res = $db->query($sql);
    if($res)
        return true;
    return false;
}

//======================================
// 函数: 判断时间内群内是否有人发消息
// 参数:
//
// 返回: row           最新信息数组
//======================================
function check_chat_time($group_name)
{
    $db = new DB_COM();
    $sql = "select check_chat_time from bot_status limit 1";
    $db->query($sql);
    $time = $db->getField($sql,'check_chat_time');

    $start = time()-($time*60);
    $end = time();
    $sql = "select count(bot_message_id) as count from bot_message WHERE group_name='{$group_name}' AND bot_create_time BETWEEN '{$start}' AND '{$end}'";
    $db->query($sql);
    $count = $db->getField($sql,'count');
    return $count;
}

//======================================
// 函数: post提交
//======================================
function request_post($url = '', $param = '') {
    if (empty($url) || empty($param)) {
        return false;
    }

    $postUrl = $url;
    $curlPost = $param;
    $curl = curl_init();//初始化curl
    curl_setopt($curl, CURLOPT_URL,$postUrl);//抓取指定网页
    curl_setopt($curl, CURLOPT_HEADER, 0);//设置header
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
    curl_setopt($curl, CURLOPT_POST, 1);//post提交方式
    curl_setopt($curl, CURLOPT_POSTFIELDS, $curlPost);
    $data = curl_exec($curl);//运行curl
    curl_close($curl);

    return $data;
}

//======================================
// 函数: 百度api验证获取token
//======================================
function get_token(){
    $url = 'https://aip.baidubce.com/oauth/2.0/token';
    $post_data['grant_type']       = 'client_credentials';
    $post_data['client_id']      = 'QxXAyNDv1PkrVtRpfmEi7z98';
    $post_data['client_secret'] = 'l94MMV97gRIIV14HSVwri3jzaD4xxxoK';
    $o = "";
    foreach ( $post_data as $k => $v )
    {
        $o.= "$k=" . urlencode( $v ). "&" ;
    }
    $post_data = substr($o,0,-1);

    $res = request_post($url, $post_data);

    $res = json_decode($res,true);

    return $res['access_token'];

}
//======================================
// 函数: 百度api验证内容
//======================================
function get_is_effective($content){
    $token = get_token();
    $url = 'https://aip.baidubce.com/rest/2.0/antispam/v2/spam';
    $post_data['access_token']       = $token;
    $post_data['content']      = $content;
    $o = "";
    foreach ( $post_data as $k => $v )
    {
        $o.= "$k=" . urlencode( $v ). "&" ;
    }
    $post_data = substr($o,0,-1);

    $res = request_post($url, $post_data);

    $res = json_decode($res,true);
    return $res['result']['spam'];

}


?>
