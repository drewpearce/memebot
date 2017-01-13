<?php

$api = $platform['api'];
$post = $api->post;
$delete = $api->delete;
$storageService = ''; //input the name of your storage service
$tempStorageFilePath = '';
$tempStorageBaseURL = '';
$tempStorageService = '';
$tempStorageFolder = '';

if ( $event['request']['parameters']['url'] && $event['request']['parameters']['filename'] ) {
    $destPath = $tempStorageFilePath . '/' . $tempStorageFolder . '/' . $event['request']['parameters']['filename'];
    $fileCopy = copy( $event['request']['parameters']['url'], $destPath );

    if ( $fileCopy === true ) {
        if ( strpos( $event['request']['parameters']['filename'], '/' ) ) {
            $filePath = explode( '/', $event['request']['parameters']['filename'] );
            for ( $x = 0; $x < ( count( $filePath ) - 1 ); $x++ ) {
                $storageService .= '/' . $filePath[$x];
            }
        }
        $filePost = $post( $storageService . '/?url=' . $tempStorageBaseURL . '/' . $tempStorageService . '/' . $tempStorageFolder . '/' . $event['request']['parameters']['filename'], null );
        $fileDelete = $delete( $tempStorageService . '/' . $tempStorageFolder . '/' . $event['request']['parameters']['filename'] );

        if ( $filePost['status_code'] == 201 ) {
            $result['success'] = true;
            $result['copy'] = $fileCopy;
            $result['post'] = $filePost;
            $result['delete'] = $fileDelete;
        } else {
            $result['success'] = false;
            $result['message'] = 'The file was not successfully uploaded to the service ' . $storageService;
        }
    } else {
        $result['success'] = false;
        $result['message'] = 'The file was not successfully copied from the remote URL -- ' . $event['request']['parameters']['url'];
    }
} else {
    $result['success'] = false;
    $result['message'] = 'Malformed request. Required parameters not included (url, filename.)';
}

return $result;

?>
