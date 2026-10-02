# Audios del relator

El relator espera 1,5 segundos desde el último punto anotado. Los toques consecutivos forman una mano: compara el marcador anterior al primer toque con el marcador final. Corregir, deshacer, silenciar, desactivar el relator o iniciar otra partida cancela lo pendiente.

Los audios de cantidades tienen prioridad y se pueden repetir en cada mano, a cualquier altura de la partida. «Un puntito» corresponde a sumar uno; el audio de cuatro corresponde a sumar cuatro en la misma mano, aunque el marcador pase de siete a once. Llegar a un total de cuatro sumando uno no dispara el audio de cuatro.

Si no hay un clip para la cantidad sumada, se evalúan las situaciones del marcador (último punto, buenas, remontada, empate, etc.). Al alcanzar el objetivo, se mantiene el festejo de victoria.

Para añadir un audio de dos puntos:

1. Guardar el MP3 como `sonidosRelator/dos-puntos.mp3`.
2. Añadir dentro de `clips`, en `relator.js`:

   ```js
   dos: { archivo: "dos-puntos", texto: "¡Dos puntos!", cantidad: 2 },
   ```

3. Añadir `"./sonidosRelator/dos-puntos.mp3"` a `ARCHIVOS` en `sw.js` y subir la versión de `CACHE` para tenerlo disponible sin conexión.

Se pueden incorporar otras cantidades de la misma manera. No hay que modificar la espera ni el agrupador.

El botón Malharry controla solamente el efecto al sumar de MAX PAWER. Su estado se guarda de forma independiente del relator y del silencio general.
