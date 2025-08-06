# HM Hospital Montepríncipe - Recursos Médicos

Repositorio de recursos profesionales para el Servicio de Urgencias del Hospital HM Montepríncipe, Madrid.

## 📁 Estructura del Repositorio

```
hm-hospital-recursos/
├── documentos-empleo/          # Contratos y documentación administrativa
├── recursos-clinicos/          # Protocolos y referencias clínicas
├── investigacion/              # Proyectos de investigación y literatura
└── plantillas-doctoris/       # Templates SOAP para sistema Doctoris
```

## 🎯 Plantillas Doctoris

Sistema de plantillas optimizadas para documentación clínica rápida y eficiente.

### Convención de Nombres
- **Sufijos estándar**: `-sub` (subjetivo), `-obj` (objetivo), `-plan` (análisis-plan), `-res` (resultados)
- **Formato**: `patologia-sufijo.md` (ej: `abdominal-sub.md`, `cardiaco-obj.md`)

### Patologías Cubiertas
- Dolor abdominal
- Dolor torácico  
- Cefalea
- Síndrome febril
- Disnea

### Uso Rápido
1. Seleccionar plantilla según sección SOAP
2. Copiar al sistema Doctoris
3. Modificar ejemplos entre [corchetes] según caso
4. Personalizar según hallazgos específicos

## 🔧 Estándares del Repositorio

- **Nombres**: kebab-case (palabras-separadas-por-guiones)
- **Idioma**: Español (contexto Madrid)
- **Formato**: Markdown + YAML front-matter
- **Abreviaciones**: Estándar médico español

## 📋 Guía para Colaboradores

### Crear Nueva Plantilla
1. Usar convención de nombres: `patologia-sufijo.md`
2. Incluir YAML front-matter con metadatos
3. Seguir filosofía de escritura concisa
4. Incluir ejemplos entre [corchetes] para subjetivo
5. Texto completo modificable para objetivo/plan

### Filosofía de Escritura
- **Concisión**: Eliminar palabras innecesarias
- **Claridad**: Mantener riqueza semántica
- **Practicidad**: Ejemplos realistas de urgencias
- **Eficiencia**: Abreviaciones médicas estándar

---
*Versión 1.0 - Enero 2025*  
*Servicio de Urgencias - HM Montepríncipe*
