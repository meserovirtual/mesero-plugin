<?php
require_once "../../../includes/utils.php";
$folder = $_SERVER['DOCUMENT_ROOT'];


global $image_path;


if (isset($_FILES["folder"])) {
    $output_dir = $image_path . $_FILES["folder"];
} else {
    $output_dir = $image_path;
}

if (isset($_FILES["images"])) {
    $ret = array();
    global $compression_level;

    $error = $_FILES["images"]["error"];
    //You need to handle  both cases
    //If Any browser does not support serializing of multiple files using FormData()
    if (!is_array($_FILES["images"]["name"])) //single file
    {
        $fileName = $_FILES["images"]["name"];
        move_uploaded_file($_FILES["images"]["tmp_name"], $output_dir . $fileName);
        $ret[] = $fileName;

        $partes = explode('.', $_FILES["images"]["name"]);
        $ext = $partes[count($partes) - 1];

        $comp_name = str_replace("." . $ext, "_thumb." . $ext, $_FILES["images"]["name"]);

        compressImage($image_path . $_FILES["images"]["name"], $image_path . $comp_name, $compression_level);
    } else  //Multiple files, file[]
    {
        $fileCount = count($_FILES["images"]["name"]);
        for ($i = 0; $i < $fileCount; $i++) {
            $fileName = $_FILES["images"]["name"][$i];
            move_uploaded_file($_FILES["images"]["tmp_name"][$i], $output_dir . $fileName);
            $ret[] = $fileName;
        }

    }
    echo json_encode($ret);
}


function compressImage($source_url, $destination_url, $quality)
{
    $info = getimagesize($source_url);

    if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($source_url);
    elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($source_url);
    elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($source_url);

    //save file
    imagejpeg($image, $destination_url, $quality);

    //return destination file
    return $destination_url;
}