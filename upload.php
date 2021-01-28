<?php
define('UPLOAD_DIR', 'uploads/');
$encodedData = file_get_contents('php://input');
 $decodedData = json_decode($encodedData,true);
 $url=$decodedData['img'];
    $image_parts = explode(";base64,", $decodedData['img']);
    $image_type_aux = explode("image/", $image_parts[0]);
    $image_type = $image_type_aux[1];
    $image_base64 = base64_decode($image_parts[1]);
    $file = UPLOAD_DIR . uniqid() . '.png';
    
    if (file_put_contents($file, $image_base64)) {
      echo json_encode(1);
    }
?>