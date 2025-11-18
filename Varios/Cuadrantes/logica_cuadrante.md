# Especificación funcional del cuadrante de guardias (formato Excel)

Este documento define la **lógica completa** de interpretación de un cuadrante mensual de guardias médicos en formato Excel, con el objetivo de que otro agente pueda desarrollar **scripts automatizables** (por ejemplo en Python/R) para:

- Parsear el fichero.
- Reconstruir todas las jornadas por médico.
- Calcular horas, número de guardias, patrones de turnos, etc.

La especificación está pensada para un **formato estable mes a mes**, con variaciones únicamente en los días del calendario y los nombres de los médicos.

---

## 1. Estructura general del fichero

- El fichero representa **un único mes** de trabajo (por ejemplo, noviembre 2025).
- El cuadrante está organizado **en formato calendario**, de **lunes a domingo**, en columnas:

  - Columna **A**: metadatos / tipo de fila.
  - Columnas **B–H**: días de la semana, en orden:
    - B: LUNES  
    - C: MARTES  
    - D: MIÉRCOLES  
    - E: JUEVES  
    - F: VIERNES  
    - G: SÁBADO  
    - H: DOMINGO  

- Fila superior:
  - `A1`: texto del mes (p. ej. `"Noviembre"`).
  - `B1–H1`: nombres de días de la semana en mayúsculas.

> Nota: El **año** de referencia se puede obtener del nombre del fichero (p. ej. `11-2025 Final.xlsx`) o, si se usara, de alguna fecha con formato completo en la hoja.

---

## 2. Bloques de información por semana

A partir de las filas de encabezado y de leyenda, la hoja se organiza en **bloques semanales**.  
Cada bloque de semana tiene esta estructura lógica:

1. **Fila de días del mes**:
   - Columna A vacía.
   - Columnas B–H: número de día (1–31) o fecha (tipo fecha) correspondiente a cada día de la semana que cae en esa semana.

2. **Fila de jornada de Mañana (M)**:
   - Columna A: texto con formato `M (8-15 / 10-16)` u otra variante equivalente.
   - Columnas B–H: nombres de médicos para cada día del mes, en formato `"Medico1 / Medico2"` o vacío.

3. **Fila de jornada de Refuerzo (Ref)**:
   - Columna A: texto con formato `Ref (9-15 / 15-21)` (leyenda base).
   - Columnas B–H: nombres de médicos `"Medico1 / Medico2"` o vacío.

4. **Fila de jornada de Tarde (T)**:
   - Columna A: texto con formato `T (15-22 / 16-22)`.
   - Columnas B–H: nombres de médicos `"Medico1 / Medico2"` o vacío.

5. **Fila de jornada de Noche (N)**:
   - Columna A: texto con formato `N (22:00-8:00)`.
   - Columnas B–H: nombres de médicos `"Medico"` o `"Medico1 / Medico2"` (según el día de la semana) o vacío.

En la parte inferior de la hoja suelen existir **filas de notas aclaratorias** (p. ej. filas 28–30), donde:

- Columnas A–C: vacías.
- Columna D: texto con aclaraciones de horarios especiales.
- Resto: vacías.

---

## 3. Tipología de filas y reglas de detección

Para que el script pueda funcionar sin depender de índices de fila fijos, se recomienda detectar el tipo de fila en función de su contenido:

### 3.1. Fila de cabecera de días de la semana

- Condiciones:
  - `A` contiene el nombre del mes (texto).
  - `B–H` contienen exactamente los nombres de los días de la semana en mayúsculas.

### 3.2. Fila de días del mes

- Condiciones:
  - `A` vacía.
  - Al menos una celda en `B–H` contiene:
    - Un **entero** entre 1 y 31, o
    - Una **fecha** (objeto tipo fecha) correspondiente a un día del mes.
- Interpretación:
  - Cada celda `B–H` representa el **día del mes** que cae ese lunes, martes, etc.

### 3.3. Filas de leyenda de turnos (plantilla)

- Condiciones:
  - `A` contiene uno de estos patrones:
    - `M (`…`)`
    - `Ref (`…`)`
    - `T (`…`)`
    - `N (`…`)`
  - Todas las celdas `B–H` están vacías.
- Papel:
  - Son filas **plantilla** que solo definen el formato/horario de la jornada, sin asignación de médicos.

### 3.4. Filas de turnos reales

- Condiciones:
  - `A` contiene exactamente uno de los valores anteriores (M, Ref, T, N con su descripción horaria).
  - Al menos una celda en `B–H` contiene texto con nombres de médicos.
- Papel:
  - Son filas **operativas** que hay que usar para construir las jornadas por médico.

### 3.5. Filas de notas

- Condiciones:
  - `A–C` vacías.
  - `D` contiene una frase larga de aclaración (por ejemplo, sobre refuerzos y festivos).
- Papel:
  - Modulan la lógica de horarios (ver sección 5).

---

## 4. Tipos de jornada y horarios base

Cada tipo de jornada tiene una **definición base** en la columna A, que luego puede verse modificada por reglas especiales en función del día de la semana y festivos.

### 4.1. Jornada de mañana (M)

- Texto de referencia en `A`:  
  `M (8-15 / 10-16)`
- Horario base:
  - Médico 1: 08:00–15:00  
  - Médico 2: 10:00–16:00  

### 4.2. Jornada de refuerzo (Ref)

- Texto de referencia en `A`:  
  `Ref (9-15 / 15-21)`
- Horario base (Martes–Viernes, ver excepciones):
  - Médico 1: 09:00–15:00  
  - Médico 2: 15:00–21:00  

### 4.3. Jornada de tarde (T)

- Texto de referencia en `A`:  
  `T (15-22 / 16-22)`
- Horario base:
  - Médico 1: 15:00–22:00  
  - Médico 2: 16:00–22:00  

### 4.4. Jornada de noche (N)

- Texto de referencia en `A`:  
  `N (22:00-8:00)`
- Horario base:
  - Cada médico asignado (1 o 2) trabaja: **22:00–08:00**.

---

## 5. Reglas especiales por día de la semana y festivos

En las notas finales del cuadrante aparecen reglas que **modifican los horarios base**.

### 5.1. Refuerzos por día de la semana

Texto de las notas (equivalente a):

- `Refuerzo Lunes: 8-15 y 15-22 hs.`
- `Refuerzos de Martes a Viernes: 9-15 y 15-21 hs`
- `Refuerzos Sábados y Domingos: 10-22 hs`

Interpretación operativa:

1. **Lunes**:
   - Ref:
     - Médico 1: 08:00–15:00  
     - Médico 2: 15:00–22:00  

2. **Martes a Viernes**:
   - Ref (coincide con la leyenda base):
     - Médico 1: 09:00–15:00  
     - Médico 2: 15:00–21:00  

3. **Sábados y Domingos**:
   - Ref:
     - Ambos médicos realizan jornada completa 10:00–22:00.  
       (Para efectos del modelo: Médico 1 = 10:00–22:00, Médico 2 = 10:00–22:00).

### 5.2. Mañanas de sábados, domingos y festivos

Texto de la nota:

- `Sáb, dom y fest: AMBOS turnos de mañana entran a las 09 hs.`

Aplicado a la jornada de mañana `M (8-15 / 10-16)`:

- **Lunes–Viernes (no festivos)**:
  - Médico 1: 08:00–15:00  
  - Médico 2: 10:00–16:00  

- **Sábados, domingos y festivos**:
  - Médico 1: 09:00–15:00  
  - Médico 2: 09:00–16:00  

> Importante: la consideración de “festivo” no está marcada en la hoja.  
> Debe proporcionarse externamente (p. ej. tabla de festivos por año) y asociarse por fecha.

### 5.3. Noches: número de médicos según el día

Regla general:

- **Lunes, sábado y domingo**:
  - Noche con **dos médicos** (celda con `"Nombre1 / Nombre2"`).
  - Ambos: 22:00–08:00.

- **Martes, miércoles, jueves y viernes**:
  - Noche con **un solo médico** (celda `"Nombre"`).
  - Ese único médico: 22:00–08:00.

En el Excel esto se refleja porque:

- En las columnas B–H de la fila de Noche:
  - Lunes/Sábado/Domingo suelen tener `"Medico1 / Medico2"`.
  - Martes–Viernes suelen tener un único nombre.

---

## 6. Inclusión y exclusión de días del calendario

### 6.1. Determinación del mes objetivo

- El **mes objetivo** se obtiene de:
  - Texto en `A1` (nombre del mes), y
  - Nombre del fichero (p. ej. `11-2025 Final.xlsx` → mes 11, año 2025).

### 6.2. Días que deben considerarse

Regla general:

> Se deben considerar **todos los días del mes objetivo**, desde el día 1 hasta el último día del mes, ambos inclusive.

Es decir, para noviembre 2025:

- Días válidos: **1, 2, …, 30** (Noviembre no tiene 31).
- Cualquier día del **mes anterior** (p. ej. 31 de octubre) o del **mes siguiente** que aparezca por motivos de representación visual **NO** debe incluirse en los cálculos de guardias.

### 6.3. Cómo distinguir días del mes anterior/siguiente

Para cada celda de la fila de días:

- Si el valor es un **objeto fecha**:
  - Usar directamente sus atributos `day`, `month`, `year`.
- Si el valor es un **número entero**:
  - Interpretar el `day` con el **mes objetivo**.
  - Excepción: si se ha incluido un valor que se sabe corresponde al último día del mes anterior (ej. 31) alineado antes del día 1 del mes objetivo, debe tratarse como día del mes anterior y **excluirse** del análisis.

En la práctica:

- Día válido para análisis si:
  - `mes == mes_objetivo` y `1 <= día <= último_día_mes`.
- Día a ignorar si:
  - `mes != mes_objetivo`.

### 6.4. Días del mes sin turnos

Si un día del mes objetivo aparece en la fila de días pero:

- Alguna de las filas de M, Ref, T o N tiene la celda vacía para ese día:
  - Se interpreta como **ningún médico asignado** en esa jornada (0 turnos para ese tipo en esa fecha).
  - El día sigue siendo **contemplado** en el calendario general, simplemente sin guardias para esa combinación fecha–turno.

---

## 7. Parseo de nombres de médicos

Las celdas de las filas de turnos (M, Ref, T, N) contienen:

- Vacío → ningún médico asignado.
- Un solo nombre → `"Apellido"` o `"Nombre Apellido"`.
- Dos nombres → `"Medico1 / Medico2"`.

Reglas para el parser:

1. **Separador de médicos**:
   - Usar el carácter `'/'` como separador.
   - Puede haber espacios irregulares: `"Nombre1 / Nombre2"`, `"Nombre1/Nombre2"`, `"Nombre1/ Nombre2"`.
   - Después de separar, aplicar `.strip()` (eliminar espacios en blanco al inicio y final).

2. **Número de médicos**:
   - Si tras el split hay **1 fragmento no vacío** → 1 médico.
   - Si hay **2 fragmentos no vacíos** → 2 médicos.
   - No se espera más de 2 médicos por celda.

3. **Asignación a tramos horarios**:
   - Para M, Ref y T:
     - El **primer nombre** se asocia al **primer tramo** de la definición de la jornada.
     - El **segundo nombre** al **segundo tramo**.
   - Para N:
     - Si hay dos nombres, ambos comparten el mismo tramo horario 22:00–08:00.

---

## 8. Modelo de datos objetivo (sugerido)

Para los scripts de automatización, se recomienda normalizar la información a una tabla de **“turnos atómicos por médico”**, por ejemplo:

### 8.1. Tabla `turnos_medico`

Columnas sugeridas:

- `fecha` (date)  
- `dia_semana` (string o int, Lunes–Domingo)  
- `tipo_turno` (string: `"M"`, `"Ref"`, `"T"`, `"N"`)  
- `subturno` (int: `1` o `2` para M/Ref/T; `1` para N siempre, `2` solo en noches con dos médicos)  
- `medico` (string, nombre tal cual aparece en la celda, tras el strip)  
- `hora_inicio` (time)  
- `hora_fin` (time, considerando que N cruza medionoche, pero se puede mantener como 08:00 del día siguiente o manejarse como 08:00 con una marca de “overnight”)  
- `es_festivo` (bool, según calendario externo)  
- `es_fin_de_semana` (bool: sábado/domingo)  
- `es_mes_objetivo` (bool, para facilitar filtros; debería ser siempre `true` en el dataset final)  

La lógica de relleno de `hora_inicio` y `hora_fin` proviene de:

- Tipo de turno (`M`, `Ref`, `T`, `N`).
- Día de la semana (lunes–domingo).
- Condition `es_festivo`.
- Reglas de la sección 5.

---

## 9. Supuestos y decisiones implícitas

1. El formato del cuadrante se mantiene estable mes a mes:
   - Misma estructura de columnas (A–H).
   - Misma codificación de jornadas (M, Ref, T, N).
   - Misma lógica de notas para refuerzos y mañanas de fin de semana/festivos.

2. Los festivos **no** están marcados en la hoja:
   - Deben definirse externamente (por ejemplo, desde un calendario oficial) y enlazarse por fecha.

3. En caso de conflicto entre:
   - La leyenda base de la jornada (texto de columna A) y
   - Las notas aclaratorias (filas finales),
   - **Prevalecen las notas** (por ejemplo, refuerzos especiales de lunes, refuerzos de fin de semana, mañanas que pasan a las 09:00 en sábados/domingos/festivos).

4. Si en algún mes aparecen días del mes siguiente al final del calendario, se tratarán igual que el último día del mes anterior al inicio: **solo referencia visual**, no se incluyen en los cálculos.

---

## 10. TL;DR para el agente desarrollador

- El Excel es un **calendario mensual lunes–domingo** con bloques de 5 filas por semana: `[fila_dias] + [M] + [Ref] + [T] + [N]`.
- Columna A define el **tipo de fila** (vacía = días, M/Ref/T/N = jornada, notas al final).
- Se deben considerar **todos los días 1–último del mes objetivo**, excluyendo cualquier día del mes anterior o posterior.
- Cada celda de las filas de M/Ref/T/N contiene 0, 1 o 2 médicos (separador `/`).
- M, Ref y T tienen siempre hasta 2 médicos con **tramos horarios distintos**; N tiene 1 o 2 médicos con el mismo horario 22–08.
- Los horarios base se modifican según:
  - Día de la semana (lunes vs. martes–viernes vs. fin de semana).
  - Condición de festivo (para la mañana).
- El resultado recomendado es una tabla normalizada de **turnos unitarios por médico y fecha**, con `fecha`, `tipo_turno`, `subturno`, `medico`, `hora_inicio`, `hora_fin`, `es_festivo`, etc.

Con esta especificación, otro agente debería poder implementar de forma determinista los scripts de lectura, parseo y análisis del cuadrante de guardias.
