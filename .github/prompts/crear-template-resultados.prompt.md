# Crear Template Resultados

Crea una nueva plantilla de resultados (-res) para interpretación de estudios complementarios siguiendo las convenciones del repositorio HM Hospital Recursos.

## Instrucciones

1. **Solicitar información**: Pregunta al usuario qué tipo de estudio quiere cubrir
2. **Estructura requerida**:
   - YAML front-matter con metadatos
   - Interpretación estándar del estudio normal
   - Terminología médica precisa

## Formato YAML Front-matter

```yaml
---
id: [estudio-res]
tipo: resultados
tags: [tipo-estudio, interpretacion, normal]
ultima_revision: [fecha-actual]
autor: dr_pineda
estado: activo
version: 1.0
---
```

## Estructura del Contenido

### Elementos obligatorios:
- Título descriptivo del estudio
- Interpretación sistemática y completa
- Conclusión clara del resultado
- Variables mínimas necesarias

### Elementos a considerar:
- Terminología médica estándar española
- Formato consistente para fácil modificación
- Interpretación que un médico de urgencias necesita

## Tipos de Estudios Comunes

### Laboratorio:
- Hemograma completo
- Bioquímica básica
- Gasometría arterial
- Marcadores cardíacos

### Imagen:
- Radiografía tórax
- Ecografía abdominal
- TAC craneal
- Ecocardiograma

### Otros:
- ECG
- Espirometría
- Análisis orina

## Filosofía de Escritura

- **Precisión**: Terminología médica exacta
- **Completitud**: Todos los parámetros relevantes
- **Claridad**: Interpretación directa
- **Consistencia**: Formato uniforme

## Estructura Base

```markdown
[Tipo de estudio] [especificaciones técnicas si aplican]:

[Interpretación sistemática de hallazgos normales]

[Conclusión clara del resultado]
```

## Ejemplos de Estructura

### Analítica:
```markdown
Hemograma: Hb X g/dl, Hto X%, leucocitos X (neutrófilos X%), plaquetas X.
Bioquímica: [parámetros con valores normales].
Todos los parámetros dentro de la normalidad.
```

### Imagen:
```markdown
[Tipo de imagen] [proyecciones]:
[Descripción sistemática de estructuras normales]
No se observan signos de patología [específica del estudio].
```

### ECG:
```markdown
ECG de 12 derivaciones:
Ritmo sinusal a X lpm. [Descripción sistemática]
ECG normal.
```

Genera la plantilla siguiendo exactamente estas convenciones y pregunta al usuario por el tipo de estudio específico que desea cubrir.
