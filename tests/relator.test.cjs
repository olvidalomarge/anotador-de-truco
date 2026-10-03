const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const relator = vm.runInNewContext(fs.readFileSync(path.join(root, "relator.js"), "utf8") + "; RelatoTruco;");
const casos = [
  ["primer punto de Nosotros", [0, 0], [1, 0], 0, 30, [], "uno"],
  ["primeros puntos de Ellos", [0, 0], [0, 2], 1, 30, [], "primerosEllos"],
  ["dar vuelta el inicio no es remontada", [0, 1], [2, 1], 0, 30, [], "dos"],
  ["remontada amplia inicial sigue sin emoción", [0, 5], [6, 5], 0, 30, [], null],
  ["empate temprano usa cantidad", [3, 2], [3, 3], 1, 30, [], "uno"],
  ["cinco a cinco es excepción literal", [5, 3], [5, 5], 1, 30, [], "cincoIguales"],
  ["empate desde seis", [5, 6], [6, 6], 0, 30, [], "empate"],
  ["otra vez exige un empate anterior", [6, 7], [7, 7], 0, 30, [[1, 0], [1, 1]], "empateRepetido"],
  ["borrar tres de desventaja después de diez", [8, 11], [11, 11], 0, 30, [], "empateBorrado"],
  ["borrar dos no tiene relato intenso", [9, 11], [11, 11], 0, 30, [], "empate"],
  ["remontada recién al superar diez", [7, 9], [10, 9], 0, 30, [[6, 9]], "tres"],
  ["pasar al frente desde dos abajo no dramatiza", [8, 10], [11, 10], 0, 30, [], "tres"],
  ["remontada significativa", [8, 11], [12, 11], 0, 30, [], "remontada"],
  ["remontada fuerte desde seis abajo", [16, 22], [23, 22], 0, 30, [], "remontadaFuerte"],
  ["remontada a través de empate", [11, 11], [12, 11], 0, 30, [[8, 11]], "remontada"],
  ["no reciclar desventaja antigua para una remontada", [18, 19], [20, 19], 0, 30, [[8, 14], [16, 14], [18, 19]], "partidazo"],
  ["historia antigua no infla reacción reciente", [18, 19], [20, 19], 0, 30, [[8, 14], [16, 14], [16, 19]], "remontada"],
  ["remontada de Ellos simétrica", [11, 8], [11, 12], 1, 30, [], "remontada"],
  ["sin ventaja emocionante antes de seis", [2, 0], [4, 0], 0, 30, [], "dos"],
  ["ventaja desde seis", [5, 3], [6, 3], 0, 30, [], "ventaja"],
  ["escapada recién después de diez", [8, 3], [10, 3], 0, 30, [], "dos"],
  ["escapada avanzada", [10, 5], [11, 5], 0, 30, [], "escapan"],
  ["no repetir escapada ya existente", [11, 5], [12, 5], 0, 30, [], "uno"],
  ["descuento temprano no dramatiza", [3, 9], [5, 9], 0, 30, [], "dos"],
  ["descuento desde seis", [4, 10], [6, 10], 0, 30, [], "descuentan"],
  ["a tiro después de diez", [9, 12], [11, 12], 0, 30, [], "aTiro"],
  ["a tiro antes de once usa cantidad", [7, 10], [9, 10], 0, 30, [], "dos"],
  ["gran reacción sin pasar al frente", [8, 13], [11, 13], 0, 30, [], "volvieron"],
  ["partido apretado avanzado con historia", [19, 19], [20, 19], 0, 30, [[11, 10], [11, 11], [11, 12], [12, 12]], "partidazo"],
  ["partido parejo temprano sin partidazo", [7, 7], [8, 7], 0, 30, [[3, 2], [3, 3], [3, 4], [4, 4]], "uno"],
  ["sin partidazo si rival no supera diez", [10, 10], [11, 10], 0, 30, [[3, 2], [3, 3], [3, 4], [4, 4]], "uno"],
  ["un punto avanzado", [18, 10], [19, 10], 0, 30, [], "uno"],
  ["dos avanzados", [18, 10], [20, 10], 0, 30, [], "dos"],
  ["tres avanzados", [18, 10], [21, 10], 0, 30, [], "tres"],
  ["cuatro avanzados", [18, 10], [22, 10], 0, 30, [], "cuatro"],
  ["cuatro desde cero", [0, 0], [4, 0], 0, 30, [], "cuatro"],
  ["total cuatro no es mano de cuatro", [3, 2], [4, 2], 0, 30, [], "uno"],
  ["buenas", [15, 10], [16, 10], 0, 30, [], "buenas"],
  ["recta final a treinta", [24, 12], [25, 12], 0, 30, [], "rectaFinal"],
  ["recta final a quince", [8, 5], [10, 5], 0, 15, [], "rectaFinal"],
  ["punto de partido domina cantidad", [28, 20], [29, 20], 0, 30, [], "ultimo"],
  ["punto de partido domina remontada", [11, 13], [14, 13], 0, 15, [[8, 13]], "ultimo"],
  ["victoria a quince", [14, 10], [15, 10], 0, 15, [], null],
  ["victoria a treinta", [12, 29], [12, 30], 1, 30, [], null],
  ["restar no relata", [10, 8], [9, 8], 0, 30, [], null],
  ["sin cambio no relata", [10, 8], [10, 8], 0, 30, [], null],
  ["sin audio de cantidad cinco ni situación", [17, 8], [22, 8], 0, 30, [], null],
];
for (const [nombre, antes, despues, equipo, objetivo, historial, esperado] of casos) {
  assert.equal(relator.elegir(antes, despues, equipo, objetivo, historial), esperado, nombre);
}

const memoria = relator.crearMemoria();
memoria.manos = 1;
relator.registrar("ventaja", memoria);
memoria.manos = 2;
assert.equal(relator.elegir([4, 10], [6, 10], 0, 30, [], memoria), "dos", "descanso entre comentarios");
memoria.manos = 3;
assert.equal(relator.elegir([4, 10], [6, 10], 0, 30, [], memoria), "dos", "segunda mano de descanso");
memoria.manos = 4;
assert.equal(relator.elegir([4, 10], [6, 10], 0, 30, [], memoria), "descuentan", "vuelve a comentar en la tercera mano");
memoria.manos = 2;
assert.equal(relator.elegir([8, 11], [12, 11], 0, 30, [], memoria), "remontada", "remontadas no tienen descanso obligatorio");
assert.equal(relator.elegir([5, 6], [6, 6], 0, 30, [], memoria), "empate", "empates no tienen descanso obligatorio");
relator.registrar("rectaFinal", memoria);
assert.equal(relator.elegir([24, 12], [25, 12], 0, 30, [], memoria), "uno", "recta final una sola vez");
assert.equal(relator.crearMemoria([25, 12], 30).rectaAnunciada, true, "restaurar partida avanzada no repite etapa");

const variador = relator.crearVariador(() => 0.37);
for (const evento of ["uno", "cuatro", "empateRepetido", "remontadaFuerte", "partidazo", "inicio"]) {
  const opciones = Array.from(relator.opciones(evento, 30));
  let anterior = null;
  for (let ciclo = 0; ciclo < 4; ciclo++) {
    const usados = [];
    for (let i = 0; i < opciones.length; i++) {
      const elegido = variador.siguiente(evento, 30);
      assert.ok(opciones.includes(elegido));
      assert.notEqual(elegido, anterior, "no repetir inmediatamente " + evento);
      usados.push(elegido);
      anterior = elegido;
    }
    assert.equal(new Set(usados).size, opciones.length, "todas las variantes antes de repetir " + evento);
  }
}
assert.deepEqual(Array.from(relator.opciones("inicio", 15)), ["inicio"]);
assert.equal(relator.crearVariador().siguiente("cuatroReservado", 30), null);
const entreCategorias = relator.crearVariador(() => 0.99);
assert.equal(entreCategorias.siguiente("empate", 30), "empate");
assert.equal(entreCategorias.siguiente("empateRepetido", 30), "empateOtra", "no repetir al habilitar otra variante de empate");
assert.deepEqual(Array.from(relator.opciones("remontada", 30)), ["remontada"], "audio intenso reservado a recuperación grande");

function relojDePrueba() {
  let ahora = 0, siguiente = 0;
  const tareas = new Map();
  return {
    opciones: {
      programar: (accion, demora) => { const id = ++siguiente; tareas.set(id, { cuando: ahora + demora, accion }); return id; },
      cancelar: (id) => tareas.delete(id),
    },
    avanzar(ms) {
      ahora += ms;
      for (const [id, tarea] of [...tareas]) {
        if (tarea.cuando <= ahora) { tareas.delete(id); tarea.accion(); }
      }
    },
  };
}
const reloj = relojDePrueba(), manos = [];
const agrupador = relator.crearAgrupador((mano) => manos.push(mano), reloj.opciones);
agrupador.sumar([0, 0], [1, 0], 0, [[0, 0]]);
reloj.avanzar(1400);
assert.equal(manos.length, 0);
agrupador.sumar([1, 0], [2, 0], 0, [[0, 0], [1, 0]]);
reloj.avanzar(1499);
assert.equal(manos.length, 0, "espera desde el último toque");
reloj.avanzar(1);
assert.equal(manos.length, 1);
assert.equal(relator.elegir(manos[0].antes, manos[0].despues, 0, 30, manos[0].historial), "dos");
assert.equal(manos[0].historial.length, 1, "guardar historia anterior al primer toque");
assert.equal(agrupador.hayPendiente(), false);
agrupador.sumar([2, 0], [3, 0], 0, [[2, 0]]);
agrupador.anular();
reloj.avanzar(1500);
assert.equal(manos.length, 1, "corregir, silenciar o nueva partida cancela pendiente");
agrupador.sumar([3, 4], [4, 4], 0, [[3, 4]]);
agrupador.sumar([4, 4], [4, 5], 1, [[3, 4], [4, 4]]);
reloj.avanzar(1500);
assert.deepEqual(Array.from(manos[1].antes), [4, 4], "no mezclar puntos de equipos distintos");
assert.equal(relator.elegir(manos[1].antes, manos[1].despues, 1, 30, manos[1].historial), "uno");
const mutable = [5, 5];
agrupador.sumar(mutable, [6, 5], 0, [mutable]);
mutable[0] = 20;
reloj.avanzar(1500);
assert.equal(manos[2].antes[0], 5);
assert.equal(manos[2].historial[0][0], 5);
agrupador.sumar([8, 11], [9, 11], 0, [[8, 11]]);
agrupador.sumar([9, 11], [10, 11], 0, [[8, 11], [9, 11]]);
agrupador.sumar([10, 11], [11, 11], 0, [[8, 11], [9, 11], [10, 11]]);
agrupador.sumar([11, 11], [12, 11], 0, [[8, 11], [9, 11], [10, 11], [11, 11]]);
reloj.avanzar(1500);
assert.equal(relator.elegir(manos[3].antes, manos[3].despues, 0, 30, manos[3].historial), "remontada", "cuatro toques son una sola recuperación");

const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
for (const clip of Object.values(relator.clips)) {
  assert.ok(fs.statSync(path.join(root, "sonidosRelator", clip.archivo + ".mp3")).size > 0);
  assert.ok(sw.includes('"./sonidosRelator/' + clip.archivo + '.mp3"'), "audio incluido para uso sin conexión: " + clip.archivo);
}
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(html.includes('src="relator.js?v=19"'), "la actualización no mezcla interfaz nueva con lógica cacheada antigua");
assert.ok(sw.includes('"./relator.js?v=19"'));
for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
new vm.Script(sw);
console.log(`${casos.length} escenarios correctos; prioridades, recuperación reciente, descanso, variantes, agrupación, cancelación y 27 MP3 verificados.`);
