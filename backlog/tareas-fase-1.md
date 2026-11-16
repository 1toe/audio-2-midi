# Tareas · Fase 1 · MVP en navegador

Objetivo: que CU-01, CU-02 y CU-03 funcionen de punta a punta para un track solo, sin servidor. Duración estimada: 1 a 2 semanas.

## Base del proyecto

- [ ] T1.1 Crear el proyecto web en `web/` con Vite y TypeScript.
- [ ] T1.2 Fijar las versiones de basic-pitch-ts, TensorFlow.js, Tone.js y @tonejs/midi, y anotar sus licencias en `registro-licencias.md`.
- [ ] T1.3 Publicar una página vacía en el hosting elegido, para probar el despliegue desde el primer día.

## H1 · Subir un audio

- [ ] T1.4 Zona para arrastrar un archivo y botón para elegirlo.
- [ ] T1.5 Decodificar el archivo con Web Audio API y mostrar nombre y duración.
- [ ] T1.6 Mensaje cuando el archivo no se puede leer, con los formatos aceptados.
- [ ] T1.7 Límite de 10 minutos, con mensaje.

## H2 · Indicar el tipo de audio

- [ ] T1.8 Selector con track solo marcado y canción completa como próximamente.

## H3 · Transcribir a notas

- [ ] T1.9 Convertir el audio a mono y 22.050 Hz, que es lo que espera Basic Pitch.
- [ ] T1.10 Cargar el modelo de basic-pitch-ts dentro de un Web Worker.
- [ ] T1.11 Correr el modelo y reportar el avance en porcentaje a la página.
- [ ] T1.12 Convertir la salida del modelo en notas con las funciones del paquete. Los nombres exactos se toman del README del repositorio.
- [ ] T1.13 Botón Cancelar que detiene el Worker y conserva el audio cargado.
- [ ] T1.14 Aviso cuando no se detectan notas.
- [ ] T1.15 Guardar la salida del modelo en memoria, para regenerar en la fase 3 sin correrlo de nuevo.

## H4 · Escuchar con sonido de piano

- [ ] T1.16 Reproductor del MIDI con Tone.js y muestras de piano.
- [ ] T1.17 Reproductor del audio original.
- [ ] T1.18 Alternar entre MIDI y original manteniendo la posición.
- [ ] T1.19 Reproducir, pausar y barra de posición. Manejar el bloqueo de sonido del navegador hasta el primer toque.

## H5 · Descargar el archivo .mid

- [ ] T1.20 Generar el archivo con @tonejs/midi a partir de las notas.
- [ ] T1.21 Descarga con el nombre del audio y extensión .mid.
- [ ] T1.22 Probar el archivo en dos programas MIDI y comparar su duración con la del audio.

## H6 · Privacidad del audio

- [ ] T1.23 Línea visible antes de subir: el audio se procesa en tu equipo y no se envía.
- [ ] T1.24 Comprobar en las herramientas de desarrollador que ninguna petición lleva el audio.

## Cierre de la fase

- [ ] T1.25 Pasar los 10 tracks solos del set por la aplicación y puntuarlos.
- [ ] T1.26 Probar un audio de 10 minutos en un teléfono Android.
- [ ] T1.27 Probar en Chrome y Edge de escritorio y en Chrome de Android.
- [ ] T1.28 Revisar la definición de terminado de `docs/06-checks-y-calidad.md` para H1 a H6.

## Puerta 2

- [ ] Los checks de la fase 1 están cumplidos.
- [ ] El MVP se usa sin problemas en escritorio y en teléfono.
