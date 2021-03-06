<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:33
 */

/**
 * @param $data
 * @return bool
 * la后台增加新闻
 */
function news_add($data){

    $data['ctime'] = date('Y-m-d H:i:s',time());
    $data['utime'] = date('Y-m-d H:i:s',time());
    $db = new DB_COM();
    $sql = $db->sqlInsert('la_news', $data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

/**
 * @param $data
 * @return int
 * la后台更新新闻
 */
function news_edit($data){

    $title = $data['title'];
    $content = $data['content'];
    $author = $data['author'];
    $news_id = $data['news_id'];

    $utime = date('Y-m-d H:i:s',time());
    $db = new DB_COM();
    $sql = "UPDATE la_news SET utime = '{$utime}',title = '{$title}', content = '{$content}',author = '{$author}',overdue_time='{$data['overdue_time']}'  where news_id = '{$news_id}' ";
    $db->query($sql);
    $count = $db->affectedRows();
    return  $count;
}

/**
 * @param $data
 * @return int
 * la后台删除新闻
 */
function news_delete($news_id){


    $utime = date('Y-m-d H:i:s',time());
    $db = new DB_COM();
    $sql = "UPDATE la_news SET utime = '{$utime}',status=0 where news_id = '{$news_id}' ";
    $db->query($sql);
    $count = $db->affectedRows();
    return  $count;

}

/**
 * @param $data
 * @return int
 * la后台新闻过期
 */
function news_overdue($news_id,$overdue){


    $utime = date('Y-m-d H:i:s',time());
    $db = new DB_COM();
    $sql = "UPDATE la_news SET utime = '{$utime}',is_overdue='{$overdue}' where news_id = '{$news_id}' ";
    $db->query($sql);
    $count = $db->affectedRows();
    return  $count;

}

//======================================
// 函数: la后台新闻列表总数
// 参数:
// 返回: count        记录总数
//======================================
function  news_list_total()
{
    $db = new DB_COM();
    $sql = "select news_id from la_news where status = 1";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}

/**
 * @return array
 * la后台新闻列表@todo 分页
 */
function news_list($offset,$limit){
    $db = new DB_COM();
    $sql = "select title,author,utime,ctime,news_id,overdue_time from la_news where status = 1 order by ctime desc  limit $offset , $limit ";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

/**
 * @param $news_id
 * @return array
 * la后台新闻详情
 */
function news_detail($news_id){
    $db = new DB_COM();
    $sql = "select * from la_news where status = 1 and  news_id = '{$news_id}' ";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}