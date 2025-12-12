document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector('.cards-testimonials .cards-scroll');
  const btnUp = document.getElementById('btnUp');   // usando ID
  const btnDown = document.getElementById('btnDown'); // usando ID

  const speed = 3;              
  let scrollInterval = null;

  function startScrolling(direction) {
    stopScrolling();
    scrollInterval = setInterval(() => {
      box.scrollTop += direction * speed;
      toggleScrollButtons();  // actualizar botones mientras se hace scroll
    }, 10);
  }

  function stopScrolling() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  // Scroll al mantener presionado
  btnUp.addEventListener('mousedown', () => startScrolling(-1));
  btnDown.addEventListener('mousedown', () => startScrolling(1));

  btnUp.addEventListener('mouseup', stopScrolling);
  btnDown.addEventListener('mouseup', stopScrolling);
  btnUp.addEventListener('mouseleave', stopScrolling);
  btnDown.addEventListener('mouseleave', stopScrolling);
  document.addEventListener('mouseup', stopScrolling);

  // Mostrar/ocultar botones
  function toggleScrollButtons() {
    const scrollTop = box.scrollTop;
    const scrollHeight = box.scrollHeight;
    const containerHeight = box.clientHeight;

    btnUp.style.display = scrollTop <= 0 ? 'none' : 'block';
    btnDown.style.display = scrollTop + containerHeight >= scrollHeight - 1 ? 'none' : 'block';
    // "-1" para evitar problemas con decimales
  }

  // Detecta scroll manual
  box.addEventListener('scroll', toggleScrollButtons);

  // Inicializa estado
  toggleScrollButtons();
});