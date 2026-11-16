# 03 · Historias de usuario

Son 11 historias: 6 para el MVP, 2 que abren la fase 2 y 3 de pulido. Los criterios de aceptación usan el formato dado, cuando, entonces.

| ID | Historia | Prioridad | Fase | Caso de uso |
| --- | --- | --- | --- | --- |
| H1 | Subir un audio | Imprescindible | 1 | CU-01 |
| H2 | Indicar el tipo de audio | Imprescindible | 1 | CU-01 |
| H3 | Transcribir a notas | Imprescindible | 1 | CU-01 |
| H4 | Escuchar con sonido de piano | Imprescindible | 1 | CU-02 |
| H5 | Descargar el archivo .mid | Imprescindible | 1 | CU-03 |
| H6 | Privacidad del audio | Imprescindible | 1 | CU-01 y CU-04 |
| H7 | Separar las pistas | Imprescindible | 2 | CU-04 |
| H8 | Elegir qué pistas transcribir | Imprescindible | 2 | CU-04 |
| H9 | Ajustar la sensibilidad y regenerar | Importante | 3 | CU-05 |
| H10 | Limpiar las notas | Importante | 3 | CU-05 |
| H11 | Ver las notas en un piano roll | Deseable | 3 | CU-02 |

## Fase 1: MVP con track solo

Seis historias dejan funcionando el recorrido completo para un track solo, todo en el navegador.

### H1 · Subir un audio

Como usuario, quiero subir un audio arrastrándolo o eligiéndolo desde mi equipo, para empezar sin instalar nada.

- Dado un archivo MP3, WAV, M4A, OGG o FLAC de hasta 10 minutos, cuando lo subo, entonces veo su nombre y su duración.
- Dado un archivo que no se puede leer, cuando lo subo, entonces veo un mensaje con los formatos aceptados.
- Dado un archivo de más de 10 minutos, cuando lo subo, entonces veo el límite y no se procesa.

### H2 · Indicar el tipo de audio

Como usuario, quiero indicar si mi audio es un track solo o una canción completa, para que el sistema lo procese del modo correcto.

- Dado un audio cargado, cuando todavía no elijo, entonces track solo viene marcado.
- Dado un MVP que solo incluye la fase 1, canción completa se muestra como próximamente. En `v0.1.0`, que integra la fase 2, el selector permite canción completa y pide consentimiento antes del envío.
- Dado un audio cargado, cuando cambio la opción antes de convertir, entonces el sistema usa la opción nueva.

### H3 · Transcribir a notas

Como usuario con un track solo, quiero que el sistema lo convierta en notas, para obtener el MIDI sin transcribir a mano.

- Dado un audio cargado, cuando pulso Convertir, entonces veo el avance en porcentaje.
- Dado que el audio se está procesando, cuando uso la página, entonces sigue respondiendo y puedo cancelar.
- Dado un audio en silencio o con puro ruido, cuando termina el proceso, entonces veo un aviso en vez de un MIDI vacío.

### H4 · Escuchar con sonido de piano

Como usuario, quiero escuchar el MIDI con sonido de piano y alternarlo con el audio original, para juzgar si quedó bien.

- Dado un resultado listo, cuando pulso reproducir, entonces suena con piano y puedo pausar y mover la posición.
- Dado que está sonando el MIDI, cuando cambio al original, entonces la reproducción sigue en el mismo punto.

### H5 · Descargar el archivo .mid

Como usuario, quiero descargar el resultado como archivo .mid, para usarlo en mi teclado o en mi programa de música.

- Dado un resultado listo, cuando pulso Descargar, entonces recibo un archivo con el nombre del audio y extensión .mid.
- Dado el archivo descargado, cuando lo abro en dos programas MIDI distintos, entonces suena en ambos.
- Dado el archivo descargado, cuando comparo su duración con la del audio, entonces difieren en menos de 1 segundo.

### H6 · Privacidad del audio

Como usuario, quiero que mi audio no se guarde, para subir material propio con tranquilidad.

- Dado el modo track solo, cuando convierto un audio, entonces ninguna petición de red lleva el audio.
- Dado el modo canción completa, cuando termina el proceso, entonces el audio y las pistas se borran del servidor a más tardar 1 hora después.
- Dado cualquier modo, cuando miro la página antes de subir, entonces una línea dice dónde se procesa el audio.

## Fase 2: canción completa

Dos historias agregan el modo canción completa, que es el único que usa un servidor.

### H7 · Separar las pistas

Como usuario con una canción completa, quiero que el sistema la separe en pistas, para transcribir solo la parte que me interesa.

- Dada una canción subida, cuando termina la separación, entonces recibo voz, bajo y resto, y puedo escuchar cada una.
- Dado que la canción está en cola, cuando espero, entonces veo el estado y un tiempo estimado.
- Dado un fallo del servidor, cuando ocurre, entonces veo un mensaje y puedo reintentar o subir un track solo.

### H8 · Elegir qué pistas transcribir

Como usuario, quiero elegir qué pistas transcribir, para que el MIDI tenga solo lo que quiero tocar.

- Dadas las pistas separadas, cuando marco una o más y convierto, entonces el MIDI incluye solo las marcadas.
- Dadas varias pistas marcadas, cuando descargo el MIDI, entonces cada una queda en una pista MIDI separada del mismo archivo.
- Dado un resultado listo, cuando cambio la selección, entonces puedo regenerar sin separar de nuevo.

## Fase 3: pulido

Tres historias mejoran el resultado y la forma de revisarlo, en los dos modos.

### H9 · Ajustar la sensibilidad y regenerar

Como usuario, quiero ajustar la sensibilidad y regenerar, para quitar notas de sobra o recuperar notas perdidas.

- Dado un resultado listo, cuando abro los ajustes, entonces puedo cambiar el umbral de notas y la duración mínima.
- Dado un ajuste cambiado, cuando pulso Regenerar, entonces obtengo un MIDI nuevo sin subir el audio otra vez.
- Dados unos ajustes cambiados, cuando pulso Restablecer, entonces vuelven los valores iniciales.

### H10 · Limpiar las notas

Como usuario, quiero que el sistema limpie las notas, para que el MIDI suene ordenado al tocarlo.

- Dado un resultado, cuando la limpieza está activa, entonces las notas se cuantizan al tempo, se limitan a 88 teclas y las repetidas se funden.
- Dadas las tres limpiezas, cuando apago una, entonces las otras dos siguen activas.
- Dadas las tres limpiezas apagadas, cuando regenero, entonces el MIDI es igual a la transcripción directa.

### H11 · Ver las notas en un piano roll

Como usuario, quiero ver las notas en un piano roll, para revisar de un vistazo qué se transcribió.

- Dado un resultado listo, cuando abro el piano roll, entonces veo las notas ordenadas por tiempo y altura.
- Dado que está sonando, cuando miro el piano roll, entonces un cursor avanza junto con la reproducción.
- Dado el piano roll abierto, cuando toco un punto, entonces la reproducción salta a ese momento.
