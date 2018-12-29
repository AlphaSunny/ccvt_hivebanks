<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/29
 * Time: 下午1:46
 */

$key_code = $_REQUEST['key_code'];
$url = "https://agent_service.fnying.com/action/get_common_config.php?key_code=$key_code";
die(file_get_contents($url));