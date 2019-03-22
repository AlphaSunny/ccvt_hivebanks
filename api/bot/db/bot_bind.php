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
function search_timer($group_id)
{
    $db = new DB_COM();
    $sql = "SELECT a.id,a.time,a.content,a.group_id,a.tx_content,a.send_type,a.type,a.is_change_img FROM bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0 AND a.group_id='{$group_id}' ORDER BY a.intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:微信机器人定时任务返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_timer_all()
{
    $db = new DB_COM();
    $sql = "SELECT a.id,a.time,a.content,a.group_id,a.tx_content,a.send_type,a.type,a.is_change_img FROM bot_timer as a LEFT JOIN bot_group as b on a.group_id=b.id WHERE a.is_del=0 AND a.group_id='-1' ORDER BY a.intime asc";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数:修改定时任务里面图片下载完成的定时任务
// 参数: $data
//返回： rows               数据
//======================================
function change_timer($timer_id)
{
    $db = new DB_COM();
    $time = time();
    $sql = "update bot_timer set is_change_img=1,uptime='{$time}' WHERE id='{$timer_id}'";
    $db->query($sql);
    return $db->affectedRows();
}
//======================================
// 函数:微信机器人群组返回接口
// 参数: $data
//返回： rows               数据
//======================================
function search_bot_group()
{
    $db = new DB_COM();
    $sql = "SELECT id,name,ba_id,is_del,is_flirt,us_id,bot_us_id,is_test,is_admin_del,invite_code,send_address,bind_account_notice,is_welcome,welcome,exclusive_switch,ranking_change_switch,news_switch,leave_message_switch FROM bot_group WHERE is_del=1 AND is_audit=2 AND is_admin_del=1 ORDER BY intime asc";
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
                $sql = "select * from bot_group where us_id='{$data['us_id']}'";
                $db->query($sql);
                $groups = $db->fetchRow();
                if ($groups){
                    $sql = "update bot_group set bot_us_id='{$data['us_id']}',uptime='{$time}' WHERE us_id='{$data['us_id']}'";
                    $db->query($sql);
                }
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
        $sql = "select option_value from com_option_config WHERE option_name='python_address'";
        $db->query($sql);
        $row['ip_address'] = $db->getField($sql,'option_value');
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
//function storage_members($data)
//{
//    //插入数据
////    $sql= "insert into bot_group_members (member_id,name,group_id,group_name,intime) values ";
////    foreach (json_decode($data['name']) as $k=>$value){
////        $sql .= "('".get_guid()."','".$value."','".$data['group_id']."','".$data['group_name']."','".time()."'),";
////    }
//
//    $db = new DB_COM();
//    $time = time()-30*60;
//    $sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$data['group_id']}' AND intime<'{$time}'";
//    $db->query($sql);
//    $count = $db->getField($sql,'count');
//    if ($count>0){
//        $sql = "select * from bot_group_members WHERE group_id='{$data['group_id']}' AND name='{$data['name']}' AND intime<'{$time}'";
//        $db->query($sql);
//        $row = $db->fetchRow();
//        if (!$row){
//            //新用户
//            $date['name'] = $data['name'];
//            $date['group_id'] = $data['group_id'];
//            $date['group_name'] = $data['group_name'];
//            $date['ctime'] = date('Y-m-d H:i:s');
//            $date['type'] = 1;
//            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
//            $db->query($sql);
//        }else{
//            $sql = "update bot_group_members set is_check=2 WHERE group_id='{$data['group_id']}' AND name='{$data['name']}' AND intime<'{$time}'";
//            $db->query($sql);
//        }
//    }
//    $sql = $db->sqlInsert("bot_group_members", $data);
//    $q_id = $db->query($sql);
//    if ($q_id == 0)
//        return false;
//    return true;
//}

function storage_members($data)
{
    $db = new DB_COM();

    $members = explode(",", $data['members']);

    $time = time()-10*60;
    $sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$data['group_id']}' AND intime<'{$time}'";
    $db->query($sql);
    $count = $db->getField($sql,'count');
    if ($count>0){
        foreach ($members as $k=>$v){
            $v = str_replace("'"," ",$v);
            $sql = "select * from bot_group_members WHERE group_id='{$data['group_id']}' AND name='{$v}' AND intime<'{$time}'";
            $db->query($sql);
            $row = $db->fetchRow();
            if (!$row){
                //新用户
                $date['name'] = $v;
                $date['group_id'] = $data['group_id'];
                $date['group_name'] = $data['group_name'];
                $date['ctime'] = date('Y-m-d H:i:s');
                $date['type'] = 1;
                $sql = $db->sqlInsert("bot_memeber_change_record",$date);
                $db->query($sql);
            }else{
                $sql = "update bot_group_members set is_check=2 WHERE group_id='{$data['group_id']}' AND name='{$v}' AND intime<'{$time}'";
                $db->query($sql);
            }
        }
    }
    //批量插入
    $sql= "insert into bot_group_members (member_id,name,group_id,group_name,intime) values ";
    foreach ($members as $k=>$value){
        $values = str_replace("'"," ",$value);
        $sql .= "('".get_guid()."','".$values."','".$data['group_id']."','".$data['group_name']."','".time()."'),";
    }
    $sql = substr($sql,0,strlen($sql)-1);
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
    $time = time()-10*60;
    $sql = "select * from bot_group_members WHERE group_id='{$group_id}' AND intime<'{$time}' AND is_check=1";
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        $sql = "insert into bot_memeber_change_record (name,group_id,group_name,ctime,type) values ";
        foreach ($rows as $k=>$v){
            $values = str_replace("'"," ",$v['name']);
            $sql .= "('".$values."','".$v['group_id']."','".$v['group_name']."','".date('Y-m-d H:i:s')."','2'),";
            //修改名称或退出
//            $date['name'] = str_replace("'"," ",$v['name']);
//            $date['group_id'] = $v['group_id'];
//            $date['group_name'] = $v['group_name'];
//            $date['ctime'] = date('Y-m-d H:i:s');
//            $date['type'] = 2;
//            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
//            $db->query($sql);
        }
        $sql = substr($sql,0,strlen($sql)-1);
        $db->query($sql);
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
function check_chat_time($group_id)
{
    $db = new DB_COM();
    $sql = "select chat_time from bot_group WHERE id='{$group_id}'";
    $db->query($sql);
    $time = $db->getField($sql,'chat_time');

    $start = time()-($time*60);
    $end = time();
    $sql = "select count(bot_message_id) as count from bot_message WHERE group_id='{$group_id}' AND bot_create_time BETWEEN '{$start}' AND '{$end}'";
    $db->query($sql);
    $count = $db->getField($sql,'count');
    if (!$count){
        $data['group_id'] = $group_id;
        $data['ctime'] = date('Y-m-d H:i:s');
        $data['utime'] = time();
        $sql = "select utime from bot_news_notice_record WHERE group_id='{$group_id}' ORDER BY ctime DESC limit 1";
        $db->query($sql);
        $last_time = $db->getField($sql,'utime');
        if ($last_time){
            if (($last_time+120)<=(time()-($time*60))){
                $result = 1;
                $sql = $db->sqlInsert("bot_news_notice_record", $data);
                $db->query($sql);
            }else{
                $result = 0;
            }
        }else{
            $sql = $db->sqlInsert("bot_news_notice_record", $data);
            $db->query($sql);
            $result = 1;
        }
    }else{
        $result = 0;
    }
    return $result;
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
                $sql = $db->sqlInsert("bot_notice_records", $data);
                $db->query($sql);
                $status = 3;
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
    $time = date("Y-m-d H:i:s");
    $sql = "select news_id,title,overdue_time from la_news WHERE category=1 AND status=1 ORDER BY rand() limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row['overdue_time']<$time){
        $sql = "select news_id,title from la_news WHERE category=1 AND status=1 AND overdue_time>'{$time}' ORDER BY rand() limit 1";
        $db->query($sql);
        $row = $db->fetchRow();
    }
//    if ($row){
//        $sql = "update la_news set is_hive_been=2 WHERE news_id='{$row['news_id']}'";
//        $db->query($sql);
//    }else{
//        $sql = "select news_id,title from la_news WHERE is_hive_been=1 AND category=2 AND status=1 ORDER BY ctime DESC limit 1";
//        $db->query($sql);
//        $row = $db->fetchRow();
//        if ($row){
//            $sql = "update la_news set is_hive_been=2 WHERE news_id='{$row['news_id']}'";
//            $db->query($sql);
//        }
//    }
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
    $data['hash_id'] = hash('sha256', $rows['ba_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
    $data['prvs_hash'] = $prvs_hash === 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = $rows['ba_id'];
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = -($money*$unit);
    $data['credit_balance'] = get_ba_account($rows['ba_id'])-($money*$unit);
    $data['tx_hash'] = hash('sha256', $rows['ba_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $data['flag'] = $flag;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = $why;
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $data['tx_count'] = transfer_get_pre_count($rows['ba_id']);
    $sql = $db->sqlInsert("com_transfer_request", $data);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('sha256', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = $rows['ba_id'];
    $dat['tx_amount'] = $money*$unit;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('sha256', $us_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $why;
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());;
    $dat['tx_count'] = transfer_get_pre_count($us_id);
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
    $tx_id = hash('sha256', $us_id . $rows['ba_id'] . get_ip() . time() . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($us_id);
    $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $us_id;
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $money*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id)+$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us['tx_count'] = base_get_pre_count($us_id);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    //ba添加基准资产变动记录
    $us_type = 'ba_reg_send_balance';
    $com_balance_ba['hash_id'] = hash('sha256', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($rows['ba_id']);
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $us_id;
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = -($money*$unit);
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-($money*$unit);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba['tx_count'] = base_get_pre_count($rows['ba_id']);

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
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  tx_count DESC LIMIT 1";
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
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
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
        $sql = "select key_words_switch from bot_group WHERE id='{$group_id}'";
        $db->query($sql);
        $key_words_switch = $db->getField($sql,'key_words_switch');
        if ($key_words_switch==1){
            $sql = "select id,answer,send_type from bot_key_words WHERE is_admin=1 AND group_id='{$group_id}' AND is_del=0 AND ask like '%{$ask}%' AND switch=1 ORDER BY rand() limit 1 ";
            $db->query($sql);
            $row = $db->fetchRow();
        }
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
    return $row;
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
//======================================
// 函数: 获取要审核的群
//======================================
function get_group_list($us_id){
    $db = new DB_COM();
    $sql = "select id,name,is_audit from bot_group WHERE us_id='{$us_id}' AND is_audit=1";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

//======================================
// 函数: 审核
//======================================
function audit_group($group_id,$count){
    $db = new DB_COM();
    if($count>=100){
        $time = time();
        $sql = "update bot_group set is_audit = 2, why='',uptime='{$time}' where id='{$group_id}' ";
        $db->query($sql);
//        return $db->affectedRows();
    }
    return true;
}

//======================================
// 函数: 获取专属注册微信昵称code
//======================================
function get_exclusive_code($wechat){
    $db = new DB_COM();
    $sql = "select * from bot_exclusive_code WHERE wechat='{$wechat}'";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        $code = $row['code'];
    }else{
        $date['wechat'] = $wechat;
        $date['ctime'] = date('Y-m-d H:i:s');
        $sql = "select code from bot_exclusive_code ORDER BY ctime desc limit 1";
        $db->query($sql);
        $last_code = $db->getField($sql,'code');
        $code = $last_code ? $last_code+1 : "10000";
        $date['code'] = $code;
        $sql = $db->sqlInsert("bot_exclusive_code", $date);
        $db->query($sql);
    }
    return $code;
}

//======================================
// 函数: 判断点赞人和被点赞人是否有账号
//======================================
function check_wcheck_wechat($give_wechat,$recive_wechat,$num,$status,$group_id){
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $data = array();
    $sql = "select * from us_base WHERE wechat='{$give_wechat}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    $data['give_status'] = $row ? 1 : 2;
    $data['us_id'] = $row['us_id'];
    //判断是否打开开关  1:开  2:关
    if ($row){
        $sql = "select bind_info from us_bind WHERE bind_name='point_tread_switch' AND us_id='{$row['us_id']}'";
        $db->query($sql);
        $switch = $db->fetchRow();
        $switch_status = $switch ? $switch['bind_info'] : 2;
    }else{
        $switch_status = 2;
    }
    $data['switch_status'] = $switch_status;
    //判断设置金额
    if ($row){
        $sql = "select bind_info from us_bind WHERE bind_name='point_tread_num' AND us_id='{$row['us_id']}'";
        $db->query($sql);
        $point_tread_num = $db->fetchRow();
        $point_tread_num_status = $point_tread_num['bind_info'] >= $num ? 1 : 2;
    }else{
        $point_tread_num_status = 2;
    }
    $data['point_tread_num_status'] = $point_tread_num_status;
    //判断这个微信绑定的群
    if ($row){
        $sql = "select bind_info from us_bind WHERE bind_name='group' AND us_id='{$row['us_id']}'";
        $db->query($sql);
        $user_group_id =$db->getField($sql,'bind_info');
        $group_judge = $user_group_id != $group_id ? 2 : 1;
    }else{
        $group_judge = 2;
    }
    $data['group_judge'] = $group_judge;
    //判断余额
    $data['if_balance'] = $row['base_amount']/$unit >= $num ? 1 : 2;

    //判断不能大于余额的1|100
    $data['proportion'] = ($row['base_amount']/$unit)*0.01 > $num ? 1 : 2;

    //判断是否达到上限
    $state = $status == "赞" ? 1 : 2;
    if ($state==1){
        $max = get_praise_pointon_maxnum()['max_give_like'];
    }elseif ($state==2){
        $max = get_praise_pointon_maxnum()['max_give_no_like'];
    }
    $start = strtotime(date('Y-m-d 00:00:00'));
    $end  = strtotime(date('Y-m-d 23:59:59'));
    $sql = "SELECT sum(tx_amount)/'{$unit}' as give_all FROM us_glory_integral_change_log WHERE credit_id='{$row['us_id']}' AND state='{$state}' AND ctime BETWEEN '{$start}' AND '{$end}'";
    $db -> query($sql);
    $give_all= $db -> getField($sql,'give_all');
    if ($give_all == $max || ($num+$give_all) > $max){
        $is_ceiling = 2;
    }else{
        $is_ceiling = 1;
    }
    $data['is_ceiling'] = $is_ceiling;

    $sql = "select * from us_base WHERE wechat='{$recive_wechat}'";
    $db->query($sql);
    $row = $db->fetchRow();
    $data['recive_status'] = $row ? 1 : 2;
    $data['give_us_id'] = $row['us_id'];

    return $data;
}

//======================================
// 函数: 获取积分排名变化的用户通知列表
//======================================
function get_rank_change_record($group_id){
    $db = new DB_COM();
    $time = date('Y-m-d H:i:s',(time()-600));
    $sql = "select id,first_rand,after_rand,wechat from bot_ranking_change_record WHERE group_id='{$group_id}' AND is_send=1 AND ctime>'{$time}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        $utime = time();
        foreach ($rows as $k=>$v){
            $sql = "update bot_ranking_change_record set is_send = 2,utime='{$utime}' where id='{$v['id']}' ";
            $db->query($sql);
        }
    }
    return $rows;
}


//======================================
// 函数: 获取积分排名
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function get_ranking($give_us_id,$give_num){
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "select base_amount/'$unit' as base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
    $db->query($sql);
    $num_first = $db->getField($sql,'base_amount');
    $num_first = $num_first ? $num_first : "0";
//    if ($num_first!=''){
    $result = array();
    $num = $num_first+$give_num;
    $sql = "select base_amount/'$unit' as base_amount from us_asset WHERE base_amount>=0 ORDER by base_amount DESC ";
    $db->query($sql);
    $rows = $db->fetchAll();
    if ($rows){
        $base_amount_list = array_map(function($val){return $val['base_amount'];}, $rows);
    }
    $now_rand = '';
    foreach ($base_amount_list as $k=>$v){
        if ($num_first==$v){
            $now_rand = $k;
            break;
        }
    }
    $result['now_rand'] = $now_rand;
    $afert_rand = '';
    if ($now_rand){
        $afert_rand = for_key($now_rand,$num,$base_amount_list);
    }
    $result['afert_rand'] = $afert_rand;
//    }
    return $result;
}
function for_key($key,$v,$arr){
    $res = '';
    $lenth = $key  ;
    for ($i = $lenth; $i >= 0  ;$i--)
    {
        if($v<$arr[$i]) {
            $res = $i + 1;
            break;
        }
    }
    return $res ;
}
//======================================
// 函数: 点赞点踩
// 参数:
//
// 返回: row           最新信息数组
//======================================
function give_like_us($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $unit = get_la_base_unit();

    //积分变动记录表
    $d['hash_id'] = hash('md5', $data['us_id'] . 'give_like_us' . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $d['credit_id'] = $data['us_id'];
    $d['debit_id'] = $data['give_us_id'];
    $d['tx_amount'] = $data['give_num']*$unit;
    $d['ctime'] = time();
    $d['utime'] = date('Y-m-d H:i:s');
    $d['state'] = $data['state'];
    $d['tx_detail'] = $data['state'] ==1 ? "点赞" : "点踩";
    $d['entrance'] = 2;
    $sql = $db->sqlInsert("us_glory_integral_change_log", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //用户减钱

    $sql = "update us_base set base_amount=base_amount-'{$data['give_num']}'*'{$unit}' WHERE us_id='{$data['us_id']}'";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //la加钱
    $sql = "update la_base set base_amount=base_amount+'{$data['give_num']}'*'{$unit}' limit 1";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //判断积分排名是否变化
    if ($data['state']==1){
        $ranking = get_ranking($data['give_us_id'],$data['give_num']);
        if ($ranking['now_rand']!=$ranking['afert_rand']){
            $sql = "select b.wechat,bi.bind_info from us_base as b INNER JOIN us_bind as bi on b.us_id=bi.us_id WHERE b.us_id='{$data['give_us_id']}' AND bi.bind_name='group'";
            $db->query($sql);
            $rank = $db->fetchRow();
            if ($rank){
                $change_record['wechat'] = $rank['wechat'];
                $change_record['first_rand'] = $ranking['now_rand']+1;
                $change_record['after_rand'] = $ranking['afert_rand']+1;
                $change_record['group_id'] = $rank['bind_info'];
                $change_record['ctime'] = date('Y-m-d H:i:s');
                $change_record['utime'] = time();
                $sql = $db->sqlInsert("bot_ranking_change_record", $change_record);
                $id = $db->query($sql);
                if (!$id){
                    $db->Rollback($pInTrans);
                    return 0;
                }
            }
        }
    }

    //增加荣耀积分(减少荣耀积分)
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set";
        if ($data['state']==1){
            $sql .= " base_amount=base_amount+'{$data['give_num']}'*'{$unit}'";
        }elseif ($data['state']==2){
            $sql .= " base_amount=base_amount-'{$data['give_num']}'*'{$unit}'";
        }
        $sql .= " WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return 0;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$data['give_us_id']}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $data['give_us_id'];
        $asset['us_nm'] = $us_base['us_nm'];
        $asset['us_account'] = $us_base['us_account'];
        $asset['base_amount'] = $data['give_num']*$unit;
        $asset['lock_amount'] = 0;
        $asset['utime'] = time();
        $asset['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_asset", $asset);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return 0;
        }
    }


    /******************************转账记录表***************************************************/
    $la_id = get_la_id();
    //赠送者
    $flag = $data['state'] == 1 ? 5 : 6;
    $transfer['hash_id'] = hash('sha256', $data['us_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($data['us_id']);
    $transfer['prvs_hash'] = $prvs_hash === 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $data['us_id'];
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = -($data['give_num']*$unit);
    $transfer['credit_balance'] = get_us_account($transfer['credit_id'])-($data['give_num']*$unit);
    $transfer['tx_hash'] = hash('sha256', $data['us_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $transfer['tx_count'] = transfer_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //接收者(la)
    $dat['hash_id'] = hash('sha256', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $la_id;
    $dat['debit_id'] = $data['us_id'];
    $dat['tx_amount'] = $data['give_num']*$unit;
    $dat['credit_balance'] = get_la_base_amount($la_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('sha256', $la_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-la';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s');
    $dat['tx_count'] = transfer_get_pre_count($la_id);
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $ctime = date('Y-m-d H:i:s');
    $tx_id = hash('sha256', $data['us_id'] . $la_id . get_ip() . time() . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash===0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $la_id;
    $com_balance_us["tx_type"] = 'give_like';
    $com_balance_us["tx_amount"] = -($data['give_num']*$unit);
    $com_balance_us["credit_balance"] = get_us_account($data['us_id'])-($data['give_num']*$unit);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');
    $com_balance_us['tx_count'] = base_get_pre_count($data['us_id']);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }

    //la添加基准资产变动记录
    $us_type = 'la_get_balance';
    $com_balance_ba['hash_id'] = hash('sha256', $la_id. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($la_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? $com_balance_ba['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $data['us_id'];
    $com_balance_ba["tx_type"] = 'give_like';
    $com_balance_ba["tx_amount"] = $data['give_num']*$unit;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id)+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba['tx_count'] = base_get_pre_count($la_id);

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }

    $db->Commit($pInTrans);
    return true;
}
//======================================
// 函数: 获取上传交易hash
//======================================
function get_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}


//获取la id
function get_la_id(){
    $db = new DB_COM();
    $sql = "select id from la_base limit 1";
    $db->query($sql);
    $id = $db->getField($sql,'id');
    return $id;
}

//获取la余额
function get_la_base_amount($la_id){
    $db = new DB_COM();
    $sql = "select base_amount from la_base WHERE id='{$la_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}



//获取us可用余额
function get_us_base_true_amount($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
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

//======================================
// 函数: 用户升级所需积分
//======================================
function user_to_upgrade($nickname){
    $db = new DB_COM();
    $sql = "select * from us_base WHERE wechat='{$nickname}'";
    $db->query($sql);
    $user = $db->fetchRow();
    if($user){
        $row['ruselt'] = 2;
        $row['us_scale'] = $user['scale'];
        $sql = "select base_amount/(select unit from la_base where 1) as base_amount from us_asset WHERE asset_id='GLOP' AND us_id='{$user['us_id']}'";
        $db->query($sql);
        $us_integral = $db->getField($sql,'base_amount');
        $row['us_integral'] = $us_integral;
        //查询下一级的积分
        $sql = "select integral from us_scale WHERE scale='{$user['scale']}'+1";
        $db->query($sql);
        $next_integral = $db->getField($sql,'integral');
        $row['next_integral'] = $next_integral;
    }else{
        $row['ruselt'] = 1;
    }
    return $row;
}
//======================================
// 函数: 群升级所需条件
//======================================
function group_to_upgrade($group_id){
    $db = new DB_COM();
    $sql = "select id,name,scale,(select count(*) from us_bind where bind_name='group' and bind_info=gr.id) as bind_count from bot_group as gr WHERE gr.id='{$group_id}'";
    $db->query($sql);
    $group = $db->fetchRow();
    if ($group){
        $sql = "select after_scale from bot_group_scale_changes WHERE group_id='{$group_id}' order by ctime desc limit 1";
        $db->query($sql);
        $real_scale = $db->fetchRow();
        $this_scale = $real_scale ? $real_scale['after_scale'] : 1;
        $row['ruselt'] = 2;
        $row['real_scale'] = $this_scale;
        $row['scale'] = $group['scale'];
        //获取当前群所有的星数
        $row['all_glory_number'] = glory_number($group_id);
        $row['bind_count'] = $group['bind_count'];
        $row['next_glory_number'] = get_next_group_level($this_scale)['glory_number'];
        $row['next_bind_count'] = get_next_group_level($this_scale)['bind_number'];
    }else{
        $row['ruselt'] = 1;
    }
    return $row;
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

//======================================
// 函数: 查询当日有没有聊天
//======================================
function search_chat($group_name){
    $db = new DB_COM();
    $sql = "select bot_message_id from bot_message where group_name='{$group_name}' and (to_days(bot_send_time) = to_days(now()))";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}

//======================================
// 函数: 查询昨日有没有奖励
//======================================
function search_statistical($group_name){
    $db = new DB_COM();
    $sql = "SELECT * FROM bot_Iss_records WHERE group_name='{$group_name}' and (TO_DAYS(NOW())-TO_DAYS(send_time)) = 1";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}

//======================================
// 函数: 检查群聊是否一段时间内如果没人聊天,删除群
//======================================
function check_chat_to_group(){
    $db = new DB_COM();
    $sql = "select * from bot_group WHERE is_del=1 AND is_admin_del=1";
    $db->query($sql);
    $list = $db->fetchAll();
    if ($list){
        foreach ($list as $k=>$v){
            $beginTime = strtotime('-3 day', time());
            $endTime = time();
            $sql = "select count(bot_message_id) as count from bot_message WHERE group_id='{$v['id']}' AND bot_create_time BETWEEN '{$beginTime}' AND '{$endTime}'";
            $db->query($sql);
            $count = $db->getField($sql,'count');
            if ($count==0){
                $sql = "update bot_group set is_del=2,uptime='{$endTime}' WHERE id='{$v['id']}'";
                $db->query($sql);
            }
        }
    }
}

//======================================
// 函数: 获取前十的留言
//======================================
function get_leave_message(){
    $db = new DB_COM();
    $sql = "SELECT b.wechat,b.scale,b.us_id FROM us_asset as a LEFT JOIN us_base as b on a.us_id=b.us_id LEFT JOIN us_bind as bind ON b.us_id=bind.us_id WHERE a.asset_id = 'GLOP' AND a.base_amount>=0 and bind.bind_name='group' order by a.base_amount desc limit 0 , 10";
    $db->query($sql);
    $list = $db->fetchAll();
    if ($list){
        foreach ($list as $k=>$v){
            $sql = "select bind_info from us_bind WHERE bind_type='text' AND bind_name='leave_message' AND us_id='{$v['us_id']}'";
            $db->query($sql);
            $list[$k]['leave_message'] = $db->getField($sql,'bind_info');
        }
    }
    return $list;
}
//======================================
// 函数:  随机奖励
//======================================
function random_reward($group_id){
    $db = new DB_COM();
    $h = date("H");
    //判断是时间
    if ($h>9 && $h<22){
        //判断群前一个小时是否有随机奖励过
        $random_start_time = time()-(40*60);
        $time = time();
        $sql = "select * from bot_random_reward WHERE group_id='{$group_id}' AND utime BETWEEN '{$random_start_time}' AND '{$time}'";
        $db->query($sql);
        if ($db->fetchRow()){
            //前一个小时已经随机奖励过
            $row['result'] = 1;
        }else{
            //判断群前一个小时聊天
            $bot_start_time = time()-(60*60);
//            $sql = "select wechat from bot_message WHERE group_id='{$group_id}' and bot_create_time BETWEEN '{$bot_start_time}' AND '{$time}' and wechat in (select wechat from us_base where 1) group by wechat";
            $sql ="select a.wechat from bot_message as a left join us_base as b on a.wechat=b.wechat WHERE group_id='{$group_id}' and a.wechat!='AI大白' AND bot_create_time BETWEEN '{$bot_start_time}' AND '{$time}'  and a.wechat in (select wechat from us_base where 1) and b.us_id in (select us_id from us_bind where bind_name='group' and bind_info='{$group_id}') group by a.wechat,b.us_id";
            $db->query($sql);
            $array = $db->fetchAll();
            $wechat_array = array_map(function($val){return $val['wechat'];}, $array);
            if (count($wechat_array)>0){
                $rand_num = array_rand($wechat_array,1);
                //获取金额随机数奖励数额：最小值=领域等级  最大值= 领域等级*10
                $sql = "select scale from bot_group WHERE id='{$group_id}'";
                $db->query($sql);
                $group_scale = $db->getField($sql,'scale');
                $rand_reward_num = rand($group_scale,($group_scale*10));
                //获取用id
                $sql = "select us_id from us_base WHERE wechat='{$wechat_array[$rand_num]}'";
                $db->query($sql);
                $us_id = $db->getField($sql,'us_id');

                $data['give_num'] = $rand_reward_num;
                $data['us_id'] = $us_id;
                $data['group_id'] = $group_id;
                $data['group_scale'] = $group_scale;
                $data['num'] = count($wechat_array);
                $result = to_random_reward($data);
                if($result){
                    $row['result'] = 2;
                    $row['wechat'] =$wechat_array[$rand_num];
                    $row['money'] = $rand_reward_num;
                }else{
                    $row['result'] = 3;
                }
            }else{
                $row['result'] = 4;
            }
        }
    }else{
        $row['result'] = 5;
    }
    return $row;
}
//======================================
// 函数: 随机奖励
// 参数:
//======================================
function to_random_reward($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    //送币
    $unit = get_la_base_unit();
    $sql = "update us_base set base_amount=base_amount+'{$data['give_num']}'*'{$unit}' WHERE us_id='{$data['us_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //ba减钱
    $sql = "select * from ba_base ORDER BY ctime asc limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $sql = "update ba_base set base_amount=base_amount-'{$data['give_num']}'*'{$unit}' WHERE ba_id='{$rows['ba_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }

    //记录表
    $d['group_id'] = $data['group_id'];
    $d['group_scale'] = $data['group_scale'];
    $d['us_id'] = $data['us_id'];
    $d['base_amount'] = $data['give_num']*$unit;
    $d['num'] = $data['num'];
    $d['ctime'] = date('Y-m-d H:i:s');
    $d['utime'] = time();
    $sql = $db->sqlInsert("bot_random_reward", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    /******************************转账记录表***************************************************/
    //增币记录   赠送者
    $da['hash_id'] = hash('sha256', $rows['ba_id'] . 17 . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($rows['ba_id']);
    $da['prvs_hash'] = $prvs_hash === 0 ? hash('sha256',$rows['ba_id']) : $prvs_hash;
    $da['credit_id'] = $rows['ba_id'];
    $da['debit_id'] = $data['us_id'];
    $da['tx_amount'] = -($data['give_num']*$unit);
    $da['credit_balance'] = get_ba_account($rows['ba_id'])-($data['give_num']*$unit);
    $da['tx_hash'] = hash('sha256', $rows['ba_id'] . 17 . get_ip() . time() . date('Y-m-d H:i:s'));
    $da['flag'] = 17;
    $da['transfer_type'] = 'ba-us';
    $da['transfer_state'] = 1;
    $da['tx_detail'] = "群聊随机奖励";
    $da['give_or_receive'] = 1;
    $da['ctime'] = time();
    $da['utime'] = date('Y-m-d H:i:s',time());
    $da["tx_count"] = transfer_get_pre_count($rows['ba_id']);
    $sql = $db->sqlInsert("com_transfer_request", $da);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    //接收者
    $dat['hash_id'] = hash('sha256', $data['us_id'] . 17 . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($data['us_id']);
    $dat['prvs_hash'] = $prvs_hash === 0 ? hash('sha256',$data['us_id']) : $prvs_hash;
    $dat['credit_id'] = $data['us_id'];
    $dat['debit_id'] = $rows['ba_id'];
    $dat['tx_amount'] = $data['give_num']*$unit;
    $dat['credit_balance'] = get_us_account($data['us_id'])+$dat['tx_amount'];
    $dat['tx_hash'] = hash('sha256', $data['us_id'] . 17 . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = 17;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = "群聊随机奖励";
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());;
    $dat["tx_count"] = transfer_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return false;
    }

    /***********************资金变动记录表***********************************/
    //us添加基准资产变动记录
    $us_type = 'us_random_reward_balance';
    $ctime = date('Y-m-d H:i:s');
    $tx_id = hash('sha256', $data['us_id'] . $rows['ba_id'] . get_ip() . time() . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$data['us_id']) : $prvs_hash;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = "random_reward";
    $com_balance_us["tx_amount"] = $data['give_num']*$unit;
    $com_balance_us["credit_balance"] = get_us_account($data['us_id'])+$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us["tx_count"] = base_get_pre_count($data['us_id']);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    //ba添加基准资产变动记录
    $us_type = 'ba_random_reward_balance';
    $com_balance_ba['hash_id'] = hash('sha256', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($rows['ba_id']);
    $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$rows['ba_id']) : $prvs_hash;
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $data['us_id'];
    $com_balance_ba["tx_type"] = "random_reward";
    $com_balance_ba["tx_amount"] = -($data['give_num']*$unit);
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id'])-($data['give_num']*$unit);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($rows['ba_id']);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);
    return true;
}
?>
