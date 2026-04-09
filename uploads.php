<?php
$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$targetFile = $targetDir . time() . "_" . basename($_FILES["image"]["name"]);

if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
    echo json_encode(["status" => "success", "path" => $targetFile]);
} else {
    echo json_encode(["status" => "error"]);
}
?>