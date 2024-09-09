document.addEventListener('DOMContentLoaded', function () {
    // Limpiar localStorage si el usuario vuelve desde otra página
    const currentPage = window.location.href;

    // Si el usuario vuelve desde otra página, se borra el localStorage
    if (document.referrer && document.referrer !== currentPage) {
        localStorage.removeItem('shipConfiguration');
    }

    // Inicializar la cuadrícula
    const gridContent = document.querySelector('.grid-content');
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        cell.id = `cell-${i}`;
        gridContent.appendChild(cell);
    }

    // Agregar los event listeners solo una vez
    const updateButton = document.getElementById('updateButton');
    const updateButton1 = document.getElementById('updateButton1');

    updateButton.removeEventListener('click', handleUpdate);
    updateButton.addEventListener('click', handleUpdate);

    updateButton1.removeEventListener('click', handleUpdate);
    updateButton1.addEventListener('click', handleUpdate);

    function handleUpdate(e) {
        e.preventDefault();
        placeShips();
    }

    function placeShips() {
        // Definir 21 barcos de tamaño 1
        const ships = Array(21).fill({ size: 1 });

        // Generar la cuadrícula y colocar barcos
        const occupied = new Set(); // Para evitar colocar barcos en celdas ya ocupadas
        document.querySelectorAll('.grid-item').forEach(cell => cell.style.backgroundColor = '#e5e7eb');

        ships.forEach(ship => {
            placeShip(ship.size, occupied);
        });

        // Guardar la configuración en localStorage
        const shipConfiguration = Array.from(occupied);
        localStorage.setItem('shipConfiguration', JSON.stringify(shipConfiguration));
    }

    function placeShip(size, occupied) {
        let placed = false;
        let attempts = 0; // Agregar un contador de intentos

        while (!placed && attempts < 1000) { // Límite de 1000 intentos
            const startIndex = Math.floor(Math.random() * 100);
            const startRow = Math.floor(startIndex / 10);
            const startCol = startIndex % 10;

            let valid = true;
            const coordinates = [];

            for (let i = 0; i < size; i++) {
                const row = startRow;
                const col = startCol;
                const index = row * 10 + col;

                if (row >= 10 || col >= 10 || occupied.has(index)) {
                    valid = false;
                    break;
                }
                coordinates.push(index);
            }

            // Verificar que no haya barcos adyacentes
            if (valid && checkSurrounding(coordinates, occupied)) {
                coordinates.forEach(index => {
                    document.getElementById(`cell-${index}`).style.backgroundColor = '#1d4ed8'; // Color del barco
                    occupied.add(index);
                });
                placed = true;
            }

            attempts++;
        }

        if (attempts >= 1000) {
            console.error('No se pudo colocar el barco después de 1000 intentos');
        }
    }

    function checkSurrounding(coordinates, occupied) {
        const directions = [
            { dr: 1, dc: 0 }, // Abajo
            { dr: -1, dc: 0 }, // Arriba
            { dr: 0, dc: 1 }, // Derecha
            { dr: 0, dc: -1 }, // Izquierda
            { dr: 1, dc: 1 }, // Abajo derecha
            { dr: -1, dc: -1 }, // Arriba izquierda
            { dr: 1, dc: -1 }, // Abajo izquierda
            { dr: -1, dc: 1 }  // Arriba derecha
        ];

        const occupiedSet = new Set(occupied);
        for (const index of coordinates) {
            const row = Math.floor(index / 10);
            const col = index % 10;

            for (const { dr, dc } of directions) {
                const adjacentRow = row + dr;
                const adjacentCol = col + dc;
                const adjacentIndex = adjacentRow * 10 + adjacentCol;

                if (adjacentRow >= 0 && adjacentRow < 10 && adjacentCol >= 0 && adjacentCol < 10) {
                    if (occupiedSet.has(adjacentIndex)) {
                        return false; // Hay un barco adyacente
                    }
                }
            }
        }
        return true;
    }

    // Función para verificar la configuración y redirigir al juego
    function checkConfigurationAndRedirect() {
        const configuration = localStorage.getItem('shipConfiguration');

        if (configuration) {
            // Redirigir al juego
            window.location.href = './guerranaval.html'; // Cambia esto a la URL de tu juego
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Configuración no seleccionada',
                text: 'Por favor, seleccione una configuración antes de iniciar el juego.'
            });
        }
    }

    // Manejar clic en el botón de "Iniciar"
    document.getElementById('startButton').addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
        checkConfigurationAndRedirect();
    });

    // Manejar clic en el botón de "Play"
    document.getElementById('playButton').addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
        checkConfigurationAndRedirect();
    });
});