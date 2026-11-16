# Historial de versiones

## Sin versionar

- El botón Cancelar detiene la carga o la separación de una canción. Al cambiar de audio o modo, se solicita eliminar las pistas temporales.
- Si la web no puede conectar con el servicio de separación, muestra cómo continuar con una pista aislada.
- Claude Code importa las reglas compartidas desde `AGENTS.md`. El backlog registra el SHA de implementación y el enlace a la evidencia de aceptación.
- Registro de licencias alineado con las dependencias directas de la web y el servidor.
- Flujo de seguimiento con commits verificables, estado de historias y reglas compartidas para los agentes. [Registro de avances](docs/registro-avances.md).

## 0.1.0 · 2026-11-15

- Commit de la versión: [`389145b`](https://github.com/walter-cataldo/audio-a-midi/commit/389145bf7903ec98728d9a2b2d4e2eda919ec012) (`389145bf7903ec98728d9a2b2d4e2eda919ec012`).
- Referencia GitHub: rama [`release/v0.1.0`](https://github.com/walter-cataldo/audio-a-midi/tree/release/v0.1.0).
- Estado: implementación disponible en el repositorio, con compilación, validación con audios y despliegue pendientes.

- Conversión de pistas aisladas a MIDI con Basic Pitch en el navegador.
- Separación de canciones con Demucs y selección de voz, bajo y resto.
- Reproducción sincronizada del audio original y del piano sintetizado.
- Descarga MIDI, piano roll y regeneración con ajustes de sensibilidad y limpieza.
- Conversor por lote y mediciones en CSV para la prueba de concepto.
