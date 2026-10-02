// Selección de clips originales aportados para el relator.
const RelatoTruco = (() => {
  const clips = {
    inicio30: { archivo: "inicio-30", texto: "¡Está todo listo! Arranca el partido a treinta." },
    inicio: { archivo: "inicio", texto: "¡Se mezclan las cartas! ¡Arranca el truco!" },
    uno: { archivo: "un-punto", texto: "¡Un puntito nomás! ¡Más miedo que cartas!", cantidad: 1 },
    cuatro: { archivo: "cuatro-puntos", texto: "¡Llegan a cuatro puntos! ¡Se mueve el tanteador!", cantidad: 4 },
    empate: { archivo: "empate", texto: "¡Palo y palo!" },
    partidazo: { archivo: "partidazo", texto: "¡Qué partidazo! ¡El marcador no da respiro!" },
    ventaja: { archivo: "ventaja", texto: "¡Sacan ventaja! ¡Y empiezan a meter presión!" },
    descuentan: { archivo: "descuentan", texto: "¡Descuentan! ¡Todavía queda partido!" },
    volvieron: { archivo: "volvieron", texto: "¡Volvieron al partido! ¡Nunca los den por muertos!" },
    remontada: { archivo: "remontada", texto: "¡Lo dieron vuelta! ¡Qué manera de volver al partido!" },
    buenas: { archivo: "buenas", texto: "¡Entraron en buenas!" },
    rectaFinal: { archivo: "recta-final", texto: "¡Recta final! ¡Acá no se puede regalar nada!" },
    ultimo: { archivo: "ultimo-punto", texto: "¡Punto de partido! ¡La próxima puede ser la última!" },
  };

  function elegir(antes, despues, equipo, objetivo, historial = []) {
    const otro = 1 - equipo;
    const puntos = despues[equipo];
    const diferencia = puntos - despues[otro];
    const diferenciaAnterior = antes[equipo] - antes[otro];
    if (puntos <= antes[equipo] || despues.some((p) => p >= objetivo)) return null;
    // La cantidad pertenece a la mano completa. Se puede repetir a cualquier altura de la partida.
    const cantidad = puntos - antes[equipo];
    const porCantidad = Object.keys(clips).find((nombre) => clips[nombre].cantidad === cantidad);
    if (porCantidad) return porCantidad;
    if (puntos === objetivo - 1) return "ultimo";
    if (puntos >= objetivo - 5 && antes[equipo] < objetivo - 5) return "rectaFinal";
    if (objetivo === 30 && antes[equipo] <= 15 && puntos > 15) return "buenas";
    if (diferencia > 0 && diferenciaAnterior <= 0 &&
        historial.some((mano) => mano[equipo] < mano[otro])) return "remontada";
    if (diferencia === 0 && puntos >= 3) return "empate";
    if (diferencia >= 3 && diferenciaAnterior < 3) return "ventaja";
    if (diferencia === -1 && diferenciaAnterior <= -2) return "volvieron";
    if (diferencia === -3 && diferenciaAnterior <= -4) return "descuentan";
    return null;
  }

  function crearAgrupador(alResolver, {
    esperaMs = 1500,
    programar = setTimeout,
    cancelar = clearTimeout,
  } = {}) {
    let temporizador = null;
    let mano = null;

    function anular() {
      if (temporizador !== null) cancelar(temporizador);
      temporizador = null;
      mano = null;
    }

    function sumar(antes, despues, equipo, historial) {
      if (!mano) mano = { antes: antes.slice() };
      mano.despues = despues.slice();
      mano.equipo = equipo;
      mano.historial = historial.map((puntos) => puntos.slice());
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

  return { clips, elegir, crearAgrupador };
})();
