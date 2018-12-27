<?php
//======================================
// 函数: 收集群聊消息
// 参数: 无
// 返回: $row        最新信息数组
//======================================
function collect_message($data) {
    $db = new DB_COM();
    $time = time()-10;
    $sql = "select bot_message_id from bot_message WHERE bot_nickname='{$data['bot_nickname']}' AND bot_content='{$data['bot_content']}' AND wechat='{$data['wechat']}' AND group_name='{$data['group_name']}' AND bot_create_time>'{$time}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        return false;
    }else{
        //存储聊天记录
        $sql = $db->sqlInsert("bot_message", $data);
        $bot_message_id = $db->query($sql);
        if (!$bot_message_id){
            return false;
        }
    }
    return true;

}

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
    $sql = "SELECT a.id,a.time,a.content,a.group_id,a.tx_content,a.send_type,a.type FROM bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0  ORDER BY a.intime asc";
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
    $sql = "SELECT id,name,ba_id,is_del,is_flirt,us_id,is_test,is_admin_del,invite_code,send_address,bind_account_notice,is_welcome,welcome FROM bot_group WHERE is_del=1 AND is_audit=2 AND is_admin_del=1 ORDER BY intime asc";
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
    $sql = "select * from bot_status WHERE us_id='{$data['us_id']}'";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set qr_path='{$data['qrcode']}', utime='{$time}',bot_name='{$data['bot_name']}' where id='{$info['id']}'";
        $db->query($sql);
        return $db->affectedRows();
    }else{
        $date['ctime'] = time();
        $date['us_id'] = $data['us_id'];
        $sql = $db->sqlInsert("bot_status", $date);
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
    $sql = "select * from bot_status WHERE us_id='{$data['us_id']}' limit 1";
    $db -> query($sql);
    $info = $db->fetchRow();
    $time = time();
    if ($info){
        $sql = "update bot_status set robot_alive='{$data['robot_alive']}', utime='{$time}' where id='{$info['id']}'";
        $db->query($sql);
        if ($db->affectedRows()){
            $sql = "select * from bot_log_login WHERE login_out_time=0 AND us_id='{$data['us_id']}' ORDER BY intime desc limit 1";
            $db->query($sql);
            $lo = $db->fetchRow();
            if ($data['robot_alive']==2){
                if ($lo){
                    $sql = "update bot_log_login set login_out_time='{$time}' WHERE id='{$lo['id']}'";
                    $db->query($sql);
                    return $db->affectedRows();
                }else{
                    return 1;
                }
            }else{
                if (!$lo){
                    $d['login_in_time'] = $time;
                    $d['intime'] = $time;
                    $d['us_id'] = $data['us_id'];
                    $sql = $db->sqlInsert("bot_log_login", $d);
                    $q_id = $db->query($sql);
                    if ($q_id == 0)
                        return false;
                    return true;
                }else{
                    return 1;
                }

            }
        }
    }else{
        $sql = $db->sqlInsert("bot_status", $data);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;

        $d['login_in_time'] = $time;
        $d['us_id'] = $data['us_id'];
        $d['intime'] = $time;
        $sql = $db->sqlInsert("bot_log_login", $d);
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
function get_qrcode($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_status WHERE us_id='{$us_id}'";
    $db -> query($sql);
    $row = $db -> fetchRow();
    if ($row){
        $sql = "select * from bot_log_login WHERE login_out_time=0 ORDER BY intime DESC limit 1";
        $db->query($sql);
        $t = $db->fetchRow();
        if ($t){
            $row['login_time'] = date('Y-m-d H:i:s',$t['login_in_time']);
            //计算天数
            $timediff = time()-$t['login_in_time'];
            $days = intval($timediff/86400);
            //计算小时数
            $remain = $timediff%86400;
            $hours = intval($remain/3600);
            //计算分钟数
            $remain = $remain%3600;
            $mins = intval($remain/60);
            //计算秒数
            $secs = $remain%60;
            $row['elapsed_time'] = $days."天".$hours."小时".$mins."分钟".$secs."秒";

            $sql = "select count(bot_message_id) as count from bot_message WHERE us_id='{$us_id}' AND bot_create_time>='{$t['login_in_time']}'";
            $db->query($sql);
            $row['count'] = $db->getField($sql,'count');
        }

    }
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
    $time = time()-30*60;
    $sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$data['group_id']}' AND intime<'{$time}'";
    $db->query($sql);
    $count = $db->getField($sql,'count');
    if ($count>0){
        $sql = "select * from bot_group_members WHERE group_id='{$data['group_id']}' AND name='{$data['name']}' AND intime<'{$time}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            //新用户
            $date['name'] = $data['name'];
            $date['group_id'] = $data['group_id'];
            $date['group_name'] = $data['group_name'];
            $date['ctime'] = date('Y-m-d H:i:s');
            $date['type'] = 1;
            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
            $db->query($sql);
        }else{
            $sql = "update bot_group_members set is_check=2 WHERE group_id='{$data['group_id']}' AND name='{$data['name']}' AND intime<'{$time}'";
            $db->query($sql);
        }
    }
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
    $time = time()-30*60;
    $sql = "select * from bot_group_members WHERE group_id='{$group_id}' AND intime<'{$time}' AND is_check=1";
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        foreach ($rows as $k=>$v){
            //修改名称或退出
            $date['name'] = $v['name'];
            $date['group_id'] = $v['group_id'];
            $date['group_name'] = $v['group_name'];
            $date['ctime'] = date('Y-m-d H:i:s');
            $date['type'] = 2;
            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
            $db->query($sql);
        }
    }
    $sql = "DELETE from bot_group_members where group_id='{$group_id}' AND intime<'{$time}'";
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
// 函数: 判断群聊是否已经绑定ccvt账户,如果没绑定通知
// 参数:
//
// 返回: row           最新信息数组
//======================================
function notice_records($data)
{
    $db = new DB_COM();
    $start = strtotime(date('Y-m-d 00:00:00'));
    $end = strtotime(date('Y-m-d 23:59:59'));
    $sql = "select * from us_base WHERE wechat='{$data['wechat']}' limit 1";
    $db->query($sql);
    $wechat = $db->fetchRow();
    if ($wechat){
        $sql = "select * from bot_notice_records WHERE wechat='{$data['wechat']}' AND intime BETWEEN '{$start}' AND '{$end}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if ($row) {
            $status = 1;
        }else{
            //判断荣耀积分是否为负数
            $sql = "select base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$wechat['us_id']}' limit 1";
            $db->query($sql);
            $glory_integral = $db->fetchRow();
            if ($glory_integral && $glory_integral['base_amount']<0){
                $status = 3;
            }else{
                $status = 1;
            }
        }

    }else{
        $sql = "select * from bot_notice_records WHERE wechat='{$data['wechat']}' AND intime BETWEEN '{$start}' AND '{$end}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if ($row){
            $status = 1;
        }else{
            $sql = $db->sqlInsert("bot_notice_records", $data);
            $db->query($sql);
            $status = 2;
        }
    }
    return $status;
}

//======================================
// 函数: 获取最新的未推送的一个文章,优先推送官方新闻
// 参数:
//
// 返回: row           最新信息数组
//======================================
function get_news()
{
    $db = new DB_COM();
    $sql = "select news_id,title from la_news WHERE is_hive_been=1 AND category=1 AND status=1 ORDER BY ctime DESC limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        $sql = "update la_news set is_hive_been=2 WHERE news_id='{$row['news_id']}'";
        $db->query($sql);
    }else{
        $sql = "select news_id,title from la_news WHERE is_hive_been=1 AND category=2 AND status=1 ORDER BY ctime DESC limit 1";
        $db->query($sql);
        $row = $db->fetchRow();
        if ($row){
            $sql = "update la_news set is_hive_been=2 WHERE news_id='{$row['news_id']}'";
            $db->query($sql);
        }
    }
    return $row;
}

//======================================
// 函数: 获取最新的未推送的一个话题
// 参数:
//
// 返回: row           最新信息数组
//======================================
function get_topic($group_name,$ask)
{
    $db = new DB_COM();
    if ($ask=="话题" || $ask== "今日话题"){
        $start = date('Y-m-d 00:00:00');
        $sql = "select * from bot_topic WHERE is_send=2 AND group_name='{$group_name}' AND send_time>'{$start}' ORDER BY ctime DESC limit 1";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            $sql = "select * from bot_topic WHERE is_send=1  ORDER BY ctime ASC limit 1";
            $db->query($sql);
            $row = $db->fetchRow();
            if ($row){
                $send_time = date('Y-m-d H:i:s');
                $sql = "update bot_topic set is_send=2,group_name='{$group_name}',send_time='{$send_time}' WHERE id='{$row['id']}'";
                $db->query($sql);
            }
        }
    }elseif($ask=="最新话题" || $ask=="换个话题"){
        $sql = "select * from bot_topic WHERE is_send=1  ORDER BY ctime ASC limit 1";
        $db->query($sql);
        $row = $db->fetchRow();
        if ($row){
            $send_time = date('Y-m-d H:i:s');
            $sql = "update bot_topic set is_send=2,group_name='{$group_name}',send_time='{$send_time}' WHERE id='{$row['id']}'";
            $db->query($sql);
        }
    }else{
        $row =array();
    }
    return $row;
}

//======================================
// 函数: 判断兑换正确
// 参数:
//
// 返回: row           最新信息数组
//======================================
function check_voucher($nickname,$voucher)
{
    $db = new DB_COM();
    $sql = "select * from us_voucher WHERE coupon_code='{$voucher}'";
    $db->query($sql);
    $vou = $db->fetchRow();
    if (!$vou) {
        return 2;
    }else{
        $sql = "select * from us_base WHERE wechat='{$nickname}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            $sql = "update us_voucher set is_effective=2 WHERE id='{$vou['id']}'";
            $db -> query($sql);
            return 1;
        }elseif(strtotime($vou['expiry_date'])<time()){
            $sql = "update us_voucher set is_effective=2 WHERE id='{$vou['id']}'";
            $db -> query($sql);
            return 4;
        }elseif($vou['is_effective']!=1){
            return 3;
        }
    }
}

//======================================
// 函数: 获取金额
// 参数:
//
// 返回: row           最新信息数组
//======================================
function get_voucher_amount($voucher)
{
    $db = new DB_COM();
    $sql = "select * from us_voucher WHERE coupon_code='{$voucher}'";
    $db->query($sql);
    $vou = $db->fetchRow();
    return $vou['amount'];
}

//======================================
// 函数: 兑换
// 参数:
//
// 返回: row           最新信息数组
//======================================
function us_voucher($nickname,$voucher)
{
    //转账
    send_to_us_ccvt($nickname,$voucher,'7','兑换码兑换','voucher');
    return true;
}


//======================================
// 函数: 登录机器人获取机器人所有的群,存入临时表
// 参数:
//
// 返回: row           最新信息数组
//======================================
function temporary_group($group_name,$us_id)
{
    $db = new DB_COM();
    $sql = "select * from bot_temporary_group WHERE us_id='{$us_id}' AND name='{$group_name}'";
    $db->query($sql);
    $row = $db->fetchRow();
    if (!$row){
        $data['name'] = $group_name;
        $data['us_id'] = $us_id;
        $data['intime'] = time();
        $sql = $db->sqlInsert("bot_temporary_group", $data);
        $id = $db->query($sql);
        if (!$id){
            return false;
        }
    }
    return true;
}

//======================================
// 函数: 获取发送短信的手机号
// 参数:
//
// 返回: row           最新信息数组
//======================================
function get_send_phone($us_id)
{
    $db = new DB_COM();
    $sql = "select notice_phone from bot_status WHERE us_id='{$us_id}'";
    $db->query($sql);
    $row = $db->getField($sql,'notice_phone');
    return $row;
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


//======================================
// 函数: 兑换码兑换(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt($nickname,$voucher,$flag,$why,$type)
{
    $db = new DB_COM();

    $sql = "select * from us_base WHERE wechat='{$nickname}'";
    $db->query($sql);
    $row = $db->fetchRow();

    $sql = "select * from us_voucher WHERE coupon_code='{$voucher}'";
    $db->query($sql);
    $vou = $db->fetchRow();

    $pInTrans = $db->StartTrans();  //开启事务

    $us_id = $row['us_id'];
    $money = $vou['amount'];

    $exchange_time = date('Y-m-d H:i:s');

    //修改兑换码表
    $sql = "update us_voucher set is_effective=2,us_id='{$us_id}',exchange_time='{$exchange_time}' WHERE id='{$vou['id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //送币
    $unit = get_la_base_unit();
    $sql = "update us_base set base_amount=base_amount+'{$money}'*'{$unit}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //ba减钱
    $sql = "select * from ba_base ORDER BY ctime asc limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();

    $sql = "update ba_base set base_amount=base_amount-'{$money}'*'{$unit}' WHERE ba_id='{$rows['ba_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    /******************************转账记录表***************************************************/
    //增币记录  赠送者
    $data['hash_id'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $money*$unit;
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-$data['tx_amount'];
    $data['tx_hash'] = hash('md5', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $why;
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $rows['ba_id'];
    $dat['tx_amount'] = $money*$unit;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $why;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());;
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    /***********************资金变动记录表***********************************/
    //us添加基准资产变动记录
    $us_type = 'us_reg_send_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $data['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $money*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id)+$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    //ba添加基准资产变动记录
    $us_type = 'ba_reg_send_balance';
    $com_balance_ba['hash_id'] = hash('md5', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $data['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($rows['ba_id']);
    $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $money*$unit;
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;


}

//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}
//获取ba余额
function get_ba_account($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}

//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_in' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取上传交易hash
//======================================
function get_transfer_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 判断是否被拉入黑名单
//======================================
function check_black($nickname,$group_id){
    $db = new DB_COM();
    $sql = "select * from bot_blacklist WHERE wechat='{$nickname}' AND group_id='{$group_id}' ORDER BY ctime DESC limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row && $row['end_time']>date('Y-m-d H:i:s')){
       return 1;
    }else{
        $start = date('Y-m-d 00:00:00');
        $sql = "select count(bot_message_id) as count from bot_message WHERE bot_nickname='{$nickname}' AND group_id='{$group_id}' AND bot_content LIKE '@AI大白~%' AND bot_send_time>'{$start}'";
        $db->query($sql);
        $count = $db->getField($sql,'count');
        if ($count>5){
            //拉入黑名单
            $data['wechat'] = $nickname;
            $data['group_id'] = $group_id;
            $data['ctime'] = date('Y-m-d H:i:s');
            $data['end_time'] = date('Y-m-d H:i:s',time()+7*24*60*60);
            $sql = $db->sqlInsert("bot_blacklist", $data);
            if (!$db->query($sql)) {
                return false;
            }
            return 1;
        }else{
            return 2;
        }
    }
}
//======================================
// 函数: 获取话题,存入话题表
//======================================
function to_topic_table($data){
    $db = new DB_COM();
    $sql = $db->sqlInsert("bot_topic", $data);
    if (!$db->query($sql)) {
        return false;
    }
    return true;
}

//======================================
// 根据关键词和群id,获取内容
//======================================
function get_answer($ask,$group_id){
    $db = new DB_COM();
    //先查询总后台设置的
    $sql = "select id,answer,send_type from bot_key_words WHERE is_admin=2 AND is_del=0 AND ask like '%{$ask}%' ORDER BY rand() limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if (!$row){
        //查询当前群的问题
        $sql = "select id,answer,send_type from bot_key_words WHERE is_admin=1 AND group_id='{$group_id}' AND is_del=0 AND ask like '%{$ask}%' ORDER BY rand() limit 1 ";
        $db->query($sql);
        $row = $db->fetchRow();
    }
    return $row;
}
//======================================
// 函数: 判断微信昵称是否存在数据库
//======================================
function wechat_is_bind($wechat){
    $db = new DB_COM();
    $sql = "select * from us_base WHERE wechat='{$wechat}'";
    $db->query($sql);
    $row = $db->fetchRow();
    if (!$row) {
        return false;
    }
    return true;
}

//======================================
// 函数: 机器人单聊开关
//======================================
function get_chat_switch($us_id){
    $db = new DB_COM();
    $sql = "select * from bot_status WHERE us_id='{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        $switch = $row['single_chat_switch'];
    }else{
        $switch = 2;
    }
    return $switch;
}


?>
