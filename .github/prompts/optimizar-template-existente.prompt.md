# Optimizar Template Existente

Optimiza una plantilla existente del repositorio HM Hospital Recursos siguiendo las convenciones y filosofía establecidas.

## Instrucciones

1. **Solicitar archivo**: Pregunta al usuario qué plantilla quiere optimizar
2. **Analizar contenido**: Revisar estructura, contenido y adherencia a convenciones
3. **Aplicar optimizaciones**: Según tipo de plantilla y estándares del repositorio

## Criterios de Optimización

### Para Plantillas Subjetivo (-sub):
- ✅ Eliminar palabras innecesarias
- ✅ Usar ejemplos entre [corchetes] con opciones múltiples
- ✅ Aplicar abreviaciones médicas estándar
- ✅ Remover antecedentes (van en campos separados)
- ✅ Mantener casos realistas de urgencias

### Para Plantillas Objetivo (-obj):
- ✅ Eliminar subtítulos innecesarios
- ✅ Crear texto fluido siguiendo secuencia lógica
- ✅ Remover constantes vitales
- ✅ Incluir examen general + específico
- ✅ Usar abreviaciones estándar (EEII, FID, ROT)

### Para Plantillas Análisis-Plan (-plan):
- ✅ Casos clínicos realistas con ejemplos específicos
- ✅ Planes con dosis exactas y vías de administración
- ✅ Criterios de alta/ingreso prácticos
- ✅ Incluir escalas validadas cuando aplique
- ✅ Diagnósticos diferenciales ordenados por probabilidad

### Para Plantillas Resultados (-res):
- ✅ Terminología médica precisa
- ✅ Interpretación sistemática completa
- ✅ Formato consistente
- ✅ Variables mínimas necesarias

## Aspectos Técnicos

### YAML Front-matter:
- ✅ ID correcto con formato `patologia-sufijo`
- ✅ Tipo apropiado (subjetivo/objetivo/analisis-plan/resultados)
- ✅ Tags relevantes incluyendo "urgencias"
- ✅ Metadatos completos y actualizados

### Convenciones de Nomenclatura:
- ✅ Archivos en formato kebab-case
- ✅ Sufijos estándar (-sub, -obj, -plan, -res)
- ✅ IDs consistentes con nombres de archivo

## Abreviaciones a Aplicar

### Temporales:
- horas → h
- días → d
- minutos → min

### Anatómicas:
- fosa ilíaca derecha → FID
- extremidades inferiores → EEII
- espacio intercostal → EIC

### Médicas:
- factores riesgo cardiovascular → FRCV
- diabetes mellitus tipo 2 → DM2
- reflejos osteotendinosos → ROT
- médico atención primaria → MAP

## Proceso de Optimización

1. **Análisis inicial**: Identificar tipo de plantilla y problemas actuales
2. **Aplicar convenciones**: Según tipo específico de plantilla
3. **Optimizar contenido**: Eliminar redundancias, mejorar ejemplos
4. **Verificar consistencia**: Con otras plantillas del repositorio
5. **Validar formato**: YAML front-matter y estructura markdown

## Criterios de Calidad

- **Concisión**: Máxima información con mínimas palabras
- **Claridad**: Terminología médica precisa
- **Practicidad**: Aplicable en entorno de urgencias real
- **Consistencia**: Coherente con resto del repositorio
- **Completitud**: Cubre aspectos esenciales de la patología

Solicita al usuario la plantilla específica que desea optimizar y aplica estas mejoras de forma sistemática.
