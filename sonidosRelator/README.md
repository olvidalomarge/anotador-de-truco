# Audios del relator

El relator espera 1,5 segundos desde el último toque y decide sobre la cantidad completa de la mano. Cambiar de equipo durante la espera reemplaza la anotación pendiente: nunca mezcla puntos de ambos equipos. Restar, deshacer, silenciar, desactivar el relator o iniciar otra partida cancela el anuncio pendiente.

## Prioridades y avance

1. Victoria: conservar el festejo actual, sin otro relato.
2. Punto de partido: quedar en 14 o 29.
3. Remontada: llegar a 11 o más, pasar al frente y haber estado al menos tres abajo en la recuperación actual. El audio intenso requiere cinco abajo. Un empate intermedio no interrumpe la recuperación; volver a liderar sí la reinicia.
4. Empate: cinco a cinco tiene audio específico. Desde seis, empate normal; «otra vez» exige un empate anterior. «Se borró la diferencia» requiere superar diez y recuperar al menos tres.
5. Recta final: primera entrada a diez en partidas a quince, o veinticinco en partidas a treinta. Buenas: cruzar de quince o menos a dieciséis o más, solo a treinta, siguiendo la etapa actual de la app.
6. Primeros puntos de Ellos desde cero a cero.
7. Comentarios habituales, separados por tres manos: escapada (superar diez y alcanzar seis de ventaja), regreso (superar diez, recuperar desde cinco abajo y quedar a uno o dos), a tiro (superar diez, desde tres abajo a uno o dos), ventaja (desde seis, alcanzar tres de ventaja), descuento (desde seis, achicar y seguir a tres o más), partidazo (ambos superan diez, diferencia hasta dos y al menos dos empates/cambios de liderazgo previos).
8. Cantidad de la mano: uno, dos, tres o cuatro, a cualquier altura del marcador. Si no hay clip de la cantidad ni contexto elegible, no se inventa un relato.

Los momentos importantes no esperan el descanso de los comentarios habituales. Las variantes usan una bolsa aleatoria: todas se ofrecen antes de repetir, evitando repetir inmediatamente dentro de una categoría. A quince se utiliza únicamente el inicio genérico; a treinta se alternan ambos inicios.

## Inventario de 27 MP3

| Archivos | Uso |
| --- | --- |
| `inicio.mp3`, `inicio-30.mp3` | Inicio genérico / a treinta |
| `primeros-ellos.mp3` | Ellos inaugura el marcador |
| `un-punto.mp3`, `un-punto-jubilado.mp3`, `un-punto-amague.mp3` | +1 en la mano |
| `dos-puntos.mp3` | +2 en la mano |
| `tres-puntos.mp3` | +3 en la mano |
| `cuatro-de-una.mp3`, `cuatro-redondita.mp3` | +4 en la mano |
| `cuatro-puntos.mp3` | Reservado: «llegan a cuatro» es ambiguo entre cantidad y total |
| `empate-normal.mp3`, `empate-otra-vez.mp3`, `empate-diferencia.mp3` | Empate según antecedentes y magnitud |
| `cinco-a-cinco.mp3` | Exactamente 5–5, nunca +5 |
| `remontada.mp3`, `remontada-fuerte.mp3` | Recuperación de tres / cinco o más |
| `descuentan.mp3`, `a-tiro.mp3`, `volvieron.mp3` | Recuperación sin alcanzar el empate |
| `ventaja.mp3`, `escapan.mp3` | Ventaja de tres / seis |
| `empate.mp3`, `partidazo.mp3` | «Palo y palo» / «Qué partidazo», partido parejo avanzado |
| `buenas.mp3`, `recta-final.mp3`, `ultimo-punto.mp3` | Etapas y punto de partido |

Se copiaron los MP3 originales de la carpeta «mariano closs», sin modificar sus contenidos. Las etiquetas se basan en los nombres aportados; no constituyen transcripciones verificadas. El antiguo `empate.mp3` es «Palo y palo», y el antiguo `cuatro-puntos.mp3` queda reservado.

Para agregar variantes, guardar el MP3 y declarar un clip en `relator.js`. Las cantidades comparten `cantidad`; los otros eventos se agrupan en `opciones`. Incluir cada archivo en `ARCHIVOS` de `sw.js` y actualizar `CACHE` para uso sin conexión.

Malharry controla exclusivamente el efecto al sumar de MAX PAWER y mantiene su ajuste independiente del relator y del silencio general.

Validación: `node tests/relator.test.cjs`.
