# Modos de operación del agente (Global vs Médico)

**Versión:** 2025-08-29

## Parámetro `mode`
- `mode="single_doctor"`: filtra por un médico usando `perfil_medico.json` (nombre y alias). Produce:
  - CSV: `plantilla_salida_eventos_medico.csv`
  - JSON resumen (totales por tipo de turno, noches y postguardias, horas del mes).
- `mode="all_doctors"`: procesa todas las celdas/personas del cuadrante. Produce:
  - CSV: `plantilla_salida_eventos_global.csv` (una fila por asignación)
  - Resumen por persona (pivot).

## Flujo común
1) Cargar `diccionario_turnos_hmmp.json` (horarios + reglas).  
2) Parsear cuadrante PDF/imagen → (fecha, código, persona).  
3) Determinar `familia_dia` por fecha.  
4) Calcular `hora_inicio` y `hora_fin` desde el diccionario + reglas especiales.  
5) Si `codigo` es noche (N1/N2/N), añadir `postguardia_horas` según diccionario.  
6) Si `mode="single_doctor"`, aplicar matching de `persona` usando alias y fuzzy-matching.  
7) Emitir salida (CSV + JSON de métricas) y registrar anomalías.

## Configuración mínima
- Diccionario: `diccionario_turnos_hmmp.json` (única fuente de horarios y reglas).  
- Perfil (solo para `single_doctor`): `perfil_medico.json` (datos del médico y filtros de calendario).  
- Plantillas de salida: `plantilla_salida_eventos_global.csv`, `plantilla_salida_eventos_medico.csv`.

## Notas
- No “hardcodear” horarios: siempre leer del diccionario.  
- Para cruce con Google Calendar, usar `calendar_ids` y `title_suffix_contains` del perfil.  
- En noches que cruzan mes, prorratear el tramo nocturno; la postguardia se computa en el día siguiente.

## Matching (valores por defecto)
- Normalizar acentos y comparar sin mayúsculas/minúsculas.  
- Permitir patrón «iniciales + primer apellido».  
- Umbral de similitud difusa: 0.88.
