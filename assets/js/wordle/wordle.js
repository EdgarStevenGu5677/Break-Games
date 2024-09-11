import { database, ref, get } from '../ahorcado/firebase.js';

// Cargar los archivos de audio
const audioCorrect = new Audio('../../sonidos/wordle/ganar.mp3');
const audioIncorrect = new Audio('../../sonidos/wordle/perder.mp3');

// Función para obtener una palabra aleatoria desde la base de datos
async function obtenerPalabraAleatoria() {
    try {
        const palabraRef = ref(database, 'palabras');
        const snapshot = await get(palabraRef);
        if (snapshot.exists()) {
            const palabras = snapshot.val();
            const palabrasArray = Object.values(palabras);
            const palabraAleatoria = palabrasArray[Math.floor(Math.random() * palabrasArray.length)];
            return palabraAleatoria;
        } else {
            throw new Error('No se encontraron palabras en la base de datos');
        }
    } catch (error) {
        console.error('Error al obtener la palabra:', error);
    }
}

// Función para generar la cuadrícula según el número de letras de la palabra
function generarCuadricula(palabra) {
    const numeroColumnas = palabra.length;
    const container = document.getElementById('playerGrid');

    // Limpiar la cuadrícula actual
    container.innerHTML = '';

    // Crear la cuadrícula de 6 filas
    for (let i = 0; i < 6; i++) {
        const fila = document.createElement('div');
        fila.className = 'grid-row';
        fila.dataset.index = i;

        // Crear las celdas para cada fila
        for (let j = 0; j < numeroColumnas; j++) {
            const celda = document.createElement('div');
            celda.className = 'grid-cell bg-gray-300'; // Iniciar todas las celdas en gris
            celda.contentEditable = true;
            celda.dataset.index = j;
            celda.addEventListener('input', (event) => {
                // Limitar el contenido de la celda a una sola letra
                if (event.target.textContent.length > 1) {
                    event.target.textContent = event.target.textContent.slice(0, 1); 
                }
                moveToNextCell(event.target); // Mover a la siguiente celda
            });
            fila.appendChild(celda);
        }

        container.appendChild(fila);
    }

    activarFila(0);

    // Manejador para procesar la adivinanza al presionar Enter
    container.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await procesarAdivinanzaFila(); // Asegúrate de esperar a que se procese
        }
    });

    // Manejador para retroceder con Backspace
    container.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            const filaActual = container.querySelector('.grid-row.active-row');
            if (filaActual) {
                const celdas = filaActual.querySelectorAll('.grid-cell');
                let celdaActiva;
                for (let i = celdas.length - 1; i >= 0; i--) {
                    if (celdas[i].textContent.trim() !== '') {
                        celdaActiva = celdas[i];
                        break;
                    }
                }
                if (celdaActiva) {
                    celdaActiva.textContent = '';
                    moveToPreviousCell(celdaActiva);
                }
            }
        }
    });

    // Manejar clics en el teclado virtual
    document.getElementById('virtualKeyboard').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const tecla = event.target.dataset.key;
            ingresarLetra(tecla);
        }
    });

    document.getElementById('enterButton').addEventListener('click', async () => {
        await procesarAdivinanzaFila(); // Asegúrate de esperar a que se procese
    });

    document.getElementById('backspaceButton').addEventListener('click', () => {
        const filaActual = container.querySelector('.grid-row.active-row');
        if (filaActual) {
            const celdas = filaActual.querySelectorAll('.grid-cell');
            let celdaActiva;
            for (let i = celdas.length - 1; i >= 0; i--) {
                if (celdas[i].textContent.trim() !== '') {
                    celdaActiva = celdas[i];
                    break;
                }
            }
            if (celdaActiva) {
                celdaActiva.textContent = '';
                moveToPreviousCell(celdaActiva);
            }
        }
    });

    // Función para ingresar letra en la celda activa
    function ingresarLetra(letra) {
        const filaActiva = container.querySelector('.grid-row.active-row');
        if (filaActiva) {
            const celdas = filaActiva.querySelectorAll('.grid-cell');
            for (let i = 0; i < celdas.length; i++) {
                if (celdas[i].textContent.trim() === '') {
                    celdas[i].textContent = letra;
                    celdas[i].dispatchEvent(new Event('input')); // Forzar evento de input para actualización
                    moveToNextCell(celdas[i]);
                    break;
                }
            }
        }
    }

    // Función para mover el foco a la siguiente celda
    function moveToNextCell(celda) {
        const fila = celda.parentElement;
        const celdas = fila.querySelectorAll('.grid-cell');
        const index = Array.from(celdas).indexOf(celda);

        if (index < celdas.length - 1) {
            celdas[index + 1].focus();
        }
    }

    // Función para mover el foco a la celda anterior
    function moveToPreviousCell(celda) {
        const fila = celda.parentElement;
        const celdas = fila.querySelectorAll('.grid-cell');
        const index = Array.from(celdas).indexOf(celda);

        if (index > 0) {
            celdas[index - 1].focus();
        }
    }

    // Función para activar una fila específica
    function activarFila(indice) {
        const filas = document.querySelectorAll('.grid-row');
        filas.forEach((fila, i) => {
            if (i === indice) {
                fila.classList.add('active-row');
                fila.classList.remove('disabled-row');
                fila.querySelectorAll('.grid-cell').forEach(celda => celda.contentEditable = true);
            } else {
                fila.classList.remove('active-row');
                fila.classList.add('disabled-row');
                fila.querySelectorAll('.grid-cell').forEach(celda => celda.contentEditable = false);
            }
        });

        const filaActiva = filas[indice];
        const primeraCelda = filaActiva.querySelector('.grid-cell');
        if (primeraCelda) {
            primeraCelda.focus();
        }
    }
    
    // Función para procesar la adivinanza de la fila activa
    async function procesarAdivinanzaFila() {
        const filaActual = container.querySelector('.grid-row.active-row');
        if (filaActual) {
            const celdas = filaActual.querySelectorAll('.grid-cell');
            const adivinanza = Array.from(celdas).map(celda => celda.textContent.trim()).join('');

            if (adivinanza.length === palabra.length) {
                // Primero cambiar colores
                procesarAdivinanza(adivinanza, palabra, filaActual);

                // Esperar un breve intervalo para asegurar que los cambios de color se apliquen
                await new Promise(resolve => setTimeout(resolve, 100));

                // Luego verificar la palabra adivinada
                if (adivinanza === palabra) {
                    audioCorrect.play(); // Reproducir audio de acierto
                    Swal.fire({
                        title: '¡Has ganado!',
                        text: 'La palabra es correcta.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(async () => {
                        // Redireccionar a otra página
                    window.location.href = 'wordle.html'; // Reemplaza con la URL de destino
                    });
                } else {
                    const siguienteFila = filaActual.nextElementSibling;
                    if (siguienteFila) {
                        activarFila(Array.from(container.children).indexOf(siguienteFila));
                    } else {
                        audioIncorrect.play(); // Reproducir audio de error
                        Swal.fire({
                            title: '¡Has perdido!',
                            text: 'La palabra correcta era: ' + palabra,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        }).then(async () => {
                            window.location.href = 'wordle.html'; // Reemplaza con la URL de destino
                        });
                    }
                }
            }
        }
    }

    // Función para procesar la adivinanza y aplicar colores
    function procesarAdivinanza(adivinanza, palabra, fila) {
        const celdas = fila.querySelectorAll('.grid-cell');
        adivinanza.split('').forEach((letra, index) => {
            const celda = celdas[index];
            if (palabra[index] === letra) {
                celda.classList.add('bg-green-500'); // Correcto
            } else if (palabra.includes(letra)) {
                celda.classList.add('bg-yellow-500'); // Incorrecto pero en la palabra
            } else {
                celda.classList.add('bg-gray-500'); // Incorrecto
            }
        });
    }
}

// Ejecutar la función inicial para generar la cuadrícula y cargar la palabra
async function iniciarJuego() {
    const palabra = await obtenerPalabraAleatoria();
    if (palabra) {
        generarCuadricula(palabra);
        document.getElementById('containerPlayer').style.display = 'block';
        window.palabraSeleccionada = palabra; // Guardar la palabra en una variable global para usarla en otras funciones
    }
}

iniciarJuego();


document.getElementById('virtualKeyboard').addEventListener('click', () => {
    document.activeElement.blur(); // Desenfocar el elemento activo
});
