    // Función para obtener el valor del checkbox seleccionado
    function getSelectedCheckboxValue() {
        const checkedCheckbox = document.querySelector('input[type="checkbox"]:checked');
        return checkedCheckbox ? checkedCheckbox.value : null;
    }

    function iniciarTriki() {
        const value = getSelectedCheckboxValue();
        if (value) {
            // Redirigir a la página del juego Triki con el valor como parámetro
            window.location.href = `./triki.html?value=${encodeURIComponent(value)}`;
        } else {
            Swal.fire("¡Selecciona la dificulta!");
        }
        return false; // Para prevenir el comportamiento por defecto del enlace
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    // Desmarcar otros checkboxes
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });
                }
            });
        });
    });