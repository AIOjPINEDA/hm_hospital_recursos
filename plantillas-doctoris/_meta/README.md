# Plantillas Doctoris-Urgencias v1.0

## Descripción
Repositorio de plantillas clínicas para el Servicio de Urgencias del Hospital HM Montepríncipe, diseñadas para integración con el sistema Doctoris.

## Estructura

```
/plantillas-doctoris
├── 01_subjetivo/       # Plantillas para la sección Subjetiva (S)
├── 02_objetivo/        # Plantillas para la sección Objetiva (O)
├── 03_analisis-plan/   # Plantillas para Análisis y Plan (A+P)
├── 04_resultados/      # Plantillas para interpretación de resultados
└── _meta/              # Documentación y metadatos
```

## Formato de Plantillas

Cada plantilla sigue el formato:

```yaml
---
id: nombre-plantilla
tipo: subjetivo|objetivo|analisis-plan|resultados
tags: [tag1, tag2, tag3]
ultima_revision: YYYY-MM-DD
autor: dr_apellido
estado: activo
version: 1.0
---
## TÍTULO
Nombre descriptivo de la plantilla

## CONTENIDO
Texto de la plantilla. Para subjetivo usar [corchetes] con opciones; para resultados/otros se pueden usar {{VARIABLES}} puntuales si aportan utilidad.
```

## Uso

1. Seleccionar plantilla apropiada según sección SOAP
2. Copiar contenido al sistema Doctoris
3. **Plantillas de Objetivo**: Completas y descriptivas - modificar manualmente según hallazgos
4. **Plantillas de Subjetivo**: Contienen ejemplos típicos entre [corchetes] - modificar según caso específico
5. **Plantillas de Análisis-Plan**: Casos realistas con planes específicos; variables opcionales si aportan claridad
6. Personalizar según caso específico

## Notas Importantes

- **Constantes vitales**: No incluidas en plantillas de Objetivo (se integran automáticamente en Doctoris)
- **Plantillas de Objetivo**: Texto fluido sin subtítulos innecesarios, abreviaciones médicas estándar, examen físico completo optimizado
- **Plantillas de Subjetivo**: Ejemplos optimizados entre [corchetes], escritura concisa sin palabras innecesarias
- **Lenguaje médico eficiente**: Abreviaciones estándar (h=horas, d=días, FRCV=factores riesgo cardiovascular, FID=fosa ilíaca derecha, EEII=extremidades inferiores, ROT=reflejos osteotendinosos, etc.)
- **Sin antecedentes**: Eliminados (van en campos separados en Doctoris)
- **Ejemplos típicos**: Aceleran la escritura manteniendo riqueza semántica
- **Flexibilidad**: Todos los ejemplos pueden modificarse según el caso específico

## Versión
- **Versión actual:** 1.0
- **Fecha:** Enero 2025
- **Servicio:** Urgencias HM Montepríncipe
