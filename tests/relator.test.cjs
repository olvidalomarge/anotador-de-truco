const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const relator = vm.runInNewContext(fs.readFileSync(path.join(root, "relator.js"), "utf8") + "; RelatoTruco;");

const casos = [
  ["primer punto", [0, 0], [1, 0], 0, 30, [], "uno"],
  ["cuatro puntos", [3, 2], [4, 2], 0, 30, [], "cuatro"],
  ["empate de Ellos", [3, 2], [3, 3], 1, 30, [], "empate"],
  ["ventaja", [4, 2], [5, 2], 0, 30, [], "ventaja"],
  ["descuento", [2, 6], [3, 6], 0, 30, [], "descuentan"],
  ["regreso", [3, 5], [4, 5], 0, 30, [], "volvieron"],
  ["remontada después de empate", [5, 5], [6, 5], 0, 30, [[3, 5], [4, 5]], "remontada"],
  ["primera ventaja sin remontada", [5, 5], [6, 5], 0, 30, [[5, 4]], "uno"],
  ["buenas", [15, 10], [16, 10], 0, 30, [], "buenas"],
  ["recta final a 30", [24, 12], [25, 12], 0, 30, [], "rectaFinal"],
  ["recta final a 15", [9, 5], [10, 5], 0, 15, [], "rectaFinal"],
  ["punto de partido a 30", [28, 20], [29, 20], 0, 30, [], "ultimo"],
  ["punto de partido a 15", [10, 13], [10, 14], 1, 15, [], "ultimo"],
  ["victoria a 15 sin malas/buenas", [14, 10], [15, 10], 0, 15, [], null],
  ["victoria a 30 sin otro relato", [12, 29], [12, 30], 1, 30, [], null],
  ["restar no relata", [10, 8], [9, 8], 0, 30, [], null],
  ["sin cambio no relata", [10, 8], [10, 8], 0, 30, [], null],
  ["mano de un punto con marcador avanzado", [7, 2], [8, 2], 0, 30, [], "uno"],
  ["dos puntos iniciales no son un puntito", [0, 0], [2, 0], 0, 30, [], null],
  ["tres puntos evalúan la ventaja final", [0, 0], [3, 0], 0, 30, [], "ventaja"],
  ["atravesar el punto de partido y ganar no lo relata", [13, 8], [15, 8], 0, 15, [], null],
];
for (const [nombre, antes, despues, equipo, objetivo, historial, esperado] of casos) {
  assert.equal(relator.elegir(antes, despues, equipo, objetivo, historial), esperado, nombre);
}
for (const clip of Object.values(relator.clips)) {
  const archivo = path.join(root, "sonidosRelator", clip.archivo + ".mp3");
  assert.ok(fs.statSync(archivo).size > 0, archivo);
}
// Un futuro audio de dos puntos usa la cantidad agrupada, también con marcador avanzado.
relator.clips.dos = { archivo: "dos-puntos", texto: "¡Dos puntos!", cantidad: 2 };
assert.equal(relator.elegir([0, 0], [2, 0], 0, 30), "dos");
assert.equal(relator.elegir([7, 2], [9, 2], 0, 30), "dos");
delete relator.clips.dos;

function relojDePrueba() {
  let ahora = 0;
  let siguiente = 0;
  const tareas = new Map();
  const opciones = {
    programar: (accion, demora) => {
      const id = ++siguiente;
      tareas.set(id, { cuando: ahora + demora, accion });
      return id;
    },
    cancelar: (id) => tareas.delete(id),
  };
  function avanzar(ms) {
    ahora += ms;
    for (const [id, tarea] of [...tareas]) {
      if (tarea.cuando <= ahora) {
        tareas.delete(id);
        tarea.accion();
      }
    }
  }
  return { opciones, avanzar };
}

const reloj = relojDePrueba();
const manos = [];
const agrupador = relator.crearAgrupador((mano) => manos.push(mano), reloj.opciones);
agrupador.sumar([0, 0], [1, 0], 0, [[0, 0]]);
reloj.avanzar(1400);
assert.equal(manos.length, 0, "el primer toque espera");
agrupador.sumar([1, 0], [2, 0], 0, [[0, 0], [1, 0]]);
reloj.avanzar(1499);
assert.equal(manos.length, 0, "el segundo toque vuelve a contar la espera");
reloj.avanzar(1);
assert.equal(manos.length, 1, "una sola decisión para los dos toques");
assert.equal(manos[0].antes[0], 0);
assert.equal(manos[0].despues[0], 2);
assert.equal(relator.elegir(manos[0].antes, manos[0].despues, 0, 30), null);
assert.equal(agrupador.hayPendiente(), false);

agrupador.sumar([2, 0], [3, 0], 0, [[2, 0]]);
agrupador.anular();
reloj.avanzar(1500);
assert.equal(manos.length, 1, "cancelar por corrección, silencio o nueva partida descarta el relato");

agrupador.sumar([10, 12], [11, 12], 0, [[10, 12]]);
reloj.avanzar(1500);
agrupador.sumar([11, 12], [12, 12], 0, [[11, 12]]);
reloj.avanzar(1500);
assert.equal(manos.length, 3, "manos separadas tienen cantidades independientes");
assert.equal(manos[2].antes[0], 11);

agrupador.sumar([3, 4], [4, 4], 0, [[3, 4]]);
agrupador.sumar([4, 4], [4, 5], 1, [[3, 4], [4, 4]]);
reloj.avanzar(1500);
assert.equal(manos[3].equipo, 1);
assert.equal(relator.elegir(manos[3].antes, manos[3].despues, 1, 30), "uno", "no relata un empate intermedio");

const mutable = [5, 5];
agrupador.sumar(mutable, [6, 5], 0, [mutable]);
mutable[0] = 20;
reloj.avanzar(1500);
assert.equal(manos[4].antes[0], 5, "el inicio de la mano es una copia estable");
assert.equal(manos[4].historial[0][0], 5);

console.log(`${casos.length} escenarios del marcador correctos, agrupación y cancelación verificadas, futuros clips por cantidad y 13 MP3 presentes.`);
