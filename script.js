// Selecciona el botón y el ícono
    const volumeButton = document.getElementById('volumeButton');
    const volumeIcon = document.getElementById('volumeIcon');
    const soundEffect = document.getElementById('soundEffect');

    // Función para cambiar el ícono y controlar el sonido
    function toggleSound() {
        if (volumeIcon.classList.contains('fa-volume-up')) {
            volumeIcon.classList.remove('fa-volume-up');
            volumeIcon.classList.add('fa-volume-mute');
            // Silencia el audio y reinicia la reproducción desde el principio
            soundEffect.pause();
            soundEffect.currentTime = 0; // Reinicia el audio al inicio
        } else {
            volumeIcon.classList.remove('fa-volume-mute');
            volumeIcon.classList.add('fa-volume-up');
            // Reinicia y reproduce el audio desde el principio
            soundEffect.currentTime = 0; // Reinicia el audio al inicio
            soundEffect.play()
                .catch(error => {
                    // Manejar el error de reproducción automática aquí
                    console.error('Error al reproducir el audio:', error.message);
                });
        }
    }

    // Agrega un listener para el clic en el botón
    volumeButton.addEventListener('click', toggleSound);

    // Reproduce el sonido automáticamente al cargar la página, solo después de una interacción del usuario
    document.addEventListener('click', function() {
        soundEffect.play()
            .then(() => {
                // Éxito al reproducir el audio después de la interacción del usuario
                console.log('Sonido iniciado correctamente.');
            })
            .catch(error => {
                // Manejar el error de reproducción automática aquí
                console.error('Error al reproducir el audio:', error.message);
            });
    }, { once: true }); // Se asegura de que solo se dispare una vez después de la primera interacción