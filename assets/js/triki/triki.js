document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".celda");
    const checkboxValue = getQueryParam('value');
    let currentPlayer = "O"; // "O" empieza primero
    let board = Array(9).fill(null);

    // Variables del marcador
    let scoreO = 0;
    let scoreX = 0;

    // Cargar sonidos
    const clickSound = new Audio("../../sonidos/triki/gota.mp3");
    const winSoundO = new Audio("../../sonidos/triki/ganar.mp3");
    const winSoundX = new Audio("../../sonidos/triki/perder.mp3");
    const drawSound = new Audio("../../sonidos/triki/empate.mp3"); // Sonido para empate

    // Elemento del indicador de turno
    const turnIndicator = document.getElementById("turn-indicator");

    // Función para obtener parámetros de la URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Función para actualizar el indicador de turno
    function updateTurnIndicator() {
        if (currentPlayer === "O") {
            turnIndicator.innerHTML = `
                <div class="text-xl font-bold mb-4">Turno del jugador:</div>
                <i class="fa-solid fa-user mb-2 text-3xl text-blue-600"></i>
            `;
            updateScoreCardColor("O");
        } else {
            turnIndicator.innerHTML = `
                <div class="text-xl font-bold mb-4">Turno del jugador:</div>
                <i class="fa-solid fa-robot mb-2 text-3xl text-red-600"></i>
            `;
            updateScoreCardColor("X");
        }
    }

    // Función para actualizar el color de las tarjetas de puntuación
    function updateScoreCardColor(player) {
        const scoreCardO = document.getElementById("score-card-o");
        const scoreCardX = document.getElementById("score-card-x");

        if (player === "O") {
            scoreCardO.classList.add("bg-blue-100");
            scoreCardX.classList.remove("bg-red-100");
        } else {
            scoreCardX.classList.add("bg-red-100");
            scoreCardO.classList.remove("bg-blue-100");
        }
    }

    // Llamar la función para actualizar el indicador al iniciar
    updateTurnIndicator();

    // Manejar clics en las celdas
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (board[index] || checkWinner(board)) return;

            // Reproducir sonido de clic
            clickSound.play();

            // Movimiento del jugador
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer === "O" ? "text-blue-600" : "text-red-600");

            if (checkWinner(board)) {
                setTimeout(() => {
                    if (currentPlayer === "O") {
                        winSoundO.play(); // Reproducir sonido de victoria de "O"
                        scoreO++; // Incrementar el marcador de "O"
                        Swal.fire({
                            title: "¡O Gana!",
                            text: "Felicidades, has ganado!",
                            icon: "success",
                            confirmButtonText: "Comenzar de nuevo"
                        }).then(() => {
                            resetGame(); // Reiniciar el juego
                        });
                    } else {
                        winSoundX.play(); // Reproducir sonido de victoria de "X"
                        scoreX++; // Incrementar el marcador de "X"
                        Swal.fire({
                            title: "¡X Gana!",
                            text: "Sigue intentando!",
                            icon: "error",
                            confirmButtonText: "Comenzar de nuevo"
                        }).then(() => {
                            resetGame(); // Reiniciar el juego
                        });
                    }
                    updateScoreboard(); // Actualizar el marcador
                }, 100);
                return;
            }

            // Verificar si hay empate
            if (isBoardFull(board)) {
                setTimeout(() => {
                    drawSound.play(); // Reproducir sonido de empate
                    Swal.fire({
                        title: "¡Empate!",
                        text: "Nadie ha ganado.",
                        icon: "info",
                        confirmButtonText: "Comenzar de nuevo"
                    }).then(() => {
                        resetGame(); // Reiniciar el juego
                    });
                }, 100);
                return;
            }

            // Cambiar de jugador
            currentPlayer = currentPlayer === "O" ? "X" : "O";

            // Actualizar el indicador de turno después de cambiar de jugador
            updateTurnIndicator();

            // Movimiento de la máquina
            if (currentPlayer === "X") {
                setTimeout(() => machineMove(checkboxValue), 500);
            }
        });
    });

    // Función para reiniciar el juego
    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = "O"; // Reiniciar el jugador actual
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("text-blue-600", "text-red-600");
        });
        updateTurnIndicator(); // Actualizar el indicador de turno después de reiniciar
    }

    // Función para determinar el movimiento de la máquina según la dificultad
    function machineMove(difficulty) {
        let move;
        switch (difficulty) {
            case 'Item1': // Fácil
                move = easyMove();
                break;
            case 'Item2': // Medio
                move = mediumMove();
                break;
            case 'Item3': // Difícil
                move = hardMove();
                break;
            default:
                move = easyMove();
                break;
        }

        if (move !== null) {
            board[move] = "X";
            cells[move].textContent = "X";
            cells[move].classList.add("text-red-600");

            if (checkWinner(board)) {
                setTimeout(() => {
                    winSoundX.play(); // Reproducir sonido de victoria de "X"
                    scoreX++; // Incrementar el marcador de "X"
                    Swal.fire({
                        title: "¡X Gana!",
                        text: "Sigue intentando!",
                        icon: "error",
                        confirmButtonText: "Comenzar de nuevo"
                    }).then(() => {
                        resetGame(); // Reiniciar el juego
                    });
                    updateScoreboard(); // Actualizar el marcador
                }, 100);
                return;
            }

            // Verificar si hay empate
            if (isBoardFull(board)) {
                setTimeout(() => {
                    drawSound.play(); // Reproducir sonido de empate
                    Swal.fire({
                        title: "¡Empate!",
                        text: "Nadie ha ganado.",
                        icon: "info",
                        confirmButtonText: "Comenzar de nuevo"
                    }).then(() => {
                        resetGame(); // Reiniciar el juego
                    });
                }, 100);
                return;
            }

            currentPlayer = "O";
            updateTurnIndicator(); // Actualizar el indicador de turno después del movimiento de la máquina
        }
    }

    // Movimiento fácil: Elección aleatoria entre celdas vacías
    function easyMove() {
        const emptyCells = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Movimiento medio: Intentar ganar o bloquear al jugador
    function mediumMove() {
        // Movimiento ganador
        const winningMove = findWinningMove("X") || findWinningMove("O");
        if (winningMove !== null) return winningMove;
        // Movimiento fácil si no hay movimientos ganadores o bloqueadores
        return easyMove();
    }

    // Movimiento difícil: IA minimax (simplificado para rendimiento)
    function hardMove() {
        // Movimiento ganador o bloqueador
        const winningMove = findWinningMove("X") || findWinningMove("O");
        if (winningMove !== null) return winningMove;
        // Movimiento óptimo utilizando minimax simplificado
        return optimalMove();
    }

    // Encuentra el movimiento ganador para un jugador dado
    function findWinningMove(player) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = player;
                if (checkWinner(board)) {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
        return null;
    }

    // Movimiento óptimo (simplificación del minimax)
    function optimalMove() {
        const emptyCells = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Verificar si hay un ganador
    function checkWinner(board) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }

        return false;
    }


    // Verificar si el tablero está lleno (empate)
    function isBoardFull(board) {
        return board.every(cell => cell !== null);
    }

    // Añadir evento al botón de reinicio
    document.getElementById("resetButton").addEventListener("click", resetGame);
    // Añadir evento al botón de reinicio
    document.getElementById("resetButton1").addEventListener("click", resetGame);

    // Actualizar el marcador en la interfaz
    function updateScoreboard() {
        document.getElementById("score-o").textContent = scoreO;
        document.getElementById("score-x").textContent = scoreX;
        document.getElementById("score-o1").textContent = scoreO;
        document.getElementById("score-x1").textContent = scoreX;
    }
});




function confirmExit(event) {
    event.preventDefault();
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./../../html/triki/index.html";
        }
    });
}

