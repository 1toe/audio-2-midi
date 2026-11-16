# Audio a MIDI

Aplicación web que convierte cualquier audio en un archivo MIDI que suena como teclado. Acepta una canción completa o un track ya aislado.

Plan al 15 de noviembre de 2026. Autor: Walter Cataldo.

## Ejecutar la versión 0.4.0

Usa la rama [`release/v0.4.0`](https://github.com/1toe/audio-a-midi/tree/release/v0.4.0) para reproducir esta versión. Usa `dev` para seguir desarrollando. Usa Node 22+, Python 3.11 y FFmpeg con `ffprobe` disponible en PATH. Desde la raíz, prepara el servidor:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.5.1 torchaudio==2.5.1
.\.venv\Scripts\python.exe -m pip install -r servidor/requirements.txt
.\.venv\Scripts\python.exe -m uvicorn servidor.main:app --no-access-log
```

En otra terminal, inicia la web y abre <http://localhost:5173>:

```powershell
cd web
npm ci
npm run dev
```

La pista aislada se procesa en el navegador. El modo canción envía el archivo al servidor para separar sus pistas, las devuelve al navegador para transcribirlas y elimina los archivos temporales. El límite por archivo es de 10 minutos y 128 MiB. El servidor usa un solo proceso con una cola en memoria. Para alojarlo fuera de tu equipo, configura acceso, TLS y almacenamiento temporal que se limpie también al reiniciar.

## Preparar la web para Vercel

1. Importa [`1toe/audio-a-midi`](https://github.com/1toe/audio-a-midi) en Vercel con la cuenta `1toe`. Selecciona `web` como directorio raíz y Node.js 22.x. [`web/vercel.json`](web/vercel.json) configura Vite, el comando de compilación y la salida `dist`.
2. Usa la rama de tarea o `dev` para una vista previa. La rama `main` recibe la promoción de producción tras aprobar la vista previa. Registra el ambiente, la URL y el SHA completo al verificarla.
3. Para habilitar **Canción completa**, configura `VITE_API_URL` en el ambiente de Vercel con la URL base HTTPS del servicio FastAPI y vuelve a desplegar. En el servidor, configura `FRONTEND_ORIGIN` con los orígenes HTTPS exactos de la web que usarán la API, separados por coma. FastAPI requiere un proceso persistente con FFmpeg para atender la cola. Si omites `VITE_API_URL`, la web ofrece conversión local de pistas aisladas.
4. Para añadir un dominio que administres en Cloudflare, agrégalo primero en Vercel y aplica los registros que indique el proyecto en Cloudflare con **DNS only**. Vercel mantiene el HTTPS y sirve los archivos estáticos. Consulta la [guía de dominios en Cloudflare](https://vercel.com/kb/guide/migrate-to-vercel-from-cloudflare).

En la vista previa, confirma que el Worker carga `model/model.json` y su archivo de pesos desde el sitio, que una pista aislada convierte y descarga un MIDI, y que el modo canción aparece deshabilitado si falta el servidor.

El sonido de piano se sintetiza en el navegador. La cuantización estima el tempo a partir de los comienzos de las notas y usa 120 BPM cuando hay poca información. La compatibilidad de audio depende de los códecs del navegador.

Para evaluar los MIDI con el set de prueba, sigue la [guía de fase 0](fase-0/README.md). Los cambios de la versión están en [CHANGELOG.md](CHANGELOG.md).

## Seguimiento del desarrollo

La [web de producción](https://audio-a-midi.vercel.app/) corresponde a `v0.4.0`, commit [`3d70e29c3b0f15feb80877f0d1ea44e6a6428b9e`](https://github.com/1toe/audio-a-midi/commit/3d70e29c3b0f15feb80877f0d1ea44e6a6428b9e). Consulta el [registro de avances](docs/registro-avances.md) para retomar desde un commit exacto, el [backlog](backlog/) para ver qué falta y las [reglas de trabajo](AGENTS.md) para registrar el próximo cambio.

## Qué hay en esta carpeta

| Ruta | Contenido |
| --- | --- |
| `docs/01-plan-de-producto.md` | Resumen, metas y alcance |
| `docs/02-arquitectura.md` | Flujo del sistema, stack y fuentes abiertas |
| `docs/03-historias-de-usuario.md` | 11 historias con criterios de aceptación |
| `docs/04-casos-de-uso.md` | 5 casos de uso con flujos principales y alternos |
| `docs/05-roadmap.md` | 4 fases y 3 puertas de decisión |
| `docs/06-checks-y-calidad.md` | Definición de terminado, set de prueba y métricas |
| `docs/07-riesgos.md` | Riesgos, mitigaciones y señales de alerta |
| `docs/08-decisiones-abiertas.md` | Decisiones pendientes y próximos pasos |
| `backlog/backlog.csv` | Estado y commit de implementación de las 11 historias |
| `backlog/tareas-fase-N.md` | Tareas técnicas de cada fase, con casillas |
| `fase-0/` | Carpeta de trabajo de la prueba de concepto |
| `registro-licencias.md` | Licencia de cada dependencia, con las que faltan confirmar |
| `AGENTS.md` y `CLAUDE.md` | Reglas compartidas y contexto para Claude Code |

## Estado

| Fase | Estado |
| --- | --- |
| 0 · Prueba de concepto | En curso: [conversión por lote](fase-0/README.md), evaluación pendiente |
| 1 · MVP en navegador | Implementado, validación con audio pendiente |
| 2 · Canción completa | Implementado, validación con audio pendiente |
| 3 · Pulido | Implementado, validación con audio pendiente |

Los diagramas de `docs/` están en Mermaid. GitHub los muestra directo; en VS Code se ven con una extensión de vista previa de Mermaid.
