// Selección de clips originales aportados para el relator.
const RelatoTruco = (() => {
  const clips = {
    inicio30: { archivo: "inicio-30", texto: "¡Está todo listo! Arranca el partido a treinta." },
    inicio: { archivo: "inicio", texto: "¡Se mezclan las cartas! ¡Arranca el truco!" },
    uno: { archivo: "un-punto", texto: "¡Un puntito nomás! ¡Más miedo que cartas!" },
    cuatro: { archivo: "cuatro-puntos", texto: "¡Llegan a cuatro puntos! ¡Se mueve el tanteador!" },
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
    if (puntos === objetivo - 1) return "ultimo";
    if (puntos >= objetivo - 5 && antes[equipo] < objetivo - 5) return "rectaFinal";
    if (objetivo === 30 && antes[equipo] <= 15 && puntos > 15) return "buenas";
    if (diferencia > 0 && diferenciaAnterior <= 0 &&
        historial.some((mano) => mano[equipo] < mano[otro])) return "remontada";
    if (diferencia === 0 && puntos >= 3) return "empate";
    if (diferencia >= 3 && diferenciaAnterior < 3) return "ventaja";
    if (diferencia === -1 && diferenciaAnterior <= -2) return "volvieron";
    if (diferencia === -3 && diferenciaAnterior <= -4) return "descuentan";
    if (puntos === 4) return "cuatro";
    if (puntos === 1) return "uno";
    return null;
  }

  return { clips, elegir };
})();
