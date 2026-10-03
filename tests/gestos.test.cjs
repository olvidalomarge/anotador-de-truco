const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const gestos = vm.runInNewContext(fs.readFileSync(path.join(root, "gestos.js"), "utf8") + "; GestosFondo;");

function partida() {
  const documento = { listeners: {}, addEventListener(tipo, fn) { this.listeners[tipo] = fn; } };
  const marcador = { ownerDocument: documento, listeners: {}, addEventListener(tipo, fn) { this.listeners[tipo] = fn; } };
  const direcciones = [];
  let tiempo = 100, puntos = 0, activo = true, fondo = 0;
  gestos.instalar(marcador, {
    habilitado: () => activo,
    ahora: () => tiempo,
    cambiar: (direccion) => { direcciones.push(direccion); fondo = (fondo + direccion + 3) % 3; },
  });
  function emitir(tipo, datos = {}) {
    const evento = {
      pointerId: 1, isPrimary: true, button: 0, clientX: 180, clientY: 200, detail: 1,
      cancelable: true, target: { closest: () => false },
      preventDefault() { this.impedido = true; },
      stopImmediatePropagation() { this.detenido = true; },
      ...datos,
    };
    (marcador.listeners[tipo] || documento.listeners[tipo])?.(evento);
    if (tipo === "click" && !evento.detenido) puntos++;
    return evento;
  }
  function deslizar(dx, dy = 0) {
    emitir("pointerdown");
    emitir("pointermove", { clientX: 180 + dx, clientY: 200 + dy });
    emitir("pointerup", { clientX: 180 + dx, clientY: 200 + dy });
    emitir("click"); // Algunos navegadores generan click incluso después del arrastre.
  }
  return { emitir, deslizar, avanzar: (ms) => tiempo += ms, activar: (valor) => activo = valor,
    get puntos() { return puntos; }, get fondo() { return fondo; }, direcciones };
}

const tap = partida();
tap.deslizar(0);
assert.equal(tap.puntos, 1, "un toque sigue sumando exactamente un punto");
assert.equal(tap.direcciones.length, 0);
const horizontal = partida();
horizontal.deslizar(-90);
assert.equal(horizontal.fondo, 1, "swipe izquierdo muestra el siguiente fondo");
assert.equal(horizontal.puntos, 0, "swipe sobre palitos no suma puntos");
horizontal.deslizar(90);
assert.equal(horizontal.fondo, 0, "swipe derecho vuelve al anterior");
horizontal.deslizar(90);
assert.equal(horizontal.fondo, 2, "volver desde el primer fondo recorre la lista circular");
assert.equal(horizontal.puntos, 0);
horizontal.deslizar(0);
assert.equal(horizontal.puntos, 1, "un toque inmediatamente después del swipe funciona");

for (const [dx, dy] of [[20, 0], [0, 100], [60, 50]]) {
  const p = partida();
  p.deslizar(dx, dy);
  assert.equal(p.fondo, 0, "arrastre corto, vertical o diagonal no cambia fondo");
  assert.equal(p.puntos, 0, "arrastrar no suma accidentalmente");
}
const temblor = partida();
temblor.deslizar(5, 4);
assert.equal(temblor.puntos, 1, "un pequeño movimiento del dedo sigue siendo toque");
const vertical = partida();
vertical.emitir("pointerdown");
vertical.emitir("pointermove", { clientX: 182, clientY: 240 });
vertical.emitir("pointerup", { clientX: 280, clientY: 245 });
assert.equal(vertical.direcciones.length, 0, "el scroll vertical conserva prioridad aunque cambie de dirección");
const lento = partida();
lento.emitir("pointerdown");
lento.avanzar(2000);
lento.emitir("pointerup", { clientX: 280 });
lento.emitir("click");
assert.equal(lento.direcciones.length, 0);
assert.equal(lento.puntos, 0, "un arrastre largo tampoco suma");
const cancelado = partida();
cancelado.emitir("pointerdown");
cancelado.emitir("pointercancel");
cancelado.emitir("pointerup", { clientX: 280 });
cancelado.emitir("click");
assert.equal(cancelado.direcciones.length, 0);
assert.equal(cancelado.puntos, 0);
const dosDedos = partida();
dosDedos.emitir("pointerdown");
dosDedos.emitir("pointerdown", { pointerId: 2, isPrimary: false });
dosDedos.emitir("pointerup", { clientX: 280 });
dosDedos.emitir("click");
assert.equal(dosDedos.direcciones.length, 0);
assert.equal(dosDedos.puntos, 0);
const modoPublico = partida();
modoPublico.activar(false);
modoPublico.deslizar(90);
assert.equal(modoPublico.direcciones.length, 0, "no se cambian fondos en modo público, home o diálogo");
const controles = partida();
controles.emitir("pointerdown", { target: { closest: () => ({}) } });
controles.emitir("pointerup", { clientX: 280 });
assert.equal(controles.direcciones.length, 0, "editar nombres y tocar controles no inicia swipe");
const teclado = partida();
teclado.deslizar(-90);
teclado.emitir("click", { detail: 0 });
assert.equal(teclado.puntos, 1, "la navegación con teclado permanece disponible");

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
assert.ok(html.includes('src="gestos.js?v=20"'));
assert.ok(sw.includes('"./gestos.js?v=20"'), "gestos disponibles sin conexión");
console.log("Swipes en ambos sentidos, recorrido circular, toque normal, cancelación, multitouch, scroll vertical, controles y teclado verificados.");
