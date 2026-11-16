# 08 · Decisiones abiertas y próximos pasos

## Decisiones de producto

Estas decisiones de producto siguen abiertas antes de la validación o el despliegue.

- [ ] ¿Es para uso personal o para abrirlo al público? Define el hosting, el costo y los términos de uso.
- [ ] En una canción completa, ¿qué importa más: la melodía de la voz o el acompañamiento?
- [ ] ¿Cuánto presupuesto mensual hay para el servidor de la fase 2?
- [ ] ¿Sirve el límite de 10 minutos por archivo?

## Definiciones por validar

Dos definiciones se agregaron al escribir las historias y falta tu visto bueno.

- [ ] En canción completa, cada pista elegida queda como una pista MIDI separada dentro del mismo archivo.
- [ ] La batería no se transcribe.

## Decisiones técnicas

- [x] Fase 1: Vite y TypeScript sin framework de interfaz.
- [x] Fase 1: piano sintetizado con Web Audio API, sin muestras externas.
- [ ] Fase 2: definir el alojamiento y presupuesto del servidor. La versión actual usa CPU.
- [x] Fase 3: estimar el tempo a partir de los inicios de nota, con 120 BPM cuando hay poca información.

Las tres decisiones implementadas corresponden a [`389145b`](https://github.com/walter-cataldo/audio-a-midi/commit/389145bf7903ec98728d9a2b2d4e2eda919ec012).

## Próximos pasos

1. Reunir los 20 audios y puntuar la fase 0.
2. Validar las fases 1 a 3 con los [checks de calidad](06-checks-y-calidad.md).
3. Registrar resultados y decisiones en el [registro de avances](registro-avances.md), indicando el commit probado.
