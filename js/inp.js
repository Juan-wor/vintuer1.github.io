document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('custom-input');
  
    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '');
  
      if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);
      }
  
      // Convertir el valor en un número
      let value = parseInt(input.value);
  
      // Validar el rango para que el valor esté entre 22 y 45
      if (!isNaN(value)) {
        if (value < 22) {
          input.value = 22;
        } else if (value > 45) {
          input.value = 45;
        }
      }
    });
  
    input.addEventListener('keydown', function (e) {
      // Permitir solo números y algunas teclas específicas como borrar, retroceso y flechas
      if (
        (e.key >= '0' && e.key <= '9') || 
        e.key === 'Backspace' || 
        e.key === 'ArrowLeft' || 
        e.key === 'ArrowRight' || 
        e.key === 'Delete'
      ) {
        return;
      }

      e.preventDefault();
    });
  });
  