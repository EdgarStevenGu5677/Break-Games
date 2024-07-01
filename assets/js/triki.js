let tablero = ['', '', '', '', '', '', '', '', ''];
let turno = 'X';
const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function iniciarTriki() {
    turno = localStorage.getItem('turno') || 'X';
    tablero = JSON.parse(localStorage.getItem('tablero')) || ['', '', '', '', '', '', '', '', ''];
    actualizarInterfaz();
    agregarEventos();
    if (turno === 'O') {
        turnoComputadora();
    }
}

function actualizarInterfaz() {
    const celdas = document.querySelectorAll('.celda');
    celdas.forEach((celda, index) => {
        celda.textContent = tablero[index];
    });
}

function clickCelda(event) {
    const index = event.target.getAttribute('data-index');
    if (tablero[index] === '') {
        tablero[index] = turno;
        event.target.textContent = turno;
        if (verificarGanador()) {
            alert(`${turno} gana!`);
            reiniciarTriki();
        } else if (tablero.every(celda => celda !== '')) {
            alert('Empate!');
            reiniciarTriki();
        } else {
            cambiarTurno();
            if (turno === 'O') {
                setTimeout(turnoComputadora, 500); // Añadimos un pequeño retraso para la jugada de la computadora
            }
        }
    }
}

function cambiarTurno() {
    turno = turno === 'X' ? 'O' : 'X';
    localStorage.setItem('turno', turno);
    localStorage.setItem('tablero', JSON.stringify(tablero));
}

function turnoComputadora() {
    let mejorMovimiento = minimax(tablero, turno).indice;
    tablero[mejorMovimiento] = turno;
    const celda = document.querySelector(`.celda[data-index="${mejorMovimiento}"]`);
    celda.textContent = turno;
    if (verificarGanador()) {
        alert(`${turno} gana!`);
        reiniciarTriki();
    } else if (tablero.every(celda => celda !== '')) {
        alert('Empate!');
        reiniciarTriki();
    } else {
        cambiarTurno();
    }
}

function minimax(nuevoTablero, jugador) {
    let casillasDisponibles = obtenerCasillasDisponibles(nuevoTablero);

    if (verificarGanadorParaJugador(nuevoTablero, 'X')) {
        return { puntaje: -10 };
    } else if (verificarGanadorParaJugador(nuevoTablero, 'O')) {
        return { puntaje: 10 };
    } else if (casillasDisponibles.length === 0) {
        return { puntaje: 0 };
    }

    let movimientos = [];
    for (let i = 0; i < casillasDisponibles.length; i++) {
        let movimiento = {};
        movimiento.indice = casillasDisponibles[i];
        nuevoTablero[casillasDisponibles[i]] = jugador;
        if (jugador === 'O') {
            let resultado = minimax(nuevoTablero, 'X');
            movimiento.puntaje = resultado.puntaje;
        } else {
            let resultado = minimax(nuevoTablero, 'O');
            movimiento.puntaje = resultado.puntaje;
        }
        nuevoTablero[casillasDisponibles[i]] = ''; // Deshacer el movimiento

        movimientos.push(movimiento);
    }

    let mejorMovimiento;
    if (jugador === 'O') {
        let mejorPuntaje = -Infinity;
        for (let i = 0; i < movimientos.length; i++) {
            if (movimientos[i].puntaje > mejorPuntaje) {
                mejorPuntaje = movimientos[i].puntaje;
                mejorMovimiento = i;
            }
        }
    } else {
        let mejorPuntaje = Infinity;
        for (let i = 0; i < movimientos.length; i++) {
            if (movimientos[i].puntaje < mejorPuntaje) {
                mejorPuntaje = movimientos[i].puntaje;
                mejorMovimiento = i;
            }
        }
    }

    return movimientos[mejorMovimiento];
}

function obtenerCasillasDisponibles(tablero) {
    let casillasDisponibles = [];
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === '') {
            casillasDisponibles.push(i);
        }
    }
    return casillasDisponibles;
}

function verificarGanador() {
    return combinacionesGanadoras.some(combinacion =>
        combinacion.every(index => tablero[index] === turno)
    );
}

function verificarGanadorParaJugador(tablero, jugador) {
    return combinacionesGanadoras.some(combinacion =>
        combinacion.every(index => tablero[index] === jugador)
    );
}

function reiniciarTriki() {
    tablero = ['', '', '', '', '', '', '', '', ''];
    turno = 'X';
    localStorage.setItem('turno', turno);
    localStorage.setItem('tablero', JSON.stringify(tablero));
    actualizarInterfaz();
    if (turno === 'O') {
        turnoComputadora();
    }
}

function agregarEventos() {
    const celdas = document.querySelectorAll('.celda');
    celdas.forEach(celda => {
        celda.addEventListener('click', clickCelda);
    });
}

// Lógica para iniciar Triki automáticamente al cargar la página
window.onload = function() {
    iniciarTriki();
};
