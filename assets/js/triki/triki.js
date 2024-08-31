document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".celda");
    const checkboxValue = getQueryParam('value');
    let currentPlayer = "O"; // "O" starts first
    const board = Array(9).fill(null);

    // Function to get query parameters from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Handle cell clicks
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (board[index] || checkWinner(board)) return;

            // Player's move
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer === "O" ? "text-blue-600" : "text-red-600");

            if (checkWinner(board)) {
                setTimeout(() => alert(`${currentPlayer} Wins!`), 100);
                return;
            }

            // Switch player
            currentPlayer = currentPlayer === "O" ? "X" : "O";

            // Machine's move
            if (currentPlayer === "X") {
                setTimeout(() => machineMove(checkboxValue), 500);
            }
        });
    });

    // Function to determine machine move based on difficulty
    function machineMove(difficulty) {
        let move;
        switch (difficulty) {
            case 'Item1': // Easy
                move = easyMove();
                break;
            case 'Item2': // Medium
                move = mediumMove();
                break;
            case 'Item3': // Hard
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
                setTimeout(() => alert("X Wins!"), 100);
                return;
            }

            currentPlayer = "O";
        }
    }

    // Easy move: Random choice among empty cells
    function easyMove() {
        const emptyCells = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Medium move: Try to win or block player
    function mediumMove() {
        // Winning move
        const winningMove = findWinningMove("X") || findWinningMove("O");
        if (winningMove !== null) return winningMove;

        // Random move
        return easyMove();
    }

    // Hard move: Minimax algorithm with alpha-beta pruning
    function hardMove() {
        const { index } = minimax(board, "X", -Infinity, Infinity);
        return index !== null ? index : easyMove();
    }

    // Check if a move will win the game
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

    // Minimax algorithm with alpha-beta pruning
    function minimax(board, player, alpha, beta) {
        const availableSpots = board.map((value, index) => value === null ? index : null).filter(value => value !== null);

        // Base cases
        if (checkWinner(board, "X")) return { score: 10 };
        if (checkWinner(board, "O")) return { score: -10 };
        if (availableSpots.length === 0) return { score: 0 };

        let bestMove = {};
        if (player === "X") {
            let bestScore = -Infinity;
            for (const spot of availableSpots) {
                board[spot] = player;
                const result = minimax(board, "O", alpha, beta);
                board[spot] = null;

                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = { index: spot, score: bestScore };
                }
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; // Beta cut-off
            }
        } else {
            let bestScore = Infinity;
            for (const spot of availableSpots) {
                board[spot] = player;
                const result = minimax(board, "X", alpha, beta);
                board[spot] = null;

                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = { index: spot, score: bestScore };
                }
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; // Alpha cut-off
            }
        }

        return bestMove;
    }

    // Check if there is a winner
    function checkWinner(board, player) {
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
 
