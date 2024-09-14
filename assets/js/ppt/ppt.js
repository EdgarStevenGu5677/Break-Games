const opciones = ["piedra", "papel", "tijera"];
const playerScoreSpan = document.getElementById("score-player");
const robotScoreSpan = document.getElementById("score-robot");
const playerScoreSpan1 = document.getElementById("score-player1");
const robotScoreSpan1 = document.getElementById("score-robot1");
const ScoreSpan = document.getElementById("score1");

const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const win1Sound = document.getElementById('win1-sound');
const tieSound = document.getElementById('tie-sound');

let playerScore = 0;
let robotScore = 0;

let victoriasJugador = 0;
let victoriasRobot = 0;

const botones = document.querySelectorAll(".choice-button");
const resultadoDiv = document.getElementById("result");
const playerImage = document.getElementById("player-image");
const robotImage = document.getElementById("robot-image");
const shakeSound = document.getElementById("shake-sound");

botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
        const eleccionJugador = e.currentTarget.getAttribute("data-choice");
        const eleccionComputadora = obtenerEleccionComputadora();

        agitarManos();

        setTimeout(() => {
            actualizarImagenJugador(eleccionJugador);
            actualizarImagenComputadora(eleccionComputadora);

            const resultado = determinarGanador(eleccionJugador, eleccionComputadora);

            // Actualizar el marcador
            if (resultado === "¡Ganaste!") {
                victoriasJugador++;
                playerScoreSpan.textContent = victoriasJugador;
                playerScoreSpan1.textContent = victoriasJugador;
            } else if (resultado === "Perdiste, el robot ganó.") {
                victoriasRobot++;
                robotScoreSpan.textContent = victoriasRobot;
                robotScoreSpan1.textContent = victoriasRobot;
            }
            // Verificar si alguno de los jugadores ha ganado 3 veces
            if (victoriasJugador === 3 || victoriasRobot === 3) {
                // Reproduce el audio correspondiente
                if (victoriasJugador === 3) {
                    playAudio(winSound);
                } else {
                    playAudio(loseSound);
                }

                SweetAlert.fire({
                    title: victoriasJugador === 3 ? '¡Ganaste el juego!' : 'El robot ganó el juego',
                    text: '¿Qué deseas hacer ahora?',
                    icon: victoriasJugador === 3 ? 'success' : 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Reiniciar',
                    cancelButtonText: 'Salir'
                }).then((result) => {
                    if (result.isConfirmed) {
                        reiniciarJuego();
                    } else if (result.isDismissed) {
                        salirJuego();
                    }
                });
            }
        }, 2000);
    });
});

function obtenerEleccionComputadora() {
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    return opciones[indiceAleatorio];
}

function determinarGanador(jugador, computadora) {
    let result;
    if (jugador === computadora) {
        const resultElement = document.getElementById('score1');
        playAudio(tieSound);
        resultElement.textContent = "=";
        setTimeout(() => {
            resultElement.textContent = ""; // Ocultar el mensaje
        }, 1000);
    } else if (
        (jugador === "piedra" && computadora === "tijera") ||
        (jugador === "papel" && computadora === "piedra") ||
        (jugador === "tijera" && computadora === "papel")
    ) {
        playerScore++;
        victoriasJugador++;
        actualizarMarcador();
        playAudio(win1Sound);
        mostrarEfecto("+1", "player");
        result = "¡Ganaste!";

    } else {
        robotScore++
        victoriasRobot++;;
        actualizarMarcador();
        playAudio(win1Sound);
        mostrarEfecto("+1", "robot");
        result = "Perdiste, el robot ganó.";

    }
    setTimeout(() => {
        reiniciarImagenes();
    }, 500);
}

function actualizarMarcador() {
    playerScoreSpan.textContent = playerScore;
    robotScoreSpan.textContent = robotScore;
    playerScoreSpan1.textContent = playerScore;
    robotScoreSpan1.textContent = robotScore;
}

function mostrarEfecto(texto, ganador) {
    const span = document.createElement("span");
    span.textContent = texto;
    span.classList.add("bounce");
    const jugadorSpan = document.querySelector(`.${ganador} span:last-child`);
    jugadorSpan.appendChild(span);

    setTimeout(() => {
        span.remove();
    }, 1000);
}

function actualizarImagenJugador(eleccion) {
    playerImage.src = `../../image/ppt/${eleccion}Player.webp`;
}

function actualizarImagenComputadora(eleccion) {
    robotImage.src = `../../image/ppt/${eleccion}Robot.webp`;
}

function agitarManos() {
    playerImage.classList.add("shake");
    robotImage.classList.add("shake");
    shakeSound.play();

    setTimeout(() => {
        playerImage.classList.remove("shake");
        robotImage.classList.remove("shake");
        shakeSound.pause();
        shakeSound.currentTime = 0;
    }, 2000);
}

function reiniciarImagenes() {
    playerImage.src = '../../image/ppt/piedraPlayer.webp';
    robotImage.src = '../../image/ppt/piedraRobot.webp';
}

function reiniciarJuego() {
    robotScore = 0;
    playerScore = 0;
    victoriasJugador = 0;
    victoriasRobot = 0;
    playerScoreSpan.textContent = victoriasJugador;
    robotScoreSpan.textContent = victoriasRobot;
    playerScoreSpan1.textContent = victoriasJugador;
    robotScoreSpan1.textContent = victoriasRobot;
    reiniciarImagenes();
}

function salirJuego() {
    Swal.fire({
        title: 'Gracias por jugar!',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000, // Tiempo en milisegundos antes de redirigir
        timerProgressBar: true
    }).then(() => {
        window.location.href = './index.html'; // Redirigir después de que la alerta se cierre
    });
}

function playAudio(audioElement) {
    audioElement.currentTime = 0; // Reiniciar el audio
    audioElement.play(); // Reproducir el audio
}