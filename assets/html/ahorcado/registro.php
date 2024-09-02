<?php
header('Content-Type: application/json');

// Ruta al archivo JSON
$jsonFile = 'palabras.json';

// Obtiene los datos de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

// Verifica si el campo nombre está presente
if (isset($data['nombre'])) {
    $nombre = strtolower(trim($data['nombre'])); // Convierte el nombre a minúsculas y elimina espacios
    
    // Verifica si la palabra es válida
    if (!preg_match('/^[a-z]{1,8}$/', $nombre)) {
        echo json_encode(['error' => 'El nombre debe tener un máximo de 8 letras, sin acentos ni caracteres especiales.']);
        exit;
    }

    // Lee el archivo JSON
    if (file_exists($jsonFile)) {
        $jsonData = file_get_contents($jsonFile);
        $words = json_decode($jsonData, true);
    } else {
        $words = [];
    }

    // Verifica si la palabra ya existe
    if (in_array($nombre, $words)) {
        echo json_encode(['error' => 'La palabra ya está registrada.']);
        exit;
    }

    // Agrega la nueva palabra al array
    $words[] = $nombre;

    // Guarda el array actualizado en el archivo JSON
    file_put_contents($jsonFile, json_encode($words, JSON_PRETTY_PRINT));

    echo json_encode(['message' => 'Registro guardado correctamente.']);
} else {
    echo json_encode(['error' => 'No se recibió ningún dato.']);
}
?>
