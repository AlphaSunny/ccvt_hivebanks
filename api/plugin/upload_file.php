<?php
$key_code = $_REQUEST['key_code'];
function buildMultiPartRequest($ch, $boundary, $fields, $files) {
$delimiter = '-------------' . $boundary;
$data = '';
foreach ($fields as $name => $content) {
$data .= "--" . $delimiter . "\r\n"
. 'Content-Disposition: form-data; name="' . $name . "\"\r\n\r\n"
. $content . "\r\n";
}
foreach ($files as $name => $content) {
    $content = file_get_contents($content);
//    var_dump($content);

$data .= "--" . $delimiter . "\r\n"
. 'Content-Disposition: form-data; name="' . $name . '"; filename="' . 'sss.jpg' . '"' . "\r\n\r\n"
. $content . "\r\n";
}
$data .= "--" . $delimiter . "--\r\n";
curl_setopt_array($ch, [
CURLOPT_POST => true,
CURLOPT_HTTPHEADER => [
'Content-Type: multipart/form-data; boundary=' . $delimiter,
'Content-Length: ' . strlen($data)
],
CURLOPT_POSTFIELDS => $data
]);
//var_dump($files);
//var_dump($data);die;
return $ch;
}

// and here's how you'd use it
$ch = curl_init('http://agent_service.fnying.com/upload_file/upload.php');
$ch = buildMultiPartRequest($ch, uniqid(),
['key_code' => $key_code], ['file' => $_FILES['file']['tmp_name']]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
die(curl_exec($ch));