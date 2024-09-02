// hover imagen
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.relative');

    cards.forEach(card => {
        const img = card.querySelector('img');
        const originalSrc = img.getAttribute('src');
        const hoverSrc = img.getAttribute('data-hover');

        card.addEventListener('mouseover', function () {
            img.src = hoverSrc;
        });

        card.addEventListener('mouseout', function () {
            img.src = originalSrc;
        });
    });
});


function showAlert(event) {
    event.preventDefault();

    Swal.fire({
        title: '¡Atención!',
        text: 'Este juego todavía no ha sido agregado.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'bg-blue-500 text-white'
        }
    });
}