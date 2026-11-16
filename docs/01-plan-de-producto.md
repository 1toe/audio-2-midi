# 01 · Plan de producto

## Resumen

El producto convierte cualquier audio en un archivo MIDI que suena como teclado. Acepta dos entradas: una canción completa o un track ya aislado.

La decisión principal es partir por el track solo, en una página web que procesa todo en el navegador. La canción completa llega en la fase 2, porque necesita separar pistas en un servidor y es donde está el mayor riesgo de calidad.

## Metas

Metas propuestas para dar el producto por logrado:

- Track solo: el MIDI se reconoce sin editar en al menos 8 de 10 audios de prueba.
- Canción completa: la melodía se reconoce en al menos 6 de 10 canciones de prueba.
- Un audio de 4 minutos se procesa en menos de 2 minutos en un notebook común.

Las tres metas son estimaciones de partida. La fase 0 las confirma o las ajusta.

## Modos de entrada

El usuario elige el modo al subir el archivo.

| Modo | Qué subes | Qué hace el sistema | Calidad esperada |
| --- | --- | --- | --- |
| Track solo | Un instrumento o una voz aislada | Transcribe directo a notas | Alta |
| Canción completa | La mezcla con todo | Separa las pistas, eliges cuáles usar y transcribe esas | Media, depende de la separación |

## Entra en la versión 1

- Subir audio en MP3, WAV, M4A, OGG o FLAC, de hasta 10 minutos.
- Generar el MIDI y descargarlo como archivo .mid.
- Escuchar el resultado con sonido de piano y compararlo con el audio original.
- Ajustar la sensibilidad y volver a generar sin subir el archivo de nuevo.
- Ver las notas en un piano roll.

## Queda fuera de la versión 1

- Partitura y edición nota a nota.
- Batería a MIDI.
- Grabar desde el micrófono y transcripción en tiempo real.
- Cuentas de usuario e historial.
- App móvil nativa. La web debe funcionar bien en el teléfono.
