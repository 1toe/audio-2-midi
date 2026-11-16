# Fase 0 · Prueba de concepto

Objetivo: correr Basic Pitch sobre los 10 tracks solos, escuchar cada MIDI y decidir la puerta 1. La lista de tareas está en `backlog/tareas-fase-0.md`.

Los comandos son para PowerShell en Windows. No se probaron en tu equipo: si alguno falla, el README de cada repositorio manda.

## 1. Reunir los audios

- 10 tracks solos en `audios/tracks-solos/`: 4 de piano, 3 de guitarra y 3 de voz.
- 10 canciones completas en `audios/canciones/`, de géneros distintos.
- Anota cada archivo en `puntajes.csv`, en la fila de su tipo.

Conviene que duren entre 1 y 4 minutos, y que al menos uno dure 4 minutos para medir el tiempo de proceso.

## 2. Instalar Basic Pitch

Revisa en el [README de Basic Pitch](https://github.com/spotify/basic-pitch) qué versiones de Python acepta y usa una de esas. El ejemplo usa la 3.11.

```powershell
cd fase-0
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install basic-pitch
```

## 3. Transcribir los tracks solos

Este bloque convierte cada track y muestra cuántos segundos tardó. El tiempo incluye la carga del modelo en cada vuelta.

```powershell
Get-ChildItem .\audios\tracks-solos -File | Where-Object Name -ne '.gitkeep' | ForEach-Object {
  $audio = $_
  $tiempo = Measure-Command { basic-pitch .\resultados $audio.FullName }
  "{0};{1:N0} s" -f $audio.Name, $tiempo.TotalSeconds
}
```

Los archivos .mid quedan en `resultados/`. Basic Pitch no sobrescribe: si repites la corrida, borra antes los .mid anteriores.

## 4. Escuchar y puntuar

Abre cada .mid con un reproductor MIDI o un programa de música, compáralo con el audio y anota en `puntajes.csv`:

- Duración del audio y tiempo de proceso, en segundos.
- Nota de 1 a 5: 1 no se reconoce, 3 se reconoce con errores evidentes, 5 se reconoce sin errores que molesten.
- Un comentario corto: qué falló, si falló algo.

## 5. Decidir la puerta 1

- Al menos 8 de 10 tracks solos con nota 4 o más.
- Un audio de 4 minutos procesado en menos de 2 minutos.

## 6. Recomendado: adelantar la fase 2

Separa 2 o 3 canciones con Demucs para medir cuánto tarda en tu equipo. Revisa la instalación en el [README de Demucs](https://github.com/adefossez/demucs); para leer MP3 suele pedir ffmpeg instalado.

```powershell
pip install demucs
$cancion = Get-ChildItem .\audios\canciones -File | Where-Object Name -ne '.gitkeep' | Select-Object -First 1
Measure-Command { demucs -o .\resultados\pistas $cancion.FullName }
```

Demucs deja una carpeta por canción con las pistas de voz, bajo, batería y resto. Pasa la pista de voz por Basic Pitch, igual que en el paso 3, y puntúala en la fila de esa canción.
