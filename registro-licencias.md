# Registro de licencias

Registro de dependencias directas, herramientas del entorno y modelos. Las columnas distinguen la licencia declarada por el código de las condiciones de los pesos. Las versiones directas se definen en `web/package.json`, `fase-0/requirements.txt` y `servidor/requirements.txt`.

| Dependencia | Uso | Licencia del código |
| --- | --- | --- |
| [Basic Pitch 0.4.0](https://pypi.org/project/basic-pitch/0.4.0/) | Transcripción por lote | Apache-2.0 |
| [@spotify/basic-pitch 1.0.1](https://github.com/spotify/basic-pitch-ts/blob/v1.0.1/LICENSE) | Transcripción en el navegador | Apache-2.0 |
| [TensorFlow.js 3.21.0](https://github.com/tensorflow/tfjs/blob/tfjs-v3.21.0/LICENSE) | Inferencia en el navegador | Apache-2.0 |
| [midi-file 1.2.4](https://github.com/carter-thaxton/midi-file/blob/master/package.json) | Escritura MIDI | MIT según el manifiesto del paquete |
| [Vite 6.4.1](https://github.com/vitejs/vite/blob/v6.4.1/LICENSE) | Construcción de la web | MIT |
| [TypeScript 5.9.3](https://github.com/microsoft/TypeScript/blob/v5.9.3/LICENSE.txt) | Comprobación de tipos | Apache-2.0 |
| [FastAPI 0.115.12](https://github.com/fastapi/fastapi/blob/0.115.12/LICENSE) | API de separación | MIT |
| [Uvicorn 0.34.2](https://github.com/Kludex/uvicorn/blob/0.34.2/LICENSE.md) | Servidor ASGI | BSD-3-Clause |
| [Demucs 4.0.1](https://pypi.org/project/demucs/4.0.1/) | Separación de pistas | MIT |
| [PyTorch 2.5.1](https://github.com/pytorch/pytorch/blob/v2.5.1/LICENSE) | Inferencia de Demucs | BSD-3-Clause para el código principal. El archivo de licencia identifica componentes adicionales. |
| [TorchAudio 2.5.1](https://github.com/pytorch/audio/blob/v2.5.1/LICENSE) | Audio de Demucs | BSD-2-Clause |
| [FFmpeg y FFprobe](https://ffmpeg.org/legal.html) | Detección y conversión de formatos | LGPL o GPL según el binario instalado. Pendiente identificar el binario del servidor. |
| Web Audio API | Piano sintetizado y reproducción | API del navegador |
| [Transkun](https://github.com/Yujia-Yan/Transkun) | Alternativa opcional para piano | MIT |

## Pesos de los modelos

| Modelo | Estado |
| --- | --- |
| Basic Pitch (Python y navegador) | Pendiente verificar los términos de los pesos incluidos. |
| Demucs (`htdemucs`) | Pendiente verificar los términos de los pesos descargados por el servidor. |
