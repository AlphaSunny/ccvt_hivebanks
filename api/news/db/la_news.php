<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/11
 * Time: 上午9:54
 */


/**
 * @return array
 * 新闻列表@todo 分页
 */
function news_list(){
    $db = new DB_COM();
    $sql = "select title,author,utime,ctime,news_id from la_news where status = 1 order by ctime desc";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

/**
 * @param $news_id
 * @return array
 * 新闻详情
 */
function news_detail($news_id){
    $db = new DB_COM();
    $sql = "select * from la_news where status = 1 and  news_id = '{$news_id}' ";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}


/**
 * @param $data
 * @return bool
 * 爬虫爬取新闻添加(别人调)
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
 * @return bool
 * 文章分类
 */
function category_list(){
    $db = new DB_COM();
    $sql = "select category from la_news WHERE status=1 GROUP BY category";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
/**
 * @param $data
 * @return bool
 * 文章列表
 */
function get_news_list($category){
    $db = new DB_COM();
    $sql = "select title,author,utime,ctime,news_id from la_news WHERE category='$category' AND status = 1 order by ctime desc";
    $db->query($sql);
    $rows= $db->fetchAll();
    return $rows;
}