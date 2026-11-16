# 07 · Riesgos y mitigaciones

El riesgo mayor es la calidad del MIDI en canciones completas. Por eso el plan parte por el track solo y pone una puerta de decisión antes de invertir en el servidor.

| ID | Riesgo | Probabilidad | Impacto | Mitigación | Señal de alerta |
| --- | --- | --- | --- | --- | --- |
| R1 | El MIDI de una canción completa sale sucio, con notas de sobra | Alta | Alto | Separar pistas antes de transcribir, dejar elegir la pista y limpiar las notas. Si no alcanza, el producto queda como track solo. | Menos de 6 de 10 canciones reconocibles en la fase 2 |
| R2 | El resultado no suena como el usuario espera: un piano tocando todo no suena igual a la canción | Alta | Medio | Mostrar ejemplos antes de subir, comparación con el original y texto claro sobre qué esperar. | Usuarios de prueba dicen que no sirve aunque las notas estén bien |
| R3 | El servidor de la fase 2 sale caro o lento, porque separar pistas es pesado sin GPU | Media | Alto | Medir tiempo y costo en la fase 0, cola de trabajos, límite de 10 minutos por archivo. El modo track solo sigue gratis en el navegador. | Más de 5 minutos de espera por canción |
| R4 | La versión de navegador de Basic Pitch no tiene cambios desde mayo de 2023 | Media | Medio | Fijar la versión. Plan B: correr el paquete de Python en el servidor. | Falla con una versión nueva del navegador o de TensorFlow.js |
| R5 | El navegador se queda sin memoria con audios largos, sobre todo en el teléfono | Media | Medio | Procesar en un Web Worker y por tramos, con límite de duración. | Pestaña cerrada o congelada en las pruebas de 10 minutos |
| R6 | Canciones con derechos de autor subidas por otros usuarios | Media | Medio | No guardar el audio, pedir que el usuario declare que tiene derecho a usarlo y revisar los términos con un abogado si se abre al público. | Decisión de abrir el producto a terceros |
| R7 | Una dependencia o los pesos de un modelo no permiten uso comercial | Baja | Alto | Registro de licencias de código y de pesos, revisado antes de la fase 2. | Licencia distinta de MIT o Apache-2.0 |
| R8 | El alcance crece hacia partitura o edición de notas | Media | Medio | Lista de fuera de la versión 1 y puertas entre fases. | Historias nuevas sin fase asignada |
| R9 | Formatos de audio que el navegador no lee | Baja | Bajo | Mensaje claro y conversión con ffmpeg en el servidor desde la fase 2. | Fallos repetidos con un mismo formato |
