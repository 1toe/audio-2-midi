# 06 · Checks y calidad

Cada fase se cierra solo cuando pasa sus checks contra un set fijo de 20 audios de prueba.

## Set de prueba

El set se arma una vez y no cambia: 10 tracks solos (4 de piano, 3 de guitarra y 3 de voz) y 10 canciones completas de géneros distintos. Así cada versión se compara contra lo mismo. La lista vive en `fase-0/puntajes.csv`.

## Definición de terminado

Vale para cualquier historia:

- [ ] Cumple su criterio de aceptación.
- [ ] Probada con los audios del set que le corresponden.
- [ ] Funciona en Chrome y Edge de escritorio y en Chrome de Android.
- [ ] Sin errores en la consola del navegador.
- [ ] Licencia de cada dependencia nueva revisada y anotada.

## Checks por fase

Fase 0, prueba de concepto:

- [ ] Set de 20 audios reunido.
- [ ] Basic Pitch corrido sobre los 10 tracks solos.
- [ ] Cada MIDI escuchado y puntuado de 1 a 5 en qué tan reconocible es.
- [ ] Tiempo de proceso medido para un audio de 4 minutos.

Fase 1, MVP en navegador:

- [ ] Historias H1 a H6 terminadas.
- [ ] Al menos 8 de 10 tracks solos con nota 4 o más.
- [ ] Un audio de 10 minutos termina sin agotar la memoria en el teléfono.
- [ ] El archivo .mid abre en dos programas MIDI.

Fase 2, canción completa:

- [ ] Historias H7 y H8 terminadas.
- [ ] Al menos 6 de 10 canciones con melodía reconocible.
- [ ] Tiempo y costo por canción medidos en el servidor.
- [ ] Borrado del audio comprobado después de procesar.

Fase 3, pulido:

- [ ] Historias H9 a H11 terminadas.
- [ ] Tres personas que no conocen el proyecto logran subir un audio y bajar el MIDI sin ayuda.

## Métricas

Se siguen en todas las fases:

| Métrica | Cómo se mide |
| --- | --- |
| Reconocibilidad | Nota de 1 a 5 al escuchar el MIDI: 1 no se reconoce, 3 se reconoce con errores evidentes, 5 se reconoce sin errores que molesten |
| Tiempo de proceso | Segundos de proceso por minuto de audio |
| Fallos | Porcentaje de archivos del set que no terminan |
