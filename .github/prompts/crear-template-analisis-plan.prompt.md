# Crear Template Análisis-Plan

Crea una nueva plantilla de análisis y plan (-plan) para una patología específica siguiendo las convenciones del repositorio HM Hospital Recursos.

## Instrucciones

1. **Solicitar información**: Pregunta al usuario qué patología quiere cubrir
2. **Estructura requerida**:
   - YAML front-matter con metadatos
   - Caso clínico realista con ejemplo específico
   - Plan terapéutico concreto con dosis y vías

## Formato YAML Front-matter

```yaml
---
id: [patologia-plan]
tipo: analisis-plan
tags: [patologia, plan, urgencias]
ultima_revision: [fecha-actual]
autor: dr_pineda
estado: activo
version: 1.0
---
```

## Estructura del Contenido

### ANÁLISIS (obligatorio):
- Resumen clínico conciso con hallazgos clave
- Estratificación de riesgo (escalas validadas si aplica)
- Diagnósticos diferenciales ordenados por probabilidad

### PLAN (obligatorio):
- Estudios complementarios específicos
- Tratamiento farmacológico con dosis exactas y vías
- Medidas no farmacológicas
- Interconsultas necesarias
- Tiempo de reevaluación

### CRITERIOS (obligatorios):
- Criterios de alta específicos y prácticos
- Criterios de ingreso claros
- Educación al paciente (si aplica)

## Escalas Validadas Comunes

- **Cardiovascular**: TIMI, GRACE, Killip
- **Neurológico**: Glasgow, NIHSS, ABCD2
- **Infeccioso**: qSOFA, CURB-65, NEWS
- **Respiratorio**: NYHA, mMRC

## Filosofía de Escritura

- **Casos realistas**: Ejemplos típicos de urgencias
- **Planes específicos**: Dosis, vías, tiempos concretos
- **Criterios prácticos**: Aplicables en urgencias
- **Abreviaciones estándar**: Reconocidas en medicina española

## Estructura Base

```markdown
**ANÁLISIS:**
[Descripción clínica específica con hallazgos]. [Estratificación riesgo si aplica].

Diagnóstico diferencial: [principal], [secundarios ordenados por probabilidad].

**PLAN:**
Analítica: [estudios específicos].
Pruebas imagen: [si necesarias].
Tratamiento: [fármacos con dosis exactas].
[Medidas específicas de la patología].
Interconsulta [especialidad] [urgencia].
Reevaluación [tiempo] o si empeoramiento.

Criterios alta: [específicos y prácticos].
Criterios ingreso: [claros y aplicables].

[Educación paciente si aplica].
```

## Ejemplos de Tratamientos Específicos

### Cardiovascular:
- AAS 300mg VO, clopidogrel 600mg VO
- Enoxaparina 1mg/kg/12h SC

### Neurológico:
- Sumatriptán 6mg SC o 100mg VO
- Metamizol 2g IV

### Infeccioso:
- Amoxicilina-clavulánico 1g IV c/8h
- Paracetamol 1g IV c/8h

Genera la plantilla siguiendo exactamente estas convenciones y pregunta al usuario por la patología específica que desea cubrir.
