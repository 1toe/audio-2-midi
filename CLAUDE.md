# Contexto del proyecto

Audio a MIDI: aplicación web que convierte un audio en un archivo MIDI con sonido de teclado. Dos modos de entrada: track solo (todo en el navegador) y canción completa (separación de pistas en un servidor).

## Dónde está cada cosa

- Plan de producto y alcance: `docs/01-plan-de-producto.md`
- Arquitectura y stack: `docs/02-arquitectura.md`
- Historias (H1 a H11) y criterios de aceptación: `docs/03-historias-de-usuario.md`
- Casos de uso (CU-01 a CU-05): `docs/04-casos-de-uso.md`
- Tareas por fase: `backlog/tareas-fase-N.md`

## Reglas de trabajo

- Se trabaja una fase a la vez. No se empieza una fase sin aprobar la puerta anterior (`docs/05-roadmap.md`).
- Cada cambio responde a una tarea de `backlog/` y a una historia. Si no calza con ninguna, se propone antes de programar.
- Una historia está terminada cuando cumple sus criterios de aceptación y la definición de terminado de `docs/06-checks-y-calidad.md`.
- Lo que está en la lista de fuera de la versión 1 no se construye.
- Antes de agregar una dependencia se revisa su licencia y se anota en `registro-licencias.md`.
- En modo track solo el audio nunca sale del navegador.
- Al terminar una tarea se marca su casilla y se actualiza el estado en `backlog/backlog.csv`.

## Entorno

- Windows con PowerShell (pwsh). Los comandos se escriben para pwsh, no para bash.
- Idioma del proyecto: español en documentación y textos de la interfaz.
