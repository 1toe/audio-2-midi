# Reglas de trabajo

Trabaja en `dev` o en una rama de tarea que salga de `dev`. Mantén el plan de producto, los identificadores de historias `H1–H11` y los de tareas `Tn.m` como referencias del trabajo. El audio en modo pista aislada se procesa en el navegador. Si agregas una dependencia, anota su licencia en [registro-licencias.md](registro-licencias.md).

## Seguimiento y versión

1. Antes de editar, comprueba la rama y su SHA en GitHub. Lee el [registro de avances](docs/registro-avances.md) y ubica las historias y tareas afectadas en [backlog](backlog/).
2. Implementa un cambio acotado. En el backlog marca las tareas de código que realizaste y deja los checks pendientes hasta reunir evidencia. En el CSV usa `Por hacer`, `En curso`, `Implementada / por validar`, `Validada` o `Bloqueada`. Reserva la columna del commit para el SHA completo del cambio que implementa la historia.
3. Actualiza [CHANGELOG.md](CHANGELOG.md) para cambios que afecten la versión. Usa `Sin versionar` hasta fijar una versión SemVer. Al fijarla, alinea la versión web y la API, y registra el SHA completo, su permalink y la referencia de GitHub que apunta a él. Las referencias de versiones publicadas se conservan.
4. Tras subir el cambio, confirma que el SHA existe en GitHub y que la rama apunta a la revisión esperada. Añade una fila al registro con fecha de Chile, versión si aplica, alcance y pendientes. Si el SHA aún no existe al preparar los archivos, enlázalo en un commit posterior que actualice las referencias del registro, el backlog o el changelog. Ese commit queda cubierto por el historial de Git.
5. En el cierre indica rama, SHA corto con link al SHA completo y estado de validación. Las ramas de versión y los enlaces a commits permiten reproducir una revisión. El nombre de `dev` por sí solo identifica una rama móvil.

## Validación y entrega actual

- Para `v0.1.0`, el desarrollo de las fases 1 a 3 se adelantó y la aceptación se verifica con los [checks de calidad](docs/06-checks-y-calidad.md) al final. Usa los checks para decidir si una fase queda validada.
- Walter se encarga de la compilación, la prueba con audios y el despliegue a Vercel en esta entrega. Las instrucciones locales se mantienen para Windows con PowerShell y sin Docker. Documentación e interfaz en español.
