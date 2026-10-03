// Reglas y variantes del relato, independientes de la reproducción y de la interfaz.
const RelatoTruco = (() => {
  const clips = {
    inicio30: { archivo: "inicio-30", texto: "¡Está todo listo! Arranca el partido a treinta." },
    inicio: { archivo: "inicio", texto: "¡Se mezclan las cartas! ¡Arranca el truco!" },
    primerosEllos: { archivo: "primeros-ellos", texto: "¡Pasan al frente ellos! ¡Son los primeros puntos, se están conociendo!" },
    uno: { archivo: "un-punto", texto: "¡Un puntito nomás! ¡Más miedo que cartas!", cantidad: 1 },
    unoJubilado: { archivo: "un-punto-jubilado", texto: "¡Un puntito, Latorre! ¡Arriesgaron menos que jubilado comprando dólares!", cantidad: 1 },
    unoAmague: { archivo: "un-punto-amague", texto: "¡Un puntito, Latorre! ¡Mucho amague y nadie cantó nada!", cantidad: 1 },
    dos: { archivo: "dos-puntos", texto: "¡Suman dos puntos!", cantidad: 2 },
    tres: { archivo: "tres-puntos", texto: "¡Tres puntos, eso suma!", cantidad: 3 },
    cuatro: { archivo: "cuatro-de-una", texto: "¡Cuatro de una!", cantidad: 4 },
    cuatroRedondita: { archivo: "cuatro-redondita", texto: "¡Se llevan cuatro! ¡Les salió redondita!", cantidad: 4 },
    cuatroReservado: { archivo: "cuatro-puntos", texto: "¡Llegan a cuatro puntos! ¡Se mueve el tanteador!", reservado: true },
    empate: { archivo: "empate-normal", texto: "¡Lo empataron! ¡Vuelven a quedar iguales!" },
    empateOtra: { archivo: "empate-otra-vez", texto: "¡Otra vez iguales, Latorre!" },
    empateBorrado: { archivo: "empate-diferencia", texto: "¡Se borró la diferencia!" },
    cincoIguales: { archivo: "cinco-a-cinco", texto: "¡Cinco a cinco!" },
    palo: { archivo: "empate", texto: "¡Palo y palo!" },
    partidazo: { archivo: "partidazo", texto: "¡Qué partidazo! ¡El marcador no da respiro!" },
    ventaja: { archivo: "ventaja", texto: "¡Sacan ventaja! ¡Y empiezan a meter presión!" },
    escapan: { archivo: "escapan", texto: "¡Se están escapando en los puntos, Latorre! ¡Linda ventaja!" },
    descuentan: { archivo: "descuentan", texto: "¡Descuentan! ¡Todavía queda partido!" },
    aTiro: { archivo: "a-tiro", texto: "¡Achicaron la diferencia! ¡Se ponen a tiro, se puso lindo!" },
    volvieron: { archivo: "volvieron", texto: "¡Volvieron al partido! ¡Nunca los den por muertos!" },
    remontada: { archivo: "remontada", texto: "¡Lo dieron vuelta! ¡Qué manera de volver al partido!" },
    remontadaFuerte: { archivo: "remontada-fuerte", texto: "¡Tremenda reacción! ¡Parecía que pedían la hora… y ahora el que pide la hora es el otro! ¡Lo dieron vuelta!" },
    buenas: { archivo: "buenas", texto: "¡Entraron en buenas!" },
    rectaFinal: { archivo: "recta-final", texto: "¡Recta final! ¡Acá no se puede regalar nada!" },
    ultimo: { archivo: "ultimo-punto", texto: "¡Punto de partido! ¡La próxima puede ser la última!" },
  };
  const habituales = new Set(["ventaja", "escapan", "descuentan", "aTiro", "volvieron", "partidazo"]);

  function analizarRecuperacion(antes, equipo, historial) {
    const otro = 1 - equipo;
    let desventaja = 0, empates = 0, cambios = 0, diferenciaAnterior = 0, ultimoLider = 0;
    // La trayectoria anterior a la mano no incluye sus empates transitorios al tocar.
    for (const marcador of [...historial, antes]) {
      const diferencia = marcador[equipo] - marcador[otro];
      if (diferencia > 0) desventaja = 0;
      else desventaja = Math.max(desventaja, -diferencia);
      if (diferencia === 0 && diferenciaAnterior !== 0 && marcador[equipo] > 0) empates++;
      const lider = Math.sign(diferencia);
      if (lider && ultimoLider && lider !== ultimoLider) cambios++;
      if (lider) ultimoLider = lider;
      diferenciaAnterior = diferencia;
    }
    return { desventaja, empates, cambios };
  }

  function crearMemoria(puntos = [0, 0], objetivo = 30) {
    return { manos: 0, ultimaHabitual: -Infinity, rectaAnunciada: puntos.some((p) => p >= objetivo - 5) };
  }
  function registrar(evento, memoria) {
    if (habituales.has(evento)) memoria.ultimaHabitual = memoria.manos;
    if (evento === "rectaFinal") memoria.rectaAnunciada = true;
  }

  function elegir(antes, despues, equipo, objetivo, historial = [], memoria = crearMemoria()) {
    const otro = 1 - equipo, puntos = despues[equipo];
    const diferencia = puntos - despues[otro], diferenciaAnterior = antes[equipo] - antes[otro];
    if (puntos <= antes[equipo] || despues.some((p) => p >= objetivo)) return null;
    const cantidad = puntos - antes[equipo];
    const porCantidad = Object.keys(clips).find((nombre) => !clips[nombre].reservado && clips[nombre].cantidad === cantidad) || null;
    const recuperacion = analizarRecuperacion(antes, equipo, historial);
    if (puntos === objetivo - 1) return "ultimo";
    if (puntos > 10 && diferencia > 0 && diferenciaAnterior <= 0 && recuperacion.desventaja >= 3) {
      return recuperacion.desventaja >= 5 ? "remontadaFuerte" : "remontada";
    }
    if (diferencia === 0) {
      if (puntos === 5) return "cincoIguales";
      if (puntos > 10 && recuperacion.desventaja >= 3) return "empateBorrado";
      if (puntos >= 6) return recuperacion.empates > 0 ? "empateRepetido" : "empate";
    }
    if (!memoria.rectaAnunciada && puntos >= objetivo - 5 && antes.every((p) => p < objetivo - 5)) return "rectaFinal";
    if (objetivo === 30 && antes[equipo] <= 15 && puntos > 15) return "buenas";
    if (equipo === 1 && antes.every((p) => p === 0)) return "primerosEllos";
    // Tres manos entre comentarios habituales; el resto usa la cantidad sumada.
    if (memoria.manos - memoria.ultimaHabitual >= 3) {
      if (puntos > 10 && diferencia >= 6 && diferenciaAnterior < 6) return "escapan";
      if (puntos > 10 && diferencia < 0 && diferencia >= -2 && diferenciaAnterior <= -3) {
        return recuperacion.desventaja >= 5 ? "volvieron" : "aTiro";
      }
      if (puntos >= 6 && diferencia >= 3 && diferenciaAnterior < 3) return "ventaja";
      if (puntos >= 6 && diferencia <= -3 && diferencia > diferenciaAnterior) return "descuentan";
      if (despues.every((p) => p > 10) && Math.abs(diferencia) <= 2 && diferencia !== 0 &&
          recuperacion.empates + recuperacion.cambios >= 2) return "partidazo";
    }
    return porCantidad;
  }

  function opciones(evento, objetivo) {
    if (evento === "inicio") return objetivo === 30 ? ["inicio30", "inicio"] : ["inicio"];
    if (evento === "empateRepetido") return ["empate", "empateOtra"];
    if (evento === "remontadaFuerte") return ["remontadaFuerte", "remontada"];
    if (evento === "partidazo") return ["palo", "partidazo"];
    const cantidad = clips[evento]?.cantidad;
    if (cantidad) return Object.keys(clips).filter((nombre) => !clips[nombre].reservado && clips[nombre].cantidad === cantidad);
    return clips[evento] && !clips[evento].reservado ? [evento] : [];
  }
  function crearVariador(azar = Math.random) {
    const bolsas = new Map();
    let ultimoClip = null;
    return {
      siguiente(evento, objetivo) {
        const variantes = opciones(evento, objetivo);
        if (!variantes.length) return null;
        const clave = variantes.join("|");
        const bolsa = bolsas.get(clave) || { pendientes: [], ultimo: null };
        if (!bolsa.pendientes.length) {
          bolsa.pendientes = variantes.slice();
          for (let i = bolsa.pendientes.length - 1; i > 0; i--) {
            const j = Math.floor(azar() * (i + 1));
            [bolsa.pendientes[i], bolsa.pendientes[j]] = [bolsa.pendientes[j], bolsa.pendientes[i]];
          }
        }
        if ((bolsa.pendientes[0] === bolsa.ultimo || bolsa.pendientes[0] === ultimoClip) && bolsa.pendientes.length > 1) {
          bolsa.pendientes.push(bolsa.pendientes.shift());
        }
        bolsa.ultimo = bolsa.pendientes.shift();
        ultimoClip = bolsa.ultimo;
        bolsas.set(clave, bolsa);
        return bolsa.ultimo;
      },
    };
  }
  function crearAgrupador(alResolver, { esperaMs = 1500, programar = setTimeout, cancelar = clearTimeout } = {}) {
    let temporizador = null, mano = null;
    function anular() {
      if (temporizador !== null) cancelar(temporizador);
      temporizador = null;
      mano = null;
    }
    function sumar(antes, despues, equipo, historial) {
      // Cambiar de equipo descarta la anotación pendiente que perdió vigencia.
      if (!mano || mano.equipo !== equipo) {
        mano = { antes: antes.slice(), equipo, historial: historial.map((puntos) => puntos.slice()) };
      }
      mano.despues = despues.slice();
      if (temporizador !== null) cancelar(temporizador);
      temporizador = programar(() => {
        const completa = mano;
        mano = null;
        temporizador = null;
        alResolver(completa);
      }, esperaMs);
    }
    return { sumar, anular, hayPendiente: () => mano !== null };
  }
  return { clips, elegir, crearAgrupador, crearMemoria, registrar, crearVariador, opciones };
})();
