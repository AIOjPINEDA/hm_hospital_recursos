# Especificación de Interpretación de Cuadros de Turnos — HM Montepríncipe (Urgencias)

**Versión:** 2025-08-29  
**Ámbito:** Decodificar cuadros mensuales de turnos desde PDF/imagen a datos estructurados y cómputo de horas.  
**Archivos clave:** `diccionario_turnos_hmmp.json` (diccionario oficial de turnos).

---

## 1) Objetivo
Proveer reglas claras, deterministas y trazables para que un agente (humano o IA) convierta un cuadrante mensual en:
- Una **tabla de asignaciones** por fecha (persona, código de turno, horario real).
- Un **cómputo de horas** por persona y por tipo de turno, incluyendo **postguardia** de noches.

---

## 2) Entradas
1. **Cuadrante mensual** (PDF o imagen) con:
   - Filas de códigos: `M1`, `M2`, `RM`, `T1`, `T2`, `RT`, `N1-N2`, `CRP-RM`.
   - Columnas: días del mes (L…D).
   - Celdas: nombres de personas, `x` (vacante) o `0` (bloqueo).
2. **Leyenda de horarios** (en el propio PDF) que mapea familia de día → rango horario por código.
3. **Diccionario oficial** (`diccionario_turnos_hmmp.json`), con los horarios por familia de día y reglas especiales.

---

## 3) Familias de día
- **Lunes**
- **Martes–Jueves**
- **Viernes**
- **Finde–Festivo** (sábados, domingos y festivos del calendario laboral local)

> Un agente deberá calcular el día de la semana de cada fecha y, si procede, detectar si es festivo local para aplicar “Finde–Festivo”.

---

## 4) Decodificación de celdas
Para cada celda del cuadrante:
1. Determinar la **fecha** (a partir de la columna).
2. Identificar el **código de turno** (a partir de la fila): `M1`, `M2`, `RM`, `T1`, `T2`, `RT`, `N1`, `N2`, `CRP-RM`.
3. Leer el **valor** de la celda:
   - Si es un **nombre** → asignar a esa persona.
   - Si es **`x`** → marcar **vacante** (no computa horas).
   - Si es **`0`** → marcar **bloqueo/ausencia** (no computa horas).
4. Determinar la **familia de día** para esa fecha.
5. Buscar el **rango horario** en el **diccionario oficial** según código y familia de día.
   - `CRP-RM` hereda horario de `RM`.
   - `N1` y `N2` comparten la familia **Noche (N)**.
6. Aplicar **reglas especiales** (ver §6).
7. Emitir una fila normalizada en la salida (ver §7).

---

## 5) Horarios “base” por código (según diccionario)
El agente debe usar los horarios contenidos en `diccionario_turnos_hmmp.json`.  
**No** codificar horarios “a fuego” en el motor; **siempre** leer del diccionario para permitir cambios sin tocar código.

---

## 6) Reglas especiales
1. **Noches (N1/N2):**
   - Horario base: `22:00–08:00`.
   - **Viernes / Sábado / Víspera de festivo:** `22:00–09:00`.
   - **Postguardia:** añadir **+7:00 h** **por cada noche** al cómputo de horas trabajadas.
   - La postguardia se computa **íntegra el día posterior** a la noche (para totales por mes, prorratear si corta el mes).
2. **Finde–Festivo (mañanas):** las entradas de mañana comienzan **a las 09:00** según el diccionario.
3. **`CRP-RM`:** usa exactamente el **mismo horario** que `RM` (idéntico rango).
4. **Códigos `x` y `0`:** no generan horas.

---

## 7) Salida normalizada (tabla)
La salida recomendada es un CSV/Parquet con columnas:
- `fecha` (YYYY-MM-DD)
- `persona`
- `codigo_turno` (M1, M2, RM, T1, T2, RT, N1, N2, CRP-RM)
- `familia_dia` (Lunes / Martes-Jueves / Viernes / Finde-Festivo)
- `horario_nominal` (por ej. 08:00-15:00)
- `horario_real` (tras aplicar reglas especiales; por ejemplo, N viernes → 22:00-09:00)
- `horas_tramo` (número de horas del tramo)
- `postguardia_horas` (0 ó 7:00 para noches)
- `horas_totales` (= `horas_tramo` + `postguardia_horas`)
- `observaciones` (texto libre: “víspera de festivo”, “vacante”, etc.)

Se adjunta `plantilla_salida_eventos.csv` con el header recomendado.

---

## 8) Algoritmo de cómputo (resumen)
1. Para cada día y cada código de turno:
   - Si hay persona asignada → construir fila base.
   - Determinar familia de día y horario nominal desde el diccionario.
   - Ajustar horario real por reglas especiales (noches, finde/festivo).
   - Calcular `horas_tramo` por diferencia de horas (gestionar cambios de día si procede).
   - Si es noche → sumar `postguardia_horas` = 7:00.
2. Agregar por persona o por día/turno según necesidad.
3. Si el mes corta una noche (p. ej. 31→1), **prorratear** al mes correspondiente:
   - `horas_tramo` dentro del mes actual; la postguardia pertenece al día siguiente.

---

## 9) Validación y auditoría
- Validar que **todos los códigos** que aparecen en el cuadrante existen en el diccionario.
- Comprobar que **todas las personas** tienen string no vacío y caracteres válidos.
- Registrar **anomalías** (celdas con símbolos desconocidos, horarios incoherentes).
- Guardar un **log** con decisiones de reglas especiales aplicadas (noches largas, festivos).

---

## 10) Integración con Google Calendar (opcional)
Si existen eventos con sufijo “HM Monteprincipe”, se puede cruzar:
- Por **fecha** y **tramo horario** (tolerancia ±15 min).
- Priorizar como fuente de verdad el **cuadrante** cuando exista conflicto y use la leyenda vigente.

---

## 11) Evolución
- Cambios de horarios o reglas deben editarse **solo** en `diccionario_turnos_hmmp.json`.
- Mantener `version` y `fuente` dentro del JSON para traza histórica.

---

## 12) Ejemplo mínimo de fila resultante
```
2025-09-15, "Juan Pérez", N1, "Lunes", "22:00-08:00", "22:00-08:00", 10:00, 7:00, 17:00, ""
```

---

## 13) Glosario rápido
- **Postguardia:** horas de descanso/guardia añadidas al cómputo tras una noche (aquí, +7:00 h).
- **Familia de día:** categoría de calendario que determina el horario base de cada código.
- **Horario nominal:** el rango declarado en la leyenda/diccionario antes de aplicar excepciones.
- **Horario real:** el rango final tras aplicar reglas especiales.

---

## 14) Referencia
- `diccionario_turnos_hmmp.json` (este repositorio).

