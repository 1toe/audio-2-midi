# Tareas · Fase 2 · Canción completa

Objetivo: que CU-04 funcione. El servidor solo separa pistas; la transcripción sigue en el navegador. Duración estimada: 2 a 3 semanas.

Antes de empezar se cierran dos decisiones de `docs/08-decisiones-abiertas.md`: dónde se aloja el servidor y cuánto presupuesto tiene.

## Servicio de separación

- [ ] T2.1 Crear el servicio en `servidor/` con Python y FastAPI.
- [ ] T2.2 Ruta para subir un audio y crear un trabajo. Devuelve un identificador.
- [ ] T2.3 Ruta para consultar el estado del trabajo: en cola, procesando, listo o fallido, con tiempo estimado.
- [ ] T2.4 Ruta para descargar cada pista separada.
- [ ] T2.5 Cola de trabajos con un solo trabajador al inicio.
- [ ] T2.6 Convertir el audio de entrada con ffmpeg cuando haga falta.
- [ ] T2.7 Separar con Demucs y entregar voz, bajo y resto. La batería se descarta.
- [ ] T2.8 Rechazar archivos de más de 10 minutos o demasiado pesados.
- [ ] T2.9 Borrado automático del audio y de las pistas a más tardar 1 hora después.
- [ ] T2.10 Revisar la licencia del código y de los pesos de Demucs y anotarla en `registro-licencias.md`.

## H7 · Separar las pistas (aplicación web)

- [ ] T2.11 Activar la opción canción completa en el selector.
- [ ] T2.12 Aviso de que el audio va a un servidor y se borra en 1 hora, con aceptación del usuario.
- [ ] T2.13 Enviar el audio y mostrar el estado de la cola con el tiempo estimado.
- [ ] T2.14 Reproductor para escuchar cada pista separada.
- [ ] T2.15 Mensajes de error con opción de reintentar o de pasar a track solo.

## H8 · Elegir qué pistas transcribir

- [ ] T2.16 Casillas para marcar pistas. Convertir queda desactivado si no hay ninguna marcada.
- [ ] T2.17 Transcribir cada pista marcada con el mismo Worker de la fase 1.
- [ ] T2.18 Generar un archivo MIDI con una pista por cada pista elegida.
- [ ] T2.19 Omitir y avisar cuando una pista marcada no tiene notas.
- [ ] T2.20 Cambiar la selección y regenerar sin separar de nuevo.

## Cierre de la fase

- [ ] T2.21 Desplegar el servicio.
- [ ] T2.22 Medir tiempo y costo por canción con el set. La señal de alerta del riesgo R3 es más de 5 minutos de espera.
- [ ] T2.23 Comprobar el borrado del audio después de procesar.
- [ ] T2.24 Pasar las 10 canciones del set y puntuar la melodía.
- [ ] T2.25 Actualizar el texto de privacidad de la página para los dos modos.

## Puerta 3

- [ ] Al menos 6 de 10 canciones con melodía reconocible.

Si no se cumple, el producto queda como track solo y se pasa igual a la fase 3.
