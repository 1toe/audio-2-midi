# Tareas · Fase 3 · Pulido

Implementación registrada en [`389145b`](https://github.com/1toe/audio-a-midi/commit/389145bf7903ec98728d9a2b2d4e2eda919ec012). Las casillas de código indican cambios presentes en GitHub. La aceptación sigue pendiente.

Objetivo: que CU-05 funcione y que CU-02 sume el piano roll. Duración estimada: 1 semana.

## H9 · Ajustar la sensibilidad y regenerar

- [x] T3.1 Controles de umbral de notas y duración mínima.
- [x] T3.2 Botón Regenerar que recalcula las notas desde la salida guardada del modelo, sin correrlo de nuevo.
- [x] T3.3 Botón Restablecer con los valores iniciales.
- [x] T3.4 Conservar el resultado anterior cuando el nuevo no tiene notas.

## H10 · Limpiar las notas

- [x] T3.5 Estimar el tempo a partir de los comienzos de las notas y usar 120 BPM si hay poca información.
- [x] T3.6 Cuantizar las notas al tempo.
- [x] T3.7 Limitar las notas a las 88 teclas del piano, notas MIDI 21 a 108.
- [x] T3.8 Fundir notas repetidas muy seguidas.
- [x] T3.9 Un interruptor por cada limpieza. Con las tres apagadas el MIDI es igual a la transcripción directa.

## H11 · Ver las notas en un piano roll

- [x] T3.10 Dibujar las notas por tiempo y altura.
- [x] T3.11 Cursor que avanza con la reproducción.
- [x] T3.12 Tocar un punto mueve la reproducción a ese momento.

- [x] T3.16 Añadir teclado animado con notas descendentes y conservar la línea de tiempo.
- [x] T3.17 Generar tablatura por pista MIDI en afinación estándar y mostrar las notas que quedan fuera de la digitación.
- [ ] T3.18 Comparar la tablatura con grabaciones y digitaciones de referencia, incluyendo acordes y arpegios.

## Cierre de la fase

- [ ] T3.13 Repetir el set completo y comparar las notas con las de las fases 1 y 2.
- [ ] T3.14 Prueba con tres personas que no conocen el proyecto: suben un audio y bajan el MIDI sin ayuda.
- [ ] T3.15 Revisar la definición de terminado para H9 a H11.
