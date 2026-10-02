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
  ["primera ventaja sin remontada", [5, 5], [6, 5], 0, 30, [[5, 4]], null],
  ["buenas", [15, 10], [16, 10], 0, 30, [], "buenas"],
  ["recta final a 30", [24, 12], [25, 12], 0, 30, [], "rectaFinal"],
  ["recta final a 15", [9, 5], [10, 5], 0, 15, [], "rectaFinal"],
  ["punto de partido a 30", [28, 20], [29, 20], 0, 30, [], "ultimo"],
  ["punto de partido a 15", [10, 13], [10, 14], 1, 15, [], "ultimo"],
  ["victoria a 15 sin malas/buenas", [14, 10], [15, 10], 0, 15, [], null],
  ["victoria a 30 sin otro relato", [12, 29], [12, 30], 1, 30, [], null],
  ["restar no relata", [10, 8], [9, 8], 0, 30, [], null],
  ["sin cambio no relata", [10, 8], [10, 8], 0, 30, [], null],
  ["punto corriente no interrumpe", [7, 2], [8, 2], 0, 30, [], null],
];
for (const [nombre, antes, despues, equipo, objetivo, historial, esperado] of casos) {
  assert.equal(relator.elegir(antes, despues, equipo, objetivo, historial), esperado, nombre);
}
for (const clip of Object.values(relator.clips)) {
  const archivo = path.join(root, "sonidosRelator", clip.archivo + ".mp3");
  assert.ok(fs.statSync(archivo).size > 0, archivo);
}
console.log(`${casos.length} casos correctos y ${Object.keys(relator.clips).length} MP3 presentes.`);
