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
]);
return $ch;
}
// and here's how you'd use it
$ch = curl_init('http://httpbin.org/post');
$ch = buildMultiPartRequest($ch, uniqid(),
['key_code' => 'value'], ['file' => $_FILES['flie']['tmp_name']]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);