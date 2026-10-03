// Swipe horizontal del marcador. El scroll vertical permanece a cargo del navegador.
const GestosFondo = (() => {
  const IGNORAR = "header, input, select, textarea, a, .controles, .acciones, .relator-controles, .ir-sonidos";
  function instalar(elemento, { habilitado, cambiar, ahora = Date.now }) {
    const documento = elemento.ownerDocument;
    let gesto = null;
    let ignorarClickHasta = 0;

    elemento.addEventListener("pointerdown", (evento) => {
      if (gesto && evento.pointerId !== gesto.id) {
        gesto = null; // Un segundo dedo cancela el swipe.
        ignorarClickHasta = ahora() + 500;
        return;
      }
      ignorarClickHasta = 0; // Un toque nuevo vuelve a funcionar inmediatamente.
      if (!habilitado() || evento.isPrimary === false || evento.button > 0 || evento.target.closest(IGNORAR)) return;
      gesto = { id: evento.pointerId, x: evento.clientX, y: evento.clientY, inicio: ahora(), vertical: false, arrastre: false };
    });

    documento.addEventListener("pointermove", (evento) => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      const dx = Math.abs(evento.clientX - gesto.x);
      const dy = Math.abs(evento.clientY - gesto.y);
      if (Math.max(dx, dy) >= 12) gesto.arrastre = true;
      if (dy >= 12 && dy > dx) gesto.vertical = true;
    });

    documento.addEventListener("pointerup", (evento) => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      const completa = gesto;
      gesto = null;
      const dx = evento.clientX - completa.x;
      const dy = evento.clientY - completa.y;
      if (completa.arrastre || Math.max(Math.abs(dx), Math.abs(dy)) >= 12) ignorarClickHasta = ahora() + 500;
      if (!habilitado() || completa.vertical || ahora() - completa.inicio > 1800 ||
          Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (evento.cancelable) evento.preventDefault();
      cambiar(dx < 0 ? 1 : -1); // Izquierda: siguiente; derecha: anterior.
    });

    documento.addEventListener("pointercancel", (evento) => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      gesto = null;
      ignorarClickHasta = ahora() + 500;
    });

    elemento.addEventListener("click", (evento) => {
      // Evitar que el click posterior a un arrastre sume puntos o active un control.
      // Los clicks de teclado no tienen detalle ni pointerType y conservan su función.
      if (ahora() >= ignorarClickHasta || (!evento.detail && !evento.pointerType)) return;
      evento.preventDefault();
      evento.stopImmediatePropagation();
    }, true);
  }
  return { instalar };
})();
