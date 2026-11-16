# Tareas · Fase 2 · Canción completa

Implementación registrada en [`389145b`](https://github.com/walter-cataldo/audio-a-midi/commit/389145bf7903ec98728d9a2b2d4e2eda919ec012). Las casillas de código indican cambios presentes en GitHub. La aceptación sigue pendiente.

Objetivo: que CU-04 funcione. El servidor solo separa pistas; la transcripción sigue en el navegador. Duración estimada: 2 a 3 semanas.

Antes de desplegar quedan abiertas dos decisiones de `docs/08-decisiones-abiertas.md`: dónde se aloja el servidor y cuánto presupuesto tiene.

## Servicio de separación

- [x] T2.1 Crear el servicio en `servidor/` con Python y FastAPI.
- [x] T2.2 Ruta para subir un audio y crear un trabajo. Devuelve un identificador.
- [x] T2.3 Ruta para consultar el estado del trabajo: en cola, procesando, listo o fallido, con tiempo estimado.
- [x] T2.4 Ruta para descargar cada pista separada.
- [x] T2.5 Cola de trabajos con un solo trabajador al inicio.
- [x] T2.6 Convertir el audio de entrada con ffmpeg cuando haga falta.
- [x] T2.7 Separar con Demucs y entregar voz, bajo y resto. La batería se descarta.
- [x] T2.8 Rechazar archivos de más de 10 minutos o demasiado pesados.
- [x] T2.9 Borrado automático del audio y de las pistas a más tardar 1 hora después.
- [ ] T2.10 Revisar la licencia del código y de los pesos de Demucs y anotarla en `registro-licencias.md`.

## H7 · Separar las pistas (aplicación web)

- [x] T2.11 Activar la opción canción completa en el selector.
- [x] T2.12 Aviso de que el audio va a un servidor y se borra en 1 hora, con aceptación del usuario.
- [x] T2.13 Enviar el audio y mostrar el estado de la cola con el tiempo estimado.
- [x] T2.14 Reproductor para escuchar cada pista separada.
- [x] T2.15 Mensajes de error con opción de reintentar o de pasar a track solo.

## H8 · Elegir qué pistas transcribir

- [x] T2.16 Casillas para marcar pistas. Convertir queda desactivado si no hay ninguna marcada.
- [x] T2.17 Transcribir cada pista marcada con el mismo Worker de la fase 1.
- [x] T2.18 Generar un archivo MIDI con una pista por cada pista elegida.
- [x] T2.19 Omitir y avisar cuando una pista marcada no tiene notas.
- [x] T2.20 Cambiar la selección y regenerar sin separar de nuevo.

## Cierre de la fase

- [ ] T2.21 Desplegar el servicio.
- [ ] T2.22 Medir tiempo y costo por canción con el set. La señal de alerta del riesgo R3 es más de 5 minutos de espera.
- [ ] T2.23 Comprobar el borrado del audio después de procesar.
- [ ] T2.24 Pasar las 10 canciones del set y puntuar la melodía.
- [x] T2.25 Actualizar el texto de privacidad de la página para los dos modos.
- [x] T2.26 Permitir cancelar la carga o la separación y liberar los archivos que ya no se usan.
- [ ] T2.27 Verificar cancelación durante la carga, en cola y durante el procesamiento. Comprobar limpieza y continuidad de la cola.

## Puerta 3

- [ ] Al menos 6 de 10 canciones con melodía reconocible.

Si no se cumple, el producto queda como track solo y se pasa igual a la fase 3.
