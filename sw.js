const CACHE = "truco-v21";
// Los fondos NO se listan acá: la lista es dinámica (carpeta "fondos/") y
// se cachean solos la primera vez que se muestran. Si se listara un archivo
// que ya no existe, la instalación del service worker fallaría entera.
// La botonera tiene tres audios fijos, incluidos para usarlos sin conexión.
const ARCHIVOS = [
  "./",
  "./index.html",
  "./relator.js?v=19",
  "./gestos.js?v=20",
  "./sonidosBotonera/OMG.mp3",
  "./sonidosBotonera/What%20The%20Hell.mp3",
  "./sonidosBotonera/keke.ogg",
  "./sonidosRelator/inicio-30.mp3",
  "./sonidosRelator/inicio.mp3",
  "./sonidosRelator/un-punto.mp3",
  "./sonidosRelator/cuatro-puntos.mp3",
  "./sonidosRelator/empate.mp3",
  "./sonidosRelator/partidazo.mp3",
  "./sonidosRelator/ventaja.mp3",
  "./sonidosRelator/descuentan.mp3",
  "./sonidosRelator/volvieron.mp3",
  "./sonidosRelator/remontada.mp3",
  "./sonidosRelator/buenas.mp3",
  "./sonidosRelator/recta-final.mp3",
  "./sonidosRelator/ultimo-punto.mp3",
  "./sonidosRelator/primeros-ellos.mp3",
  "./sonidosRelator/un-punto-jubilado.mp3",
  "./sonidosRelator/un-punto-amague.mp3",
  "./sonidosRelator/dos-puntos.mp3",
  "./sonidosRelator/tres-puntos.mp3",
  "./sonidosRelator/cuatro-de-una.mp3",
  "./sonidosRelator/cuatro-redondita.mp3",
  "./sonidosRelator/empate-normal.mp3",
  "./sonidosRelator/empate-otra-vez.mp3",
  "./sonidosRelator/empate-diferencia.mp3",
  "./sonidosRelator/cinco-a-cinco.mp3",
  "./sonidosRelator/escapan.mp3",
  "./sonidosRelator/a-tiro.mp3",
  "./sonidosRelator/remontada-fuerte.mp3",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./sonidos/punto.m4a",
  "./sonidos/punto.mp3",
  "./sonidos/victoria.m4a",
  "./sonidos/victoria.mp3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: red primero, cache como respaldo (así las actualizaciones llegan rápido).
// Al abrir la página (navegación) se saltea también el caché HTTP del navegador,
// para que la versión nueva llegue apenas se publica y no 10 minutos después.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const pedido = e.request.mode === "navigate"
    ? fetch(e.request.url, { cache: "no-cache" })
    : fetch(e.request);
  e.respondWith(
    pedido
      .then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
