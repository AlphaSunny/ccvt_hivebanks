<?php
require_once '../inc/common.php';
php_begin();

$args = array("content");
chk_empty_args('POST', $args);
$data = array();

$content  = $_POST['content'];

print_r(json_decode($content,true));





?>
