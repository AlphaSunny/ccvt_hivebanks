<?php
//$redis = new Redis();
//
//$redis->connect('18.219.17.238', 6379); //连接Redis
//$redis->auth('Windwin2018'); //密码验证
//$redis->select(0);//选择数据库2
//$redis->set( "testKey" , "Hello Redis"); //设置测试key
//echo $redis->get("testKey");//输出value

ini_set('default_socket_timeout', -1);
$ip = "18.219.17.238";
$port = '6379';
$redis = new Redis();

$redis->pconnect($ip, $port, 1);
$key = "test";
$value = "this is test";

$redis->set($key, $value);
$d = $redis->get($key);
var_dump($d);
?>
