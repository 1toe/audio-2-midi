# Reglas de trabajo

Trabaja en `dev` o en una rama de tarea que parta de `dev`. Cualquier cambio en `main` o en una referencia `release/*` requiere autorización explícita de Walter. Conserva las referencias de versiones ya fijadas.

Mantén los cambios acotados y usa los identificadores existentes de historias (`Hn`) y tareas (`Tn.m`). En modo pista aislada el audio se procesa en el navegador. Antes de agregar una dependencia directa, registra su versión y su licencia en [registro-licencias.md](registro-licencias.md).

## Flujo de cada cambio

1. **Antes de editar.** Comprueba en GitHub el SHA completo de la base y de la rama de trabajo. Crea cada rama de tarea desde el SHA verificado de `dev`. Al retomar, compara el último SHA registrado con el actual y revisa los commits intermedios. Lee el [registro de avances](docs/registro-avances.md), consulta el [backlog](backlog/) y ubica los ID del cambio. Incluye esos ID en el commit cuando correspondan.
2. **Al implementar.** Marca las tareas de código realizadas y actualiza la historia a `Implementada / por validar`. Usa también `Por hacer`, `En curso`, `Validada` o `Bloqueada` según corresponda. En [backlog.csv](backlog/backlog.csv) registra el SHA de implementación y, cuando exista, el enlace a la evidencia de aceptación.
3. **Al verificar en GitHub.** Confirma que la rama apunta al SHA esperado. Enlaza cada avance con el SHA completo de 40 caracteres y su enlace directo al commit. Una rama identifica dónde buscar y el SHA identifica qué revisión usar. El registro indica fecha de Chile, alcance, versión si aplica y pendientes. Si el SHA se conoce después de crear el commit, añádelo en un commit de seguimiento. Git conserva el historial de ese commit de seguimiento.
4. **Al versionar.** Mantén los cambios pendientes en `Sin versionar` del [changelog](CHANGELOG.md). Al fijar una versión SemVer, alinea la versión de la web y la API, verifica que el tag o la rama de versión resuelva al SHA aprobado y registra ese SHA completo en el changelog y el registro de avances. Un despliegue debe registrar el ambiente y el SHA exacto desplegado.
5. **Al cerrar.** Indica rama, SHA corto enlazado al commit completo, estado del backlog y validación pendiente. Marca `Validada` solo cuando exista evidencia de los [checks de calidad](docs/06-checks-y-calidad.md) para el SHA probado.

Usa `git cherry-pick -x <SHA>` si solo necesitas trasladar commits puntuales entre ramas. Revisa sus dependencias y si ya están en el destino. Registra el SHA completo original y el SHA resultante en el PR y en el registro de avances, incluso si hubo conflictos.

Usa la identidad de GitHub `1toe` para ramas, commits y PR en [`1toe/audio-a-midi`](https://github.com/1toe/audio-a-midi). Abre los PR de tarea hacia `dev`, conserva `Co-Authored-By: Shannon` en los commits y verifica la autoría en GitHub. Guarda cualquier promoción a `main` para el PR autorizado de entrega.

## Entrega actual

La implementación de las fases 1 a 3 de `v0.1.0` se adelantó y la aceptación se verifica en conjunto. Verifica la compilación y el flujo correspondiente al SHA que se despliega. Registra el resultado junto al ambiente y la URL. Las instrucciones locales usan Windows con PowerShell, sin Docker. Mantén la documentación y la interfaz en español.
