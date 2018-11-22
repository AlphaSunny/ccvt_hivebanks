<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/22
 * Time: 下午2:38
 */

$url = $_REQUEST['url'] ;
$uuid = $_REQUEST['uuid'];
$referrer = $_REQUEST['referrer'];

file_get_contents('http://www.fnying.com/php/cnt_action.php?referrer='.$referrer.'&url='.$url.'&uuid='.$uuid);

