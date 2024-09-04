import { database, ref, get } from './firebase.js'; // Asegúrate de que esta ruta sea correcta

document.addEventListener('DOMContentLoaded', async function () {
    const maxAttempts = 8;
    let remainingAttempts = maxAttempts;
    let correctLetters = [];
    let incorrectLetters = [];
    let word = '';

    // Variables para los contadores
    let gamesWon = 0;
    let gamesLost = 0;

    const winSound = document.getElementById('winSound');
    const loseSound = document.getElementById('loseSound');

    const hangmanImages = [
        '../../image/ahorcado/ahorcado0.png',
        '../../image/ahorcado/ahorcado1.png',
        '../../image/ahorcado/ahorcado2.png',
        '../../image/ahorcado/ahorcado3.png',
        '../../image/ahorcado/ahorcado4.png',
        '../../image/ahorcado/ahorcado5.png',
        '../../image/ahorcado/ahorcado6.png',
        '../../image/ahorcado/ahorcado7.png',
        '../../image/ahorcado/ahorcado8.png'
    ];

    async function fetchRandomWord() {
        try {
            const palabrasRef = ref(database, 'palabras'); // Referencia a la colección 'palabras'
            const snapshot = await get(palabrasRef);
            let words = [];
            if (snapshot.exists()) {
                words = snapshot.val(); // Obtener palabras existentes
            }
            const randomIndex = Math.floor(Math.random() * words.length);
            word = words[randomIndex];
            return word;
        } catch (error) {
            console.error('Error fetching the word:', error);
        }
    }

    function displayWordPC(word) {
        const container = document.getElementById('word-container');
        if (container) {
            container.innerHTML = '';
            correctLetters = [];
            for (let i = 0; i < word.length; i++) {
                const letterElement = document.createElement('span');
                letterElement.className = 'inline-block border-b-2 border-dashed border-gray-700 px-2 mx-1 text-2xl';
                letterElement.textContent = '_';
                container.appendChild(letterElement);
                correctLetters.push('_');
            }
        }
    }

    function displayWordMobile(word) {
        const container = document.getElementById('word-container1');
        if (container) {
            container.innerHTML = '';
            correctLetters = [];
            for (let i = 0; i < word.length; i++) {
                const letterElement = document.createElement('span');
                letterElement.className = 'inline-block border-b-2 border-dashed border-gray-700 px-2 mx-1 text-2xl';
                letterElement.textContent = '_';
                container.appendChild(letterElement);
                correctLetters.push('_');
            }
        }
    }

    function updateIncorrectLetters() {
        const container = document.getElementById('incorrect-letters');
        if (container) {
            container.textContent = incorrectLetters.join(', ');
        }
    }

    function updateHangmanImage() {
        const hangmanImageElement = document.getElementById('hangman-image');
        if (hangmanImageElement) {
            const imageIndex = maxAttempts - remainingAttempts;
            hangmanImageElement.src = hangmanImages[imageIndex];
        }
    }

    function updateCounters() {
        const wonElement = document.getElementById('games-won');
        const lostElement = document.getElementById('games-lost');
        if (wonElement && lostElement) {
            wonElement.textContent = gamesWon;
            lostElement.textContent = gamesLost;
        }
    }

    function handleKeyPress(event) {
        const letter = event.key ? event.key.toLowerCase() : event.target.getAttribute('data-key').toLowerCase();
        // Verifica si la tecla presionada es una letra (a-z)
        if (/^[a-z]$/.test(letter)) {
            if (word.includes(letter)) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === letter) {
                        correctLetters[i] = letter;
                    }
                }
                updateWordDisplay();
            } else {
                if (!incorrectLetters.includes(letter)) {
                    incorrectLetters.push(letter);
                    remainingAttempts--;
                    const attemptsElement = document.getElementById('remaining-attempts');
                    if (attemptsElement) {
                        attemptsElement.textContent = remainingAttempts;
                    }
                    updateIncorrectLetters();
                    updateHangmanImage(); // Actualiza la imagen del ahorcado
                }
            }

            if (remainingAttempts <= 0) {
                loseSound.play();  // Reproducir sonido de pérdida
                gamesLost++;  // Incrementar el contador de pérdidas
                updateCounters(); // Actualizar la interfaz
                Swal.fire({
                    title: '¡Perdiste!',
                    text: `La palabra era: ${word}`,
                    icon: 'error',
                    confirmButtonText: 'Reiniciar juego'
                }).then(() => {
                    initializeGame();
                });
            } else if (!correctLetters.includes('_')) {
                winSound.play();  // Reproducir sonido de victoria
                gamesWon++;  // Incrementar el contador de victorias
                updateCounters(); // Actualizar la interfaz
                Swal.fire({
                    title: '¡Ganaste!',
                    text: 'Has adivinado la palabra.',
                    icon: 'success',
                    confirmButtonText: 'Reiniciar juego'
                }).then(() => {
                    initializeGame();
                });
            }
        }
    }

    function updateWordDisplay() {
        const container = document.getElementById('word-container');
        if (container) {
            container.innerHTML = '';
            for (let i = 0; i < word.length; i++) {
                const letterElement = document.createElement('span');
                letterElement.className = 'inline-block border-b-2 border-dashed border-gray-700 px-2 mx-1 text-2xl';
                letterElement.textContent = correctLetters[i];
                container.appendChild(letterElement);
            }
        }

        const mobileContainer = document.getElementById('word-container1');
        if (mobileContainer) {
            mobileContainer.innerHTML = '';
            for (let i = 0; i < word.length; i++) {
                const letterElement = document.createElement('span');
                letterElement.className = 'inline-block border-b-2 border-dashed border-gray-700 px-2 mx-1 text-2xl';
                letterElement.textContent = correctLetters[i];
                mobileContainer.appendChild(letterElement);
            }
        }
    }

    async function initializeGame() {
        remainingAttempts = maxAttempts;
        incorrectLetters = [];
        correctLetters = [];
        const attemptsElement = document.getElementById('remaining-attempts');
        if (attemptsElement) {
            attemptsElement.textContent = remainingAttempts;
        }
        updateIncorrectLetters();
        const randomWord = await fetchRandomWord();
        if (randomWord) {
            displayWordPC(randomWord);
            displayWordMobile(randomWord);
            updateHangmanImage(); // Resetear la imagen del ahorcado
        }
    }

    function setupRestartButton() {
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', initializeGame);
        }
    }

    function setupResetButton() {
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', initializeGame);
        }
    }

    initializeGame();
    setupRestartButton();
    setupResetButton();

    document.addEventListener('keydown', handleKeyPress);

    const keyboardButtons = document.querySelectorAll('#virtual-keyboard .key');
    keyboardButtons.forEach(button => {
        button.addEventListener('click', handleKeyPress);
    });

    const attemptsContainer = document.getElementById('remaining-attempts-container');
    if (attemptsContainer) {
        attemptsContainer.style.display = 'none';
    }
});


//Prueba
// document.addEventListener('DOMContentLoaded', function () {
//     const keyboardButtons = document.querySelectorAll('#virtual-keyboard .key');

//     keyboardButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             const letter = this.getAttribute('data-key');
//             handleKeyPress({ key: letter });
//         });
//     });
// });