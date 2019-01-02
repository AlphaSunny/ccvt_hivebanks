<?php
require_once '../inc/common.php';
php_begin();

$args = array("content");
chk_empty_args('POST', $args);
$data = array();

$content  = get_arg_str('POST', 'content', 999999999);
print_r($content);




?>
