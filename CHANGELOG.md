# Historial de versiones

## Sin versionar

## 0.4.0 · 2026-11-16

- Commit de producción: [`3d70e29c3b0f15feb80877f0d1ea44e6a6428b9e`](https://github.com/1toe/audio-a-midi/commit/3d70e29c3b0f15feb80877f0d1ea44e6a6428b9e).
- Referencia: [`release/v0.4.0`](https://github.com/1toe/audio-a-midi/tree/release/v0.4.0).
- Teclado con notas descendentes sincronizado con el MIDI y vista de línea de tiempo.
- Tablatura de guitarra por pista, con tiempos, descarga de texto y aviso de notas que no caben en la digitación.

## 0.3.0 · 2026-11-15

- Commit de producción: [`39ac69b37ed406d8f1be6bb188ccb4910c9a0376`](https://github.com/1toe/audio-a-midi/commit/39ac69b37ed406d8f1be6bb188ccb4910c9a0376).
- Referencia: [`release/v0.3.0`](https://github.com/1toe/audio-a-midi/tree/release/v0.3.0).
- Etapas de conversión, porcentaje, tiempo transcurrido y aviso al recargar durante el trabajo.
- Errores con instrucciones para reintentar y recuperación si el Worker deja de responder.
- Menos copias al preparar el audio y empaquetar las predicciones. La medición comparativa se sigue en T1.33.

## 0.2.0 · 2026-11-15

- Commit de producción: [`0387b9dce03483ba353c3d979a2794705f335b98`](https://github.com/1toe/audio-a-midi/commit/0387b9dce03483ba353c3d979a2794705f335b98).
- [Producción](https://audio-a-midi.vercel.app/) verificada con la portada, el manifiesto de Basic Pitch y los pesos en HTTP 200. La conversión con audio queda por validar.
- Referencia GitHub: rama [`release/v0.2.0`](https://github.com/1toe/audio-a-midi/tree/release/v0.2.0).
- Instalación reproducible de la web con `package-lock.json` y `npm ci`.
- Preparación de la web para Vercel bajo `1toe`. El modo canción completa se habilita al configurar el servicio de separación.
- La transcripción puede reintentar la carga del modelo después de un fallo de red.
- El botón Cancelar detiene la carga o la separación de una canción. Al cambiar de audio o modo, se solicita eliminar las pistas temporales.
- Si la web no puede conectar con el servicio de separación, muestra cómo continuar con una pista aislada.
- Claude Code importa las reglas compartidas desde `AGENTS.md`. El backlog registra el SHA de implementación y el enlace a la evidencia de aceptación.
- Registro de licencias alineado con las dependencias directas de la web y el servidor.
- Flujo de seguimiento con commits verificables, estado de historias y reglas compartidas para los agentes. [Registro de avances](docs/registro-avances.md).

## 0.1.0 · 2026-11-15

- Commit de la versión: [`389145b`](https://github.com/1toe/audio-a-midi/commit/389145bf7903ec98728d9a2b2d4e2eda919ec012) (`389145bf7903ec98728d9a2b2d4e2eda919ec012`).
- Referencia GitHub: rama [`release/v0.1.0`](https://github.com/1toe/audio-a-midi/tree/release/v0.1.0).
- Estado: implementación disponible en el repositorio, con compilación, validación con audios y despliegue pendientes.

- Conversión de pistas aisladas a MIDI con Basic Pitch en el navegador.
- Separación de canciones con Demucs y selección de voz, bajo y resto.
- Reproducción sincronizada del audio original y del piano sintetizado.
- Descarga MIDI, piano roll y regeneración con ajustes de sensibilidad y limpieza.
- Conversor por lote y mediciones en CSV para la prueba de concepto.
