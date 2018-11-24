<?php
function buildMultiPartRequest($ch, $boundary, $fields, $files) {
$delimiter = '-------------' . $boundary;
$data = '';
foreach ($fields as $name => $content) {
$data .= "--" . $delimiter . "\r\n"
. 'Content-Disposition: form-data; name="' . $name . "\"\r\n\r\n"
. $content . "\r\n";
}
foreach ($files as $name => $content) {
$data .= "--" . $delimiter . "\r\n"
. 'Content-Disposition: form-data; name="' . $name . '"; filename="' . $name . '"' . "\r\n\r\n"
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
]);var_dump($data);die;
return $ch;
}
// and here's how you'd use it
$ch = curl_init('http://agent_service.fnying.com/upload_file/upload.php');
$ch = buildMultiPartRequest($ch, uniqid(),
['key_code' => 'value'], ['file' => $_FILES]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
var_dump(json_decode(curl_exec($ch)));