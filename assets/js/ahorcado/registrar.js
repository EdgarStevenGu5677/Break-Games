document.getElementById('guardarBtn').addEventListener('click', () => {
    const nombreInput = document.getElementById('nombre');
    const nombre = nombreInput.value;

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
        fetch('registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Nombre inválido',
                        text: data.error,
                    }).then(() => {
                        // Limpiar el campo de entrada
                        nombreInput.value = '';
                        nombreInput.classList.remove('input-error');
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro guardado',
                        text: data.message,
                    }).then(() => {
                        // Limpiar el campo de entrada
                        nombreInput.value = '';
                        nombreInput.classList.remove('input-error');
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al guardar el registro.',
                }).then(() => {
                    // Limpiar el campo de entrada
                    nombreInput.value = '';
                    nombreInput.classList.remove('input-error');
                });
            });
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
