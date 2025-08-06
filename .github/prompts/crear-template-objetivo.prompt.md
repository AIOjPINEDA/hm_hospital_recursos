# Crear Template Objetivo

Crea una nueva plantilla objetiva (-obj) para exploración física específica siguiendo las convenciones del repositorio HM Hospital Recursos.

## Instrucciones

1. **Solicitar información**: Pregunta al usuario qué tipo de exploración física quiere cubrir
2. **Estructura requerida**:
   - YAML front-matter con metadatos
   - Texto completo descriptivo sin subtítulos innecesarios
   - Exploración sistemática y realista

## Formato YAML Front-matter

```yaml
---
id: [tipo-exploracion-obj]
tipo: objetivo
tags: [exploracion, especialidad, urgencias]
ultima_revision: [fecha-actual]
autor: dr_pineda
estado: activo
version: 1.0
---
```

## Estructura del Contenido

### Elementos obligatorios:
- Examen físico general estándar (consciente, orientado, mucosas, etc.)
- Exploración específica por aparatos/sistemas
- Secuencia lógica: inspección → auscultación → palpación → signos específicos
- Hallazgos típicos para la patología

### Elementos a EVITAR:
- Constantes vitales (se integran automáticamente en Doctoris)
- Subtítulos como "Exploración abdominal:", "Auscultación:"
- Variables dinámicas {{VARIABLE}}

## Filosofía de Escritura

- **Texto fluido**: Sin interrupciones de subtítulos
- **Secuencia lógica**: Seguir orden de exploración clínica
- **Abreviaciones estándar**: EEII, FID, ROT, etc.
- **Hallazgos específicos**: Típicos de la patología objetivo

## Estructura Base

```markdown
Consciente, orientado 3 esferas, tranquilo, colaborador. Buen estado general. Mucosas rosadas, húmedas, anictéricas. Bien hidratado y perfundido. Sin adenopatías palpables.

[Exploración específica por aparatos siguiendo secuencia lógica]

[Hallazgos típicos de la patología/sistema explorado]

[Exploración complementaria si es necesaria]
```

## Ejemplos de Secuencias

### Exploración Abdominal:
Inspección → Auscultación → Palpación → Signos específicos → Percusión

### Exploración Cardiológica:
Inspección cardiovascular → Palpación pulsos → Auscultación cardíaca → Exploración pulmonar

### Exploración Neurológica:
Glasgow → Funciones superiores → Pares craneales → Sistema motor → Reflejos → Sensibilidad

Genera la plantilla siguiendo exactamente estas convenciones y pregunta al usuario por el tipo de exploración específica que desea cubrir.
