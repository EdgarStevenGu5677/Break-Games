document.addEventListener('DOMContentLoaded', function () {
    const playerIcon = document.getElementById('playerIcon');
    const robotIcon = document.getElementById('robotIcon');
    const playerIcon1 = document.getElementById('playerIcon1');
    const robotIcon1 = document.getElementById('robotIcon1');
    const playerGridId = 'playerGrid';
    const robotGridId = 'robotGrid';
    const startGameButton = document.getElementById('startGameButton');
    const startGameButton1 = document.getElementById('startGameButton1');
    const bombSound = document.getElementById('bombSound');
    const sinkSound = document.getElementById('sinkSound');
    const winSound = document.getElementById('winSound');
    const loseSound = document.getElementById('loseSound'); // Nuevo sonido de derrota
    let gameStarted = false;
    let playerTurn = true; // Empieza el juego con el turno del jugador
    let remainingShips = 21;
    let robotRemainingShips = 21;
    let audioPlaying = false;

    // Inicializa las cuadrículas
    initializeGrid(playerGridId, 10, 10, 'playerShipConfiguration', false);
    initializeGrid(robotGridId, 10, 10, 'shipConfiguration', true);

    function placeExactShips() {
        const gridCells = Array.from(document.querySelectorAll(`#${playerGridId} .grid-item`));
        let shipsPlaced = 0;

        // Limpia los barcos existentes
        gridCells.forEach(cell => cell.classList.remove('ship'));

        // Coloca los barcos
        while (shipsPlaced < 21) {
            const randomIndex = Math.floor(Math.random() * gridCells.length);
            const cell = gridCells[randomIndex];
            if (!cell.classList.contains('ship')) {
                cell.classList.add('ship');
                shipsPlaced++;
            }
        }

        // Guarda la configuración en localStorage
        const shipIndices = Array.from(document.querySelectorAll(`#${playerGridId} .ship`))
            .map(cell => gridCells.indexOf(cell));
        localStorage.setItem('playerShipConfiguration', JSON.stringify(shipIndices));
    }

    function initializeGrid(gridId, rows, cols, localStorageKey, isRobotGrid) {
        const gridContent = document.getElementById(gridId);
        gridContent.innerHTML = '';

        // Crear las celdas de la cuadrícula
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-item';
            cell.id = `${gridId}-cell-${i}`;
            if (isRobotGrid) {
                cell.addEventListener('click', function () {
                    handleRobotCellClick(cell);
                });
            } else {
                cell.addEventListener('click', function () {
                    handlePlayerCellClick(cell);
                });
            }
            gridContent.appendChild(cell);
        }

        // Cargar la configuración de barcos desde localStorage
        if (localStorageKey) {
            const shipConfiguration = JSON.parse(localStorage.getItem(localStorageKey)) || [];
            shipConfiguration.forEach(index => {
                const cell = document.getElementById(`${gridId}-cell-${index}`);
                if (cell) {
                    cell.classList.add('ship');
                }
            });
            if (isRobotGrid) {
                remainingShips = shipConfiguration.length;
                updateShipCounter();
            } else {
                robotRemainingShips = shipConfiguration.length;
                updateShipCounter();
            }
        }
    }

    function handlePlayerCellClick(cell) {
        if (!gameStarted) {
            Swal.fire('El juego aún no ha comenzado. Haz clic en "Iniciar Juego".');
            return;
        }

        if (!playerTurn) {
            Swal.fire('Es el turno del robot. Espera a que termine su turno.');
            return;
        }

        if (audioPlaying) {
            return;
        }

        if (cell.classList.contains('miss') || cell.classList.contains('hit')) {
            Swal.fire('Ya has disparado en esta celda.');
            return;
        }

        audioPlaying = true;

        bombSound.play();
        bombSound.onended = function () {
            if (cell.classList.contains('ship')) {
                cell.classList.add('hit');
                remainingShips--;
                updateShipCounter();
                sinkSound.play();
                setTimeout(() => {
                    Swal.fire({
                        title: '¡Has hundido un barco del robot!',
                        icon: 'success',
                        timer: 2000, // Tiempo en milisegundos antes de cerrar la alerta
                        timerProgressBar: true, // Opcional: Muestra una barra de progreso del temporizador
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                }, 1000);
                sinkSound.onended = function () {
                    if (remainingShips === 0) {
                        winSound.play();
                        Swal.fire({
                            title: '¡Victoria!',
                            text: '¡Has hundido todos los barcos!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = './index.html'; // Redirige a la página de victoria
                        });
                    } else {
                        audioPlaying = false;
                    }
                };
            } else {
                cell.classList.add('miss');
                audioPlaying = false;
                playerTurn = false;
                toggleGridInteraction(playerGridId, false); // Desactivar la cuadrícula del jugador
                toggleGridInteraction(robotGridId, true); // Activar la cuadrícula del robot
                updateTurnIndicator();
                setTimeout(startRobotTurn, 1000); // Inicia el turno del robot después de un pequeño retraso
            }
        };
    }

    function handleRobotCellClick(cell) {
        // Si el robot está jugando, no debe hacer nada si el jugador hace clic
        if (playerTurn) {
            return; // No se permite la interacción del jugador con el robot durante su turno
        }
    }

    function startRobotTurn() {
        if (remainingShips === 0 || robotRemainingShips === 0) return;

        // Habilitar la interacción con las celdas del robot solo cuando sea el turno del robot
        toggleGridInteraction(robotGridId, true);

        const availableCells = Array.from(document.querySelectorAll(`#${robotGridId} .grid-item:not(.miss):not(.hit)`));
        if (availableCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cell = availableCells[randomIndex];

        setTimeout(() => {
            handleRobotMove(cell);
        }, 500);
    }

    function handleRobotMove(cell) {
        bombSound.play();
        bombSound.onended = function () {
            if (cell.classList.contains('ship')) {
                cell.classList.add('hit');
                robotRemainingShips--;
                updateShipCounter();
                sinkSound.play();
                setTimeout(() => {
                    Swal.fire({
                        title: '¡El robot te ha hundido un barco!',
                        icon: 'success',
                        timer: 2000, // Tiempo en milisegundos antes de cerrar la alerta
                        timerProgressBar: true, // Opcional: Muestra una barra de progreso del temporizador
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                }, 1000); // Ajusta el tiempo según la duración del sonido
                sinkSound.onended = function () {
                    if (robotRemainingShips === 0) {
                        loseSound.play(); // Reproduce el sonido de derrota
                        Swal.fire({
                            title: '¡El robot ganó!',
                            text: '¡El robot ha hundido todos tus barcos!',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = './index.html'; // Redirige a la página de derrota
                        });
                    } else {
                        startRobotTurn(); // El robot sigue jugando si acierta
                    }
                };
            } else {
                cell.classList.add('miss');
                playerTurn = true;
                updateTurnIndicator();
                toggleGridInteraction(playerGridId, true); // Reactivar la cuadrícula del jugador
                toggleGridInteraction(robotGridId, false); // Desactivar la cuadrícula del robot
                audioPlaying = false;
            }
        };
    }

    function toggleGridInteraction(gridId, isEnabled) {
        const gridContent = document.getElementById(gridId);
        gridContent.style.pointerEvents = isEnabled ? 'auto' : 'none';
    }

    function updateShipCounter() {
        document.getElementById('playerShipsRemaining').innerText = `Barcos restantes: ${remainingShips}`;
        document.getElementById('robotShipsRemaining').innerText = `Barcos restantes: ${robotRemainingShips}`;
        document.getElementById('shipCounter2').innerText = `${remainingShips}`;
        document.getElementById('shipCounter3').innerText = `${robotRemainingShips}`;
    }

    function updateTurnIndicator() {
        if (playerTurn) {
            playerIcon.classList.add('turno-activo');
            playerIcon.classList.remove('turno-inactivo');
            robotIcon.classList.add('turno-inactivo');
            robotIcon.classList.remove('turno-activo');
            playerIcon1.classList.add('turno-activo');
            playerIcon1.classList.remove('turno-inactivo');
            robotIcon1.classList.add('turno-inactivo');
            robotIcon1.classList.remove('turno-activo');
            document.getElementById('playerShipsRemaining').style.display = 'block';
            document.getElementById('robotShipsRemaining').style.display = 'none';
            document.getElementById('containerPlayer').style.display = 'block';
            document.getElementById('containerRobot').style.display = 'none';
        } else {
            robotIcon.classList.add('turno-activo');
            robotIcon.classList.remove('turno-inactivo');
            playerIcon.classList.add('turno-inactivo');
            playerIcon.classList.remove('turno-activo');
            robotIcon1.classList.add('turno-activo');
            robotIcon1.classList.remove('turno-inactivo');
            playerIcon1.classList.add('turno-inactivo');
            playerIcon1.classList.remove('turno-activo');
            document.getElementById('playerShipsRemaining').style.display = 'none';
            document.getElementById('robotShipsRemaining').style.display = 'block';
            document.getElementById('containerPlayer').style.display = 'none';
            document.getElementById('containerRobot').style.display = 'block';
        }
    }

    function startGame() {
        gameStarted = true;
        playerTurn = true;
        remainingShips = 21;
        robotRemainingShips = 21;
        updateShipCounter();
        startGameButton.style.display = 'none';
        startGameButton1.style.display = 'none';
        document.getElementById('containerPlayer').style.display = 'block';
        document.getElementById('containerRobot').style.display = 'block';
        placeExactShips();
        updateTurnIndicator();
    }

    startGameButton.addEventListener('click', startGame);
    startGameButton1.addEventListener('click', startGame);

});