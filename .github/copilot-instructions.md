# HM Hospital Recursos - Copilot Instructions

## Descripción del Repositorio

Este repositorio contiene recursos médicos profesionales para el Servicio de Urgencias del Hospital HM Montepríncipe en Madrid, España. El proyecto se centra en plantillas SOAP optimizadas para documentación clínica eficiente usando el sistema Doctoris.

## Estructura del Proyecto

```
hm-hospital-recursos/
├── documentos-empleo/          # Documentación administrativa
├── recursos-clinicos/          # Protocolos y referencias clínicas
├── investigacion/              # Proyectos de investigación
└── plantillas-doctoris/       # Sistema principal de plantillas SOAP
    ├── subjetivo/              # Plantillas sección S
    ├── objetivo/               # Plantillas sección O
    ├── analisis-plan/          # Plantillas sección A+P
    └── resultados/             # Plantillas interpretación resultados
```

## Convenciones de Nomenclatura

### Archivos de Plantillas
- **Formato**: `patologia-sufijo.md`
- **Sufijos estándar**:
  - `-sub`: Subjetivo (S)
  - `-obj`: Objetivo (O)
  - `-plan`: Análisis y Plan (A+P)
  - `-res`: Resultados (R)
- **Ejemplos**: `abdominal-sub.md`, `cardiaco-obj.md`, `toracico-plan.md`

### Estructura de Directorios
- **Formato**: kebab-case (palabras-separadas-por-guiones)
- **Idioma**: Español
- **Ejemplos**: `plantillas-doctoris`, `analisis-plan`, `recursos-clinicos`

## Estándares de Contenido Médico

### Plantillas Subjetivo (-sub)
- Usar ejemplos entre [corchetes] para modificar según caso
- Múltiples opciones separadas por "/"
- Escritura concisa sin palabras innecesarias
- NO incluir antecedentes (van en campos separados en Doctoris)
- Abreviaciones médicas estándar: h=horas, d=días, FID=fosa ilíaca derecha

### Plantillas Objetivo (-obj)
- Texto completo descriptivo para modificar manualmente
- NO incluir constantes vitales (se integran automáticamente en Doctoris)
- Incluir examen físico general + específico por especialidad
- Seguir secuencia lógica: inspección → auscultación → palpación → signos específicos

### Plantillas Análisis-Plan (-plan)
- Casos clínicos realistas con ejemplos específicos
- Diagnósticos diferenciales ordenados por probabilidad
- Planes terapéuticos concretos con dosis y vías
- Criterios de alta/ingreso específicos y prácticos
- Incluir escalas validadas cuando aplique (TIMI, GRACE, qSOFA)

### Plantillas Resultados (-res)
- Interpretaciones estándar de estudios normales
- Terminología médica precisa
- Formato consistente para fácil modificación

## Abreviaciones Médicas Estándar

- `h` = horas, `d` = días, `min` = minutos
- `FID` = fosa ilíaca derecha, `EEII` = extremidades inferiores
- `FRCV` = factores riesgo cardiovascular, `DM2` = diabetes mellitus tipo 2
- `ROT` = reflejos osteotendinosos, `TVP` = trombosis venosa profunda
- `MAP` = médico atención primaria, `HSA` = hemorragia subaracnoidea
- `ITU` = infección tracto urinario, `TEP` = tromboembolismo pulmonar

## Filosofía de Escritura

1. **Concisión**: Eliminar palabras innecesarias manteniendo riqueza semántica
2. **Claridad**: Usar terminología médica precisa y reconocida
3. **Practicidad**: Ejemplos realistas basados en casos típicos de urgencias
4. **Eficiencia**: Optimizar para uso rápido en entorno clínico
5. **Consistencia**: Mantener formato uniforme entre todas las plantillas

## Contexto Clínico

- **Especialidad**: Medicina de Urgencias
- **Hospital**: HM Montepríncipe, Madrid
- **Sistema**: Doctoris (historia clínica electrónica)
- **Usuarios**: Médicos adjuntos y residentes de urgencias
- **Objetivo**: Reducir tiempo de documentación manteniendo calidad

## Patologías Cubiertas

Actualmente el repositorio cubre las 5 patologías más frecuentes en urgencias:
1. Dolor abdominal (apendicitis, cólico renal, gastroenteritis)
2. Dolor torácico (síndrome coronario agudo, dolor musculoesquelético)
3. Cefalea (migraña, cefalea tensional, causas secundarias)
4. Síndrome febril (neumonía, ITU, sepsis)
5. Disnea (insuficiencia cardíaca, TEP, asma)

## Instrucciones para Copilot

Cuando trabajes en este repositorio:
- Mantén siempre la filosofía de escritura concisa y eficiente
- Usa las convenciones de nomenclatura establecidas
- Respeta la estructura YAML front-matter en las plantillas
- Incluye ejemplos clínicos realistas para el contexto de urgencias español
- Prioriza la practicidad sobre la exhaustividad académica
- Usa abreviaciones médicas estándar reconocidas en España
