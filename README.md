# Audio a MIDI

Aplicación web que convierte cualquier audio en un archivo MIDI que suena como teclado. Acepta una canción completa o un track ya aislado.

Plan al 15 de noviembre de 2026. Autor: Walter Cataldo.

## Ejecutar la versión 0.1.0

Clona la rama `dev`. Usa Node 22+, Python 3.11 y FFmpeg con `ffprobe` disponible en PATH. Desde la raíz, prepara el servidor:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.5.1 torchaudio==2.5.1
.\.venv\Scripts\python.exe -m pip install -r servidor/requirements.txt
.\.venv\Scripts\python.exe -m uvicorn servidor.main:app --no-access-log
```

En otra terminal, inicia la web y abre <http://localhost:5173>:

```powershell
cd web
npm install
npm run dev
```

La pista aislada se procesa en el navegador. El modo canción envía el archivo al servidor para separar sus pistas, las devuelve al navegador para transcribirlas y elimina los archivos temporales. El límite por archivo es de 10 minutos y 128 MiB. El servidor usa un solo proceso con una cola en memoria. Para alojarlo fuera de tu equipo, configura acceso, TLS y almacenamiento temporal que se limpie también al reiniciar.

## Preparar la web para Vercel

Selecciona `web` como directorio raíz del proyecto. Para usar el modo canción completa, define `VITE_API_URL` con la URL HTTPS del servidor Python y configura `FRONTEND_ORIGIN` en ese servidor con el origen HTTPS de la web. El servidor necesita FFmpeg y un proceso que siga activo para atender la cola entre peticiones. La conversión de pistas aisladas funciona desde la web por sí sola.

El sonido de piano se sintetiza en el navegador. La cuantización estima el tempo a partir de los comienzos de las notas y usa 120 BPM cuando hay poca información. La compatibilidad de audio depende de los códecs del navegador.

Para evaluar los MIDI con el set de prueba, sigue la [guía de fase 0](fase-0/README.md). Los cambios de la versión están en [CHANGELOG.md](CHANGELOG.md).

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
| `backlog/backlog.csv` | Las 11 historias en formato de planilla, con estado |
| `backlog/tareas-fase-N.md` | Tareas técnicas de cada fase, con casillas |
| `fase-0/` | Carpeta de trabajo de la prueba de concepto |
| `registro-licencias.md` | Licencia de cada dependencia, con las que faltan confirmar |
| `CLAUDE.md` | Contexto del proyecto para trabajar con Claude Code |

## Estado

| Fase | Estado |
| --- | --- |
| 0 · Prueba de concepto | En curso: [conversión por lote](fase-0/README.md), evaluación pendiente |
| 1 · MVP en navegador | Implementado, validación con audio pendiente |
| 2 · Canción completa | Implementado, validación con audio pendiente |
| 3 · Pulido | Implementado, validación con audio pendiente |

Los diagramas de `docs/` están en Mermaid. GitHub los muestra directo; en VS Code se ven con una extensión de vista previa de Mermaid.
