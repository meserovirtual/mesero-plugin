<?php
session_start();
/*
if (file_exists('../../../includes/MyDBi.php')) {
    require_once '../../../includes/MyDBi.php';
    //require_once '../../../includes/utils.php';
} else {
    require_once 'MyDBi.php';
}
*/

$data = file_get_contents("php://input");

$decoded = json_decode($data);
if ($decoded != null) {
    if ($decoded->function == 'create') {
        create($decoded->data);
    }
} else {
    /*
    $function = $_GET["function"];
    if ($function == 'getNoticias') {
        getNoticias();
    }
    */
}


function create($data){

    $decoded = json_decode($data);
    $asiento_id = $decoded->asiento_id;
    $usuario_id = $decoded->usuario_id;
    $mail = $decoded->mail;

    $despues = "";
    $detalles = "";

    foreach($decoded->despues as $item){
        $despues .= "DESPUES: stock_id: " . $item->stock_id . " - cant_actual: " . $item->cant_actual . "\n";
    }

    foreach($decoded->detalles as $item){
        $detalles .= "DETALLES: cantidad: " . $item->cantidad . " - iva: " . $item->iva .
            " - precio_total: " . $item->precio_total . " - producto_id: " . $item->producto_id .
            " - producto_nombre: " . $item->producto_nombre . " - productos_tipo: " . $item->productos_tipo .
            "\n";

        foreach($item->productos_kit as $item1){
            $detalles .= " -- producto_id: " . $item1->producto_id . " - producto_kit_id: " . $item1->producto_kit_id ."\n";

            foreach($item1->stock as $stock){
                $detalles .= " *** STOCK: stock_id: " . $stock->stock_id . " - cant_actual: " . $stock->cant_actual .
                    " - costo_uni: " . $stock->costo_uni . " - sucursal_id: " . $stock->sucursal_id .
                    "\n";
            }
            foreach($item1->stocks as $stocks){
                $detalles .= " === STOCKS: stock_id: " . $stocks->stock_id . " - cant_actual: " . $stocks->cant_actual .
                    " - costo_uni: " . $stocks->costo_uni . " - sucursal_id: " . $stocks->sucursal_id .
                    "\n";
            }
        }

        foreach($item->stock as $item2){
            $detalles .= " -- stock_id: " . $item2->stock_id . " - cant_actual: " . $item2->cant_actual .
                " - costo_uni: " . $item2->costo_uni . " - sucursal_id: " . $item2->sucursal_id .
                "\n";
        }
    }

    $file = 'ventas_user_' . $usuario_id . '_' . date('Y-m-d') . '.log';
    $current = file_get_contents($file);
    $current .= date('Y-m-d H:i:s') . ": asiento_id: " . $asiento_id . "\n";
    $current .= ": usuario_id: " . $usuario_id . "\n";
    $current .= ": email: " . $mail . "\n";
    $current .= $despues;
    $current .= "------------------------------------------------------------------------------\n";
    $current .= $detalles . "\n";
    $current .= "/***************************************************************************/\n";
    file_put_contents($file, $current);


    echo json_encode($data);

}