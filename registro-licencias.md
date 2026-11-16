# Registro de licencias

Toda dependencia se anota aquí antes de usarla. Una licencia distinta de MIT o Apache-2.0 es señal de alerta (riesgo R7) y se revisa antes de seguir.

Estado al 15 de noviembre de 2026. Verificada significa leída de la API de GitHub ese día. Por confirmar significa anotada de memoria, sin revisar.

| Dependencia | Uso | Fase | Licencia del código | Estado |
| --- | --- | --- | --- | --- |
| [Basic Pitch 0.4.0](https://pypi.org/project/basic-pitch/0.4.0/) | Transcripción en Python | 0 | Apache-2.0 | Verificada |
| [basic-pitch-ts](https://github.com/spotify/basic-pitch-ts) | Transcripción en el navegador | 1 | Apache-2.0 | Verificada |
| [Transkun](https://github.com/Yujia-Yan/Transkun) | Alternativa para piano | Opcional | MIT | Verificada |
| TensorFlow.js | Motor que usa basic-pitch-ts | 1 | Apache-2.0 | Por confirmar |
| [Tone.js](https://github.com/Tonejs/Tone.js) | Sonido de piano | 1 | MIT | Por confirmar |
| [@tonejs/midi](https://github.com/Tonejs/Midi) | Escritura del .mid | 1 | MIT | Por confirmar |
| Vite | Proyecto web | 1 | MIT | Por confirmar |
| Muestras de piano | Sonido del reproductor | 1 | Por definir | Falta elegir |
| [Demucs](https://github.com/adefossez/demucs) | Separación de pistas | 2 | MIT | Por confirmar |
| FastAPI | Servicio de separación | 2 | MIT | Por confirmar |
| ffmpeg | Conversión de formatos | 2 | LGPL o GPL según la compilación | Por confirmar |

## Pesos de los modelos

El código abierto no garantiza que los pesos del modelo se puedan usar con fines comerciales. Se revisa por separado.

| Modelo | Licencia de los pesos | Estado |
| --- | --- | --- |
| Basic Pitch | Por revisar | Pendiente antes de la fase 1 |
| Demucs | Por revisar | Pendiente antes de la fase 2 |
