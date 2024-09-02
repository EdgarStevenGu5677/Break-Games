document.addEventListener('DOMContentLoaded', async function() {
    const maxAttempts = 8;
    let remainingAttempts = maxAttempts;
    let correctLetters = [];
    let incorrectLetters = [];
    let word = '';

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
            const response = await fetch('palabras.json');
            const words = await response.json();
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

    function handleKeyPress(event) {
        const letter = event.key.toLowerCase();
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

    const attemptsContainer = document.getElementById('remaining-attempts-container');
    if (attemptsContainer) {
        attemptsContainer.style.display = 'none';
    }
});


//SweetAlert regresar
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
            window.location.href = "./../../html/ahorcado/index.html";
        }
    });
}

