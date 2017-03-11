<?php


ini_set('display_errors', '0');     # don't show any errors...
error_reporting(E_ALL | E_STRICT);  # ...but do log them

require "jwt_helper.php";

// JWT Secret Key
//$secret = base64_encode('asdfwearsadfasdareasdfaeasdfaefawasadf');
$secret = 'asdfwearsadfasdareasdfaeasdfaefawasadf';
// JWT Secret Key Social
$secret_social = 'LUc_cGQHgmKZyFd5ozKJHnujpam1JKb06FWnjjtnWH9htNKDEQFGNMHYUvX_6PgR';
// JWT AUD
$serverName = 'serverName';
// false local / true production
$jwt_enabled = true;
// Carpeta de imágenes
$image_path = "../../../images/";
// Nivel de compresión de las imágenes
$compression_level = 20;


//require_once 'MysqliDb.php';
if (file_exists('../../../../../cnx/cnx.php')) {
    require_once '../../../../../cnx/cnx.php';
} else {
    require_once '../../../cnx/cnx.php';
}


/* @name: checkSecurity
 * @param
 * @description: Verifica las credenciales enviadas. En caso de no ser correctas, retorna el error correspondiente.
 * TODO: Cambiar nombre a CheckValidity, ya que valida que el token en si sea válido
 */
function checkSecurity()
{
    $requestHeaders = apache_request_headers();
    $authorizationHeader = isset($requestHeaders['Authorization']) ? $requestHeaders['Authorization'] : null;

//    echo print_r(apache_request_headers());


    if ($authorizationHeader == null) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No authorization header sent";
        exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    global $secret;
    global $decoded_token;
    try {
//        $decoded_token = JWT::decode($token, base64_decode(strtr($secret, '-_', '+/')), true);
        $decoded_token = JWT::decode($token, $secret, true);
    } catch (UnexpectedValueException $ex) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }


    global $serverName;

    // // validate that this token was made for us
    if ($decoded_token->aud != $serverName) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }

}

/**
 * @description Valida que el rol del usuario sea el correcto
 * @param $requerido
 */
function validateRol($requerido)
{

    global $jwt_enabled;
    if ($jwt_enabled == false) {
        return;
    }

    $requestHeaders = apache_request_headers();

    $authorizationHeader = isset($requestHeaders['Authorization']) ? $requestHeaders['Authorization'] : null;

//    echo print_r(apache_request_headers());


    if ($authorizationHeader == null) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No authorization header sent";
        exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    global $secret;
    global $decoded_token;
    $decoded_token = JWT::decode($token, $secret, true);

    $rol = $decoded_token->data->rol;
    if ($rol > $requerido) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No authorization header sent";
        exit();
    }


}

function generatePushId()
{
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    $PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    $lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    $lastRandChars = [];

    $now = (new DateTime)->getTimestamp();
    $duplicateTime = ($now === $lastPushTime);
    $lastPushTime = $now;

    $timeStampChars = array();
    for ($i = 7; $i >= 0; $i--) {
        $timeStampChars[$i] = substr($PUSH_CHARS, $now % 64, 1);
        // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
        $now = floor($now / 64);
    }
    if ($now != 0) {
        header('HTTP/1.0 500 Internal Server Error');
        return;
    }

    $id = implode('', $timeStampChars);

    if (!$duplicateTime) {
        for ($i = 0; $i < 12; $i++) {
            $lastRandChars[$i] = floor(rand(0, 63));
        }
    } else {
        // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
        for ($i = 11; $i >= 0 && $lastRandChars[$i] === 63; $i--) {
            $lastRandChars[$i] = 0;
        }
        $lastRandChars[$i]++;
    }
    for ($i = 0; $i < 12; $i++) {
        $id = $id . substr($PUSH_CHARS, $lastRandChars[$i], 1);
    }
    if (strlen($id) != 20) {
        header('HTTP/1.0 500 Internal Server Error');
        return;
    }

    return $id;
}

function getDataFromToken($field = null)
{
    $requestHeaders = apache_request_headers();
    $authorizationHeader = isset($requestHeaders['Authorization']) ? $requestHeaders['Authorization'] : null;

//    echo print_r(apache_request_headers());


    if ($authorizationHeader == null) {
		return null;
        //header('HTTP/1.0 401 Unauthorized');
        //echo "No authorization header sent";
        //exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    global $secret;
    global $decoded_token;
    try {
//        $decoded_token = JWT::decode($token, base64_decode(strtr($secret, '-_', '+/')), true);
        $decoded_token = JWT::decode($token, $secret, true);
        if ($field == null) {
            return $decoded_token;
        } else {
            return $decoded_token->data->$field;
        }
    } catch (UnexpectedValueException $ex) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }

}


class Main
{
    public static $db;
    private $permisssions = array(
        'Usuarios' => array('get' => -1,
            'login' => -1,
            'loginCliente' => -1,
            'logout' => -1,
            'create' => -1,
            'update' => -1,
            'generateSession' => -1,
        ),
        'Productos' => array(
            'getProductos' => -1,
            'getProductosCliente' => -1,
            'getCategorias' => -1,
            'createProducto' => -1,
            'updateProducto' => -1
        ),
        'Cajas' => array(
            'getTotalByCuenta' => -1,
            'getSaldoInicial' => 1,
            'getCajaDiaria' => 1,
            'checkEstado' => -1,
            'cerrarCaja' => -1,
            'abrirCaja' => -1,
            'getSaldoFinalAnterior' => -1,
            'getResultado' => -1,
            'createEncomienda' => 1,
            'updateEncomienda' => 1,
            'getEncomiendas' => 1
        ),
        'Stocks' => array(
            'getStocks' => 1,
            'updateStock' => 1,
            'getPedidos' => 1,
            'createStock' => 1,
            'trasladar' => 1,
            'getAReponer' => 1
        ),
        'Reportes' => array(
            'cierreDeCaja' => -1,
            'updateStock' => 1
        ),
        'Sucursales' => array('get' => -1,
            'create' => -1,
            'update' => -1
        ),
        'Categorias' => array('get' => -1,
            'create' => -1,
            'update' => -1
        ),
        'Avisos' => array(
            'get' => -1,
            'create' => -1,
            'update' => -1,
            'remove' => -1
        ),
        'Comandas' => array(
            'getComanda' => -1,
            'getComandas' => -1,
            'createComanda' => -1,
            'createDetalle' => -1,
            'createExtra' => -1,
            'updateComanda' => -1
        )
    );


    protected function __construct($class, $fnc)
    {
        try {

            if ($this->permisssions[$class][$fnc] > -1) {
                checkSecurity();
                validateRol($this->permisssions[$class][$fnc]);
            }
        } catch (Exception $e) {
            echo 'Caught exception: ', $e->getMessage(), "\n";
        }
        if (!isset($this->db)) {
            //$this->db = get('mv-local');
            $this->db = get('mv-test');
        }
    }
}
