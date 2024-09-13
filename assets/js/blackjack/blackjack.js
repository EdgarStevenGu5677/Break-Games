let balance = 500; // Saldo inicial
let balanceCruper = 500; //Saldo inicial del cruper
let bet = 0; // Apuesta inicial
let buttonsEnabled = false; // Estado de los botones de juego

// Variables para los audios
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const tieSound = document.getElementById('tie-sound');

function subtractAmount(amount) {
    if (balance > 0) {
        // Verifica si el saldo del crupier es mayor que cero
        if (balanceCruper <= 0) {
            Swal.fire({
                title: 'Has dejado al crupier en la ruina',
                text: 'El Crupier se ha quedado sin fondos y no puede continuar apostando.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Actualiza la variable para indicar que hay un nuevo crupier
                    newDealer = true;

                    // Muestra el segundo alerta
                    Swal.fire({
                        title: 'Nuevo Crupier',
                        text: 'Un nuevo crupier ha llegado.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        balanceCruper = 700; // Asigna un nuevo saldo al crupier
                        document.getElementById('balanceCruper').innerText = balanceCruper;
                        document.getElementById('balanceCruper1').innerText = balanceCruper;
                    });
                }
            });
            return; // Detiene la función si el saldo del crupier es cero
        }

        if (balance >= amount) {
            balance -= amount; // Restar del saldo
            bet += amount; // Sumar a la apuesta
            balanceCruper -= amount; // Sincronizar la apuesta del crupier
            playAudio(document.getElementById('bet-sound'));
        } else {
            bet += balance; // Sumar lo que queda si es menor que la cantidad
            balanceCruper -= balance; // Restar lo que queda del saldo del crupier
            playAudio(document.getElementById('bet-sound'));
            balance = 0;
        }

        // Actualizar el DOM
        document.getElementById('balance').innerText = balance;
        document.getElementById('balanceCruper').innerText = balanceCruper;
        document.getElementById('balancePlayer').innerText = balance;
        document.getElementById('balanceCruper1').innerText = balanceCruper;
        document.getElementById('balancePlayer1').innerText = balance;
        document.getElementById('bet').innerText = bet * 2; // Apuesta total (del jugador y del crupier)

        // Activar los botones si hay apuesta
        if (bet > 0 && !buttonsEnabled) {
            enableGameControls(true);
        }

        // Mostrar alerta si el saldo llega a 0
        if (balance === 0) {
            Swal.fire({
                title: '¡Sin fondos!',
                text: 'Ya no tiene fondos',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    } else {
        Swal.fire({
            title: 'Has quedado en la ruina',
            text: 'No puedes seguir apostando sin fondos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Retirarse',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = './index.html';
            }
        });
    }
}


function enableGameControls(enable) {
    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(button => {
        if (enable) {
            button.classList.remove('cursor-not-allowed', 'opacity-50');
            buttonsEnabled = true;
        } else {
            button.classList.add('cursor-not-allowed', 'opacity-50');
            buttonsEnabled = false;
        }
    });
}

enableGameControls(false);

function handleGameAction(action) {
    if (!buttonsEnabled) {
        Swal.fire({
            title: '¡Haz una apuesta!',
            text: 'Debes hacer una apuesta antes de continuar.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else {
        console.log(`${action} button clicked`);
        // Aquí iría la lógica del juego para cada acción
    }
}

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
        return 10;
    }
    if (card.value === 'A') {
        return 11;
    }
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') {
            aceCount++;
        }
    }
    // Ajustar si hay ases
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function renderHand(hand, elementId, hideFirstCard = false) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = ''; // Limpiar la mano actual
    hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        if (elementId === 'dealer-cards' && index === 0 && hideFirstCard) {
            cardDiv.classList.add('card-back'); // Carta boca abajo
            cardDiv.innerHTML = '🂠'; // Icono para carta boca abajo
        } else {
            // Asignar color a la carta según el palo
            if (card.suit === '♥' || card.suit === '♦') {
                cardDiv.classList.add('red'); // Cartas rojas
            }

            cardDiv.innerHTML = `${card.value}<br>${card.suit}`;
        }

        handElement.appendChild(cardDiv);
    });
}

function dealInitialCards() {
    if (bet > 0) {
        createDeck();
        shuffleDeck();
        playerHand = [];
        dealerHand = [];
        // Repartir cartas iniciales
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        playAudio(document.getElementById('deal-sound'));
        updateGame();
    } else {
        Swal.fire({
            title: '¡Haz una apuesta!',
            text: 'Debes hacer una apuesta antes de repartir las cartas.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
}

function updateGame() {
    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards', true); // La primera carta boca abajo

    const playerScore = calculateHandValue(playerHand);
    document.getElementById('player-score').innerText = `${playerScore}`;

    // Calcular puntuación del crupier solo con la carta visible
    const dealerVisibleCardValue = getCardValue(dealerHand[1]);
    document.getElementById('dealer-score').innerText = `${dealerVisibleCardValue}`;
}

function revealDealerHand() {
    const dealerHandElement = document.getElementById('dealer-cards');
    const dealerCards = dealerHandElement.querySelectorAll('.card');
    dealerCards.forEach((card, index) => {
        card.classList.remove('card-back');
        card.innerHTML = `${dealerHand[index].value}<br>${dealerHand[index].suit}`;
    });

    // Calcular y mostrar la puntuación total del crupier
    const dealerScore = calculateHandValue(dealerHand);
    document.getElementById('dealer-score').innerText = `${dealerScore}`;
}

function hit() {
    playerHand.push(deck.pop());
    playAudio(document.getElementById('1deal-sound'));
    updateGame();
    const playerScore = calculateHandValue(playerHand);
    if (playerScore > 21) {
        // Si el jugador se pasa, muestra el alert de pérdida y deshabilita los controles
        Swal.fire({
            title: '¡Te pasaste!',
            text: 'Tu puntuación supera 21. El crupier gana.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            // Mostrar el turno del crupier y revelar todas sus cartas
            playDealerTurn(true);
            playAudio(loseSound); // Reproducir sonido de victoria
            // Perdiste, el crupier gana la apuesta
            balanceCruper += bet * 2;
            document.getElementById('balanceCruper').innerText = balanceCruper;
            document.getElementById('balanceCruper1').innerText = balanceCruper;

            // Retrasar la llamada a resetGame() por 4 segundos (4000 ms)
            setTimeout(() => {
                resetGame();
            }, 1000);
        });
    }

}

function stand() {
    // Mostrar la primera carta del crupier boca abajo
    const dealerHandElement = document.getElementById('dealer-cards');
    dealerHandElement.querySelector('.card-back').classList.remove('card-back');
    playAudio(document.getElementById('1deal-sound'));
    updateGame();
    playDealerTurn(); // Continuar con el juego del crupier
}

function playDealerTurn(playerPassed = false) {
    // Si el jugador se pasó, el crupier debe jugar y revelar todas sus cartas
    if (playerPassed) {
        revealDealerHand();
        return; // No hacer nada más si el jugador se pasó
    }

    const dealerHandElement = document.getElementById('dealer-cards');
    dealerHand.forEach((_, index) => {
        if (index > 0) {
            dealerHandElement.querySelectorAll('.card')[index].classList.add('card-back');
        }
    });

    let dealerScore = calculateHandValue(dealerHand);
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateHandValue(dealerHand);
        renderHand(dealerHand, 'dealer-cards', true);
    }

    setTimeout(() => {
        revealDealerHand();
        const playerScore = calculateHandValue(playerHand);

        let resultText;
        let resultIcon;

        if (dealerScore > 21) {
            resultText = '¡Ganaste!';
            resultIcon = 'success';
            playAudio(winSound); // Reproducir sonido de victoria
            // Ganaste, duplicas tu apuesta
            balance += bet * 2;
            document.getElementById('balance').innerText = balance;
            document.getElementById('balancePlayer').innerText = balance;
            document.getElementById('balancePlayer1').innerText = balance;
        } else if (playerScore > dealerScore) {
            resultText = '¡Ganaste!';
            resultIcon = 'success';
            playAudio(winSound); // Reproducir sonido de victoria
            // Ganaste, duplicas tu apuesta
            balance += bet * 2;
            document.getElementById('balance').innerText = balance;
            document.getElementById('balancePlayer').innerText = balance;
            document.getElementById('balancePlayer1').innerText = balance;
        } else if (playerScore < dealerScore) {
            resultText = 'Perdiste.';
            resultIcon = 'error';
            playAudio(loseSound); // Reproducir sonido de victoria
            // Perdiste, el crupier gana la apuesta
            balanceCruper += bet * 2;
            document.getElementById('balanceCruper').innerText = balanceCruper;
            document.getElementById('balanceCruper1').innerText = balanceCruper;
        } else {
            resultText = 'Empate';
            resultIcon = 'warning';
            playAudio(tieSound); // Reproducir sonido de victoria
            // En caso de empate, la apuesta se divide entre ambos
            balance += bet;
            balanceCruper += bet;
            document.getElementById('balance').innerText = balance;
            document.getElementById('balancePlayer').innerText = balance;
            document.getElementById('balanceCruper').innerText = balanceCruper;
            document.getElementById('balancePlayer1').innerText = balance;
            document.getElementById('balanceCruper1').innerText = balanceCruper;
        }

        Swal.fire({
            title: resultText,
            text: `Puntuación del crupier: ${dealerScore}`,
            icon: resultIcon,
            confirmButtonText: 'OK'
        }).then(() => {
            // Retrasar la llamada a resetGame() por 4 segundos (4000 ms)
            setTimeout(() => {
                resetGame();
            }, 1000);
        });

        // Actualizar el estado del juego (no se debe resetear aquí)
        bet = 0;
        document.getElementById('bet').innerText = bet;
        enableGameControls(false);

    }, 1000); // Tiempo para revelar la mano del crupier (ajustar según sea necesario)
}

function revealDealerHand() {
    const dealerHandElement = document.getElementById('dealer-cards');
    const dealerCards = dealerHandElement.querySelectorAll('.card');
    dealerCards.forEach((card, index) => {
        card.classList.remove('card-back');
        card.innerHTML = `${dealerHand[index].value}<br>${dealerHand[index].suit}`;
    });

    // Calcular y mostrar la puntuación total del crupier
    const dealerScore = calculateHandValue(dealerHand);
    document.getElementById('dealer-score').innerText = `${dealerScore}`;
}


function resetGame() {
    bet = 0;
    document.getElementById('bet').innerText = bet;
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').innerText = '0';
    document.getElementById('dealer-score').innerText = '0';

    // Volver a crear y barajar el mazo
    createDeck();
    shuffleDeck();

    // Restablecer las manos de los jugadores
    playerHand = [];
    dealerHand = [];

    // Deshabilitar los controles de juego
    enableGameControls(false);
}
// Asignar eventos a los botones
document.getElementById('btn-deal').addEventListener('click', dealInitialCards);
document.getElementById('btn-hit').addEventListener('click', hit);
document.getElementById('btn-stand').addEventListener('click', stand);

document.getElementById('btn-deal1').addEventListener('click', dealInitialCards);
document.getElementById('btn-hit1').addEventListener('click', hit);
document.getElementById('btn-stand1').addEventListener('click', stand);


function resetGameButton() {
    // Mostrar el SweetAlert de confirmación
    Swal.fire({
        title: '¿Estás seguro de reiniciar el juego?',
        text: "¡Perderás tu progreso actual!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'blackjack.html'; // Reemplaza con la URL de destino
            // Mostrar mensaje de éxito
            Swal.fire(
                '¡Reiniciado!',
                'El juego ha sido reiniciado.',
                'success'
            );
        }
    });
}

function playAudio(audioElement) {
    audioElement.currentTime = 0; // Reiniciar el audio
    audioElement.play(); // Reproducir el audio
}

