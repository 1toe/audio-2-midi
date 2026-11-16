# Tareas · Fase 0 · Prueba de concepto

Objetivo: saber en 1 a 2 días si Basic Pitch da un MIDI reconocible con tracks solos, antes de programar la aplicación. Los pasos con comandos están en `fase-0/README.md`.

## Tareas

- [ ] T0.1 Reunir los 10 tracks solos: 4 de piano, 3 de guitarra y 3 de voz. Guardarlos en `fase-0/audios/tracks-solos/`.
- [ ] T0.2 Reunir las 10 canciones completas de géneros distintos. Guardarlas en `fase-0/audios/canciones/`.
- [ ] T0.3 Anotar los 20 archivos en `fase-0/puntajes.csv`.
- [ ] T0.4 Instalar Basic Pitch en un entorno de Python.
- [x] T0.10 Preparar el conversor WAV y registrar duración, tiempo y errores. [`81681e1`](https://github.com/walter-cataldo/audio-a-midi/commit/81681e115123996c50512b0cc93f35cb9d89d188).
- [ ] T0.5 Correr Basic Pitch sobre los 10 tracks solos y medir el tiempo de cada uno.
- [ ] T0.6 Escuchar cada MIDI y ponerle nota de 1 a 5 en `puntajes.csv`.
- [ ] T0.7 Medir el tiempo de proceso de un audio de 4 minutos.
- [ ] T0.8 Recomendado: separar 2 o 3 canciones con Demucs y medir cuánto tarda, para anticipar el riesgo R3.
- [ ] T0.9 Recomendado: transcribir la pista de voz separada de esas canciones y puntuarla, como adelanto de la puerta 3.

## Puerta 1

- [ ] Al menos 8 de 10 tracks solos con nota 4 o más.
- [ ] Un audio de 4 minutos se procesa en menos de 2 minutos.

Registra el resultado antes de validar la fase 0. Si el umbral de calidad no se cumple, prueba Transkun para piano o ajusta Basic Pitch y vuelve a puntuar.
