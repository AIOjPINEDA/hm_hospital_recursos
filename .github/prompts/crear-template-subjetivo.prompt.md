# Crear Template Subjetivo

Crea una nueva plantilla subjetiva (-sub) para una patología específica siguiendo las convenciones del repositorio HM Hospital Recursos.

## Instrucciones

1. **Solicitar información**: Pregunta al usuario qué patología quiere cubrir
2. **Estructura requerida**:
   - YAML front-matter con metadatos
   - Contenido optimizado con ejemplos entre [corchetes]
   - Escritura concisa sin palabras innecesarias

## Formato YAML Front-matter

```yaml
---
id: [patologia-sub]
tipo: subjetivo
tags: [tag1, tag2, urgencias]
ultima_revision: [fecha-actual]
autor: dr_pineda
estado: activo
version: 1.0
---
```

## Estructura del Contenido

### Elementos obligatorios:
- Descripción principal del síntoma/patología
- Características específicas (localización, intensidad, tipo)
- Síntomas asociados con ejemplos múltiples
- Factores desencadenantes y que alivian
- Evolución temporal

### Elementos a EVITAR:
- Antecedentes médicos, quirúrgicos o familiares
- Medicación habitual (van en campos separados en Doctoris)
- Palabras innecesarias como "Paciente que consulta por"

## Filosofía de Escritura

- **Concisión**: Eliminar palabras innecesarias
- **Ejemplos prácticos**: Entre [corchetes] con opciones separadas por "/"
- **Abreviaciones estándar**: h=horas, d=días, etc.
- **Casos realistas**: Basados en presentaciones típicas de urgencias

## Ejemplo de Estructura

```markdown
[Patología] [tiempo] evolución, [características específicas], intensidad [X/10].

Inicio [tipo_inicio]. [Detalles específicos de la patología].

Síntomas asociados: [lista con múltiples opciones]. [Síntomas que niega].

Desencadenantes: [factores típicos]
Alivio: [factores que mejoran]

Patrón: [evolución temporal específica]
```

Genera la plantilla siguiendo exactamente estas convenciones y pregunta al usuario por la patología específica que desea cubrir.
