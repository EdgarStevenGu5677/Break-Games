import { database, ref, set, get } from './firebase.js'; // Asegúrate de que esta ruta sea correcta

document.getElementById('guardarBtn').addEventListener('click', async () => {
    const nombreInput = document.getElementById('nombre');
    const nombre = nombreInput.value.trim().toLowerCase(); // Convertir a minúsculas y eliminar espacios

    // Verificar si el nombre contiene letras mayúsculas
    if (/[A-Z]/.test(nombre)) {
        Swal.fire({
            icon: 'warning',
            title: 'Entrada inválida',
            text: 'No se permiten letras mayúsculas. Por favor, use solo letras minúsculas.',
        }).then(() => {
            // Limpiar el campo de entrada
            nombreInput.value = '';
            nombreInput.classList.remove('input-error');
        });
        return;
    }

    // Verificar el formato del nombre (máximo 8 letras, sin caracteres especiales)
    if (nombre && /^[a-z]{1,8}$/.test(nombre)) {
        try {
            const palabrasRef = ref(database, 'palabras'); // Referencia a la colección 'palabras'
            const snapshot = await get(palabrasRef);

            let palabras = [];
            if (snapshot.exists()) {
                palabras = snapshot.val(); // Obtener palabras existentes
            }

            // Agregar nueva palabra al array si no existe
            if (!palabras.includes(nombre)) {
                palabras.push(nombre);
                await set(palabrasRef, palabras); // Guardar array actualizado

                Swal.fire({
                    icon: 'success',
                    title: 'Registro guardado',
                    text: 'La palabra ha sido guardada exitosamente.',
                }).then(() => {
                    // Limpiar el campo de entrada
                    nombreInput.value = '';
                    nombreInput.classList.remove('input-error');
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Palabra ya registrada',
                    text: 'La palabra ya está registrada.',
                }).then(() => {
                    // Limpiar el campo de entrada
                    nombreInput.value = '';
                    nombreInput.classList.remove('input-error');
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al guardar el registro.',
            }).then(() => {
                // Limpiar el campo de entrada
                nombreInput.value = '';
                nombreInput.classList.remove('input-error');
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Nombre inválido',
            text: 'El nombre debe tener un máximo de 8 letras, sin acentos ni caracteres especiales.',
        }).then(() => {
            // Limpiar el campo de entrada
            nombreInput.value = '';
            nombreInput.classList.remove('input-error');
        });
    }
});
