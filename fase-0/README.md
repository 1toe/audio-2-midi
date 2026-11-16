# Fase 0 · Prueba de concepto

Convierte los 10 tracks solos con Basic Pitch y escucha los MIDI para decidir si el proyecto pasa al MVP. Consulta el [backlog de la fase 0](../backlog/tareas-fase-0.md).

## 1. Reunir los audios

- 10 tracks solos en WAV PCM en `audios/tracks-solos/`: 4 de piano, 3 de guitarra y 3 de voz.
- 10 canciones completas en `audios/canciones/`, de géneros distintos.
- Anota cada archivo en `puntajes.csv`, en la fila de su tipo.

Conviene que duren entre 1 y 4 minutos, y que al menos uno dure 4 minutos para medir el tiempo de proceso.

## 2. Instalar y convertir

Con Python 3.11, ejecuta desde la raíz del repositorio en PowerShell.

```powershell
py -3.11 -m venv .\fase-0\.venv
.\fase-0\.venv\Scripts\python.exe -m pip install -r .\fase-0\requirements.txt
.\fase-0\.venv\Scripts\python.exe .\fase-0\convertir.py
```

Cada ejecución guarda los MIDI y `mediciones.csv` en una carpeta nueva dentro de `resultados/`. El CSV registra la duración, los segundos de proceso y el estado por archivo. El tiempo por archivo parte después de cargar el modelo. Los audios y los resultados quedan en tu equipo.

## 3. Escuchar y puntuar

Abre cada .mid con un reproductor MIDI o un programa de música, compáralo con el audio y anota en `puntajes.csv`:

- Duración del audio y tiempo de proceso, tomados de `mediciones.csv`.
- Nota de 1 a 5: 1 no se reconoce, 3 se reconoce con errores evidentes, 5 se reconoce sin errores que molesten.
- Un comentario corto: qué falló, si falló algo.

## 4. Decidir la puerta 1

- Al menos 8 de 10 tracks solos con nota 4 o más.
- Un audio de 4 minutos procesado en menos de 2 minutos.

## 5. Recomendado: adelantar la fase 2

Separa 2 o 3 canciones con Demucs para medir cuánto tarda en tu equipo. Revisa la instalación en el [README de Demucs](https://github.com/adefossez/demucs); para leer MP3 suele pedir ffmpeg instalado.

```powershell
cd fase-0
.\.venv\Scripts\python.exe -m pip install demucs
$cancion = Get-ChildItem .\audios\canciones -File | Where-Object Name -ne '.gitkeep' | Select-Object -First 1
Measure-Command { .\.venv\Scripts\demucs.exe -o .\resultados\pistas $cancion.FullName }
```

Demucs guarda las pistas de voz, bajo, batería y resto. Pasa la pista de voz por Basic Pitch con `.\.venv\Scripts\basic-pitch.exe .\resultados <ruta-del-wav-de-voz>` y puntúala en la fila de esa canción.
