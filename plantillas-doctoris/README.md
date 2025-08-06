# Plantillas Doctoris - Guía Médica

Sistema de plantillas SOAP optimizadas para documentación clínica eficiente en urgencias.

## 📂 Estructura

```
plantillas-doctoris/
├── subjetivo/          # Plantillas sección S
├── objetivo/           # Plantillas sección O
├── analisis-plan/      # Plantillas sección A+P
├── resultados/         # Plantillas interpretación resultados
└── _meta/             # Documentación técnica
```

## 🎯 Convención de Nombres

| Sufijo | Sección | Ejemplo |
|--------|---------|---------|
| `-sub` | Subjetivo | `abdominal-sub.md` |
| `-obj` | Objetivo | `cardiaco-obj.md` |
| `-plan` | Análisis-Plan | `toracico-plan.md` |
| `-res` | Resultados | `analitica-res.md` |

## 📋 Plantillas Disponibles

### Subjetivo (S)
- `abdominal-sub.md` - Dolor abdominal
- `toracico-sub.md` - Dolor torácico
- `cefalea-sub.md` - Cefalea
- `febril-sub.md` - Síndrome febril
- `disnea-sub.md` - Disnea

### Objetivo (O)
- `abdominal-obj.md` - Exploración abdominal
- `cardiaco-obj.md` - Exploración cardiovascular
- `neurologico-obj.md` - Exploración neurológica
- `febril-obj.md` - Exploración síndrome febril
- `respiratorio-obj.md` - Exploración respiratoria
- `general-obj.md` - Exploración general

### Análisis-Plan (A+P)
- `abdominal-plan.md` - Plan dolor abdominal
- `toracico-plan.md` - Plan dolor torácico
- `cefalea-plan.md` - Plan cefalea
- `febril-plan.md` - Plan síndrome febril
- `disnea-plan.md` - Plan disnea

### Resultados (R)
- `analitica-res.md` - Analítica normal
- `ecg-res.md` - ECG normal
- `rxtorax-res.md` - RX tórax normal

## 🚀 Uso Práctico

### Plantillas Subjetivo
- **Ejemplos entre [corchetes]** - Modificar según caso
- **Múltiples opciones** - Separadas por "/"
- **Sin antecedentes** - Van en campos separados Doctoris

### Plantillas Objetivo
- **Texto completo** - Modificar manualmente
- **Sin constantes vitales** - Se integran automáticamente
- **Examen general + específico** - Según especialidad

### Plantillas Análisis-Plan
- **Casos realistas** - Ejemplos típicos urgencias
- **Planes específicos** - Dosis, vías, tiempos
- **Criterios claros** - Alta vs ingreso

## ⚡ Abreviaciones Estándar

| Abreviación | Significado |
|-------------|-------------|
| `h` | horas |
| `d` | días |
| `FID` | fosa ilíaca derecha |
| `EEII` | extremidades inferiores |
| `FRCV` | factores riesgo cardiovascular |
| `ROT` | reflejos osteotendinosos |
| `TVP` | trombosis venosa profunda |
| `MAP` | médico atención primaria |

## 📝 Flujo de Trabajo

1. **Seleccionar** plantilla apropiada
2. **Copiar** contenido a Doctoris
3. **Modificar** ejemplos según hallazgos
4. **Personalizar** según caso específico

---
*Para médicos del Servicio de Urgencias - HM Montepríncipe*
