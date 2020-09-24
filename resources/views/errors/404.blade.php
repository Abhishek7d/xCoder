@php
    header('Content-Type:application/json');
    echo json_encode(array('status'=>0, 'message'=>"route not found", 'data'=>null));
@endphp