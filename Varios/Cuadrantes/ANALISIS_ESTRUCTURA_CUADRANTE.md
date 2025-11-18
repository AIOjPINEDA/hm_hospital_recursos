# Análisis de Estructura del Cuadrante de Guardias

## Fecha de Análisis
18 de Noviembre de 2025

## Archivos Analizados
- `11-2025 Final.xls` - Cuadrante de guardias de Noviembre 2025 (Excel antiguo)
- `11-2025 Final CSV.csv` - Mismo cuadrante exportado a CSV ✅ **RECOMENDADO**

---

## ESTRUCTURA GENERAL DEL ARCHIVO

### Dimensiones
- **Filas totales**: 30
- **Columnas totales**: 8 (A-H) + 4 columnas vacías en CSV
- **Formatos disponibles**: 
  - Excel antiguo (.xls) → Requiere `xlrd`
  - CSV → Más fácil de procesar ✅

### Organización Básica

#### **COLUMNA A - Leyendas y Mes**
- **Fila 0 (A1)**: Contiene el mes → `"Noviembre"`
- **Filas subsiguientes**: Alternan entre:
  - Filas vacías (para números de días)
  - Filas con tipo de jornada (M, Ref, T, N)

#### **COLUMNAS B-H - Días de la Semana**
- **Fila 0**: Encabezados de días
  - B: LUNES
  - C: MARTES
  - D: MIERCOLES
  - E: JUEVES
  - F: VIERNES
  - G: SABADO
  - H: DOMINGO

---

## PATRONES DE JORNADA IDENTIFICADOS

### 1. **Mañana (M)**
```
M (8-15 / 10-16)
```
- **Médico 1**: 8:00 - 15:00 (7 horas)
- **Médico 2**: 10:00 - 16:00 (6 horas)
- **Formato en celdas**: `"Medico1 / Medico2"`
- **Ejemplo**: `"Uribe / Soto"`

**EXCEPCIÓN**: Sábados, domingos y festivos
- Ambos médicos entran a las 09:00 en lugar de 8:00 y 10:00

### 2. **Refuerzo (Ref)**
```
Ref (9-15 / 15-21)
```

**Horarios variables según día:**

#### **Lunes**:
- **Médico 1**: 8:00 - 15:00 (7 horas)
- **Médico 2**: 15:00 - 22:00 (7 horas)

#### **Martes a Viernes**:
- **Médico 1**: 9:00 - 15:00 (6 horas)
- **Médico 2**: 15:00 - 21:00 (6 horas)

#### **Sábados y Domingos**:
- **Único turno**: 10:00 - 22:00 (12 horas)
- En las celdas aparece el mismo médico dos veces: `"Ramiro / Ramiro"`

### 3. **Tarde (T)**
```
T (15-22 / 16-22)
```
- **Médico 1**: 15:00 - 22:00 (7 horas)
- **Médico 2**: 16:00 - 22:00 (6 horas)
- **Formato en celdas**: `"Medico1 / Medico2"`
- **Ejemplo**: `"Farah / Santi"`

### 4. **Noche (N)**
```
N (22:00-8:00)
```

**Horarios variables según día:**

#### **Martes a Viernes**:
- **UN SOLO MÉDICO**: 22:00 - 08:00 (10 horas)
- En las celdas aparece solo un nombre: `"Rod"`

#### **Sábado, Domingo y Lunes**:
- **DOS MÉDICOS**: 22:00 - 08:00 (10 horas cada uno)
- **Formato en celdas**: `"Medico1 / Medico2"`
- **Ejemplo**: `"Santi / Ramiro"`

---

## ESTRUCTURA DE AGRUPACIÓN POR SEMANA

Cada semana completa ocupa **5 filas consecutivas**:

### **Fila 1 (Números de días)**
- Columna A: vacía
- Columnas B-H: números del 1-7, 8-14, 15-21, 22-30

### **Fila 2 (Mañana - M)**
- Columna A: `"M (8-15 / 10-16)"`
- Columnas B-H: nombres de médicos asignados

### **Fila 3 (Refuerzo - Ref)**
- Columna A: `"Ref (9-15 / 15-21)"`
- Columnas B-H: nombres de médicos asignados

### **Fila 4 (Tarde - T)**
- Columna A: `"T (15-22 / 16-22)"`
- Columnas B-H: nombres de médicos asignados

### **Fila 5 (Noche - N)**
- Columna A: `"N (22:00-8:00)"`
- Columnas B-H: nombres de médicos asignados

---

## ÍNDICES DE FILAS POR SEMANA

### **Semana 1** (Días: Vie 31 Oct, Sáb 1, Dom 2)
- Fila índice 1: Números de días
- Fila índice 2: M
- Fila índice 3: Ref
- Fila índice 4: T
- Fila índice 5: N

### **Semana 2** (Días: 3-9)
- Fila índice 6: Números de días
- Fila índice 7: M
- Fila índice 8: Ref
- Fila índice 9: T
- Fila índice 10: N

### **Semana 3** (Días: 10-16)
- Fila índice 11: Números de días
- Fila índice 12: M
- Fila índice 13: Ref
- Fila índice 14: T
- Fila índice 15: N

### **Semana 4** (Días: 17-23)
- Fila índice 16: Números de días
- Fila índice 17: M
- Fila índice 18: Ref
- Fila índice 19: T
- Fila índice 20: N

### **Semana 5** (Días: 24-30)
- Fila índice 21: Números de días
- Fila índice 22: M
- Fila índice 23: Ref
- Fila índice 24: T
- Fila índice 25: N (¡Sin leyenda en columna A!)

---

## NOTAS ACLARATORIAS (Filas 27-29)

**Ubicación**: Columna D (MIERCOLES), filas índice 27-29

### Nota 1 (Fila 27):
```
Refuerzo Lunes: 8-15 y 15-22 hs. Refuerzos de Martes a Viernes: 9-15 y 15-21 hs
```

### Nota 2 (Fila 28):
```
Refuerzos Sábados y Domingos: 10-22 hs
```

### Nota 3 (Fila 29):
```
Sáb, dom y fest: AMBOS turnos de mañana entran a las 09 hs.
```

---

## PECULIARIDADES DETECTADAS

### 1. **Días del Mes Anterior**
- La primera semana incluye: **Viernes 31 de Octubre** (columna F, fila índice 1)
- Valores en las celdas: `2025-10-31 00:00:00`, `1`, `2`
- **REGLA**: Solo procesar días >= 1 del mes en curso

### 2. **Fila 25 - Diferencia XLS vs CSV**
- **En XLS**: La fila índice 25 (última fila de guardias) **NO tiene leyenda en columna A**
- **En CSV**: La fila índice 25 **SÍ tiene la leyenda** `"N (22:00-8:00)"` ✅
- Los nombres de médicos SÍ aparecen en las columnas B-H en ambos formatos
- **INTERPRETACIÓN**: Es la jornada de Noche (N) de la última semana
- **RECOMENDACIÓN**: Usar CSV para evitar ambigüedades

### 3. **Formato de Nombres de Médicos**
Variaciones detectadas:
- Con espacios: `"Uribe / Soto"`
- Sin espacios: `"Sharon/DePablo"`
- Con espacios irregulares: `"María / Soto"`
- **REGLA**: Usar separador "/" para identificar dos médicos

### 4. **Médico Único vs Dos Médicos**
#### Un solo médico:
- Aparece solo el nombre: `"Rod"`, `"Soto"`, `"Uribe"`
- Típico en noches de martes a viernes

#### Dos médicos:
- Aparece con "/": `"Uribe / Soto"`
- Puede repetirse: `"Ramiro / Ramiro"` (indica turno único de larga duración)

### 5. **Formato de Fecha del Mes Anterior**
- **En XLS**: `2025-10-31 00:00:00` (formato datetime de Excel)
- **En CSV**: `31-Oct` (formato texto corto)
- Ambos formatos son parseables, CSV es más legible

---

## MÉDICOS IDENTIFICADOS EN EL CUADRANTE

Lista alfabética de nombres únicos encontrados:
1. Alexis
2. Coro
3. DePablo
4. Farah
5. Galazo
6. Harold
7. Luque
8. Luz
9. Marcelina ⭐ (nuevo en CSV)
10. María
11. Milena ⭐ (nuevo en CSV)
12. Pineda / PINEDA ⚠️ (inconsistencia mayúsculas)
13. Ramiro
14. Rod
15. Santi
16. Sharon
17. Siles
18. Soto
19. Uribe

**Total**: 19 médicos

### ⚠️ Inconsistencias de Formato Detectadas
- **PINEDA**: Aparece en MAYÚSCULAS en múltiples celdas (días 5, 6, 11, 12, 13, etc.)
- **Normalización requerida**: Convertir "PINEDA" → "Pineda" al procesar

---

## REGLAS DE EXTRACCIÓN DE DATOS

### **Regla 1: Identificación de Semanas**
```
Patrón: Cada 5 filas consecutivas = 1 semana
Inicio: Fila índice 1
Secuencia: [Números, M, Ref, T, N] x 5 semanas
```

### **Regla 2: Identificación del Día del Mes**
```
Buscar en filas índice: 1, 6, 11, 16, 21
Columnas B-H contienen números del día
Filtrar: Solo días >= 1 (excluir días del mes anterior)
```

### **Regla 3: Mapeo Día-Columna**
```
Columna B = Lunes
Columna C = Martes
Columna D = Miércoles
Columna E = Jueves
Columna F = Viernes
Columna G = Sábado
Columna H = Domingo
```

### **Regla 4: Horarios por Tipo de Jornada y Día**
```python
# Pseudocódigo
if jornada == "M":
    if dia in [Sábado, Domingo]:
        horarios = ["09:00-15:00", "09:00-16:00"]  # Ambos a las 9
    else:
        horarios = ["08:00-15:00", "10:00-16:00"]
        
elif jornada == "Ref":
    if dia == Lunes:
        horarios = ["08:00-15:00", "15:00-22:00"]
    elif dia in [Martes, Miércoles, Jueves, Viernes]:
        horarios = ["09:00-15:00", "15:00-21:00"]
    elif dia in [Sábado, Domingo]:
        horarios = ["10:00-22:00"]  # Turno único
        
elif jornada == "T":
    horarios = ["15:00-22:00", "16:00-22:00"]
    
elif jornada == "N":
    if dia in [Martes, Miércoles, Jueves, Viernes]:
        horarios = ["22:00-08:00"]  # Solo 1 médico
    elif dia in [Sábado, Domingo, Lunes]:
        horarios = ["22:00-08:00", "22:00-08:00"]  # 2 médicos
```

### **Regla 5: Parsing de Nombres de Médicos**
```python
def normalizar_nombre(nombre):
    """Normalizar formato de nombres (manejar mayúsculas inconsistentes)"""
    nombre = nombre.strip()
    # Convertir PINEDA → Pineda
    if nombre.isupper():
        return nombre.capitalize()
    return nombre

if "/" in celda:
    # Dos médicos
    medicos = celda.split("/")
    medico1 = normalizar_nombre(medicos[0])
    medico2 = normalizar_nombre(medicos[1])
    
    # Verificar si es turno único (mismo médico repetido)
    if medico1 == medico2:
        return [{"medico": medico1, "horario": horarios[0]}]
    else:
        return [
            {"medico": medico1, "horario": horarios[0]},
            {"medico": medico2, "horario": horarios[1]}
        ]
else:
    # Un solo médico
    return [{"medico": normalizar_nombre(celda), "horario": horarios[0]}]
```

### **Regla 6: Manejo de Anomalías**
```
- Fila 25 sin leyenda (solo en XLS) → Asumir jornada "N" 
- Fila 25 con leyenda (en CSV) → Procesar normalmente ✅
- Celdas vacías → Ignorar
- Fechas en formato datetime (XLS) → Extraer solo el día
- Fechas en formato "31-Oct" (CSV) → Parsear con regex o parser de fechas
- Nombres en MAYÚSCULAS → Normalizar con capitalize()
```

---

## ESQUEMA DE DATOS PROPUESTO

### Estructura JSON para cada turno:
```json
{
  "fecha": "2025-11-03",
  "dia_semana": "Lunes",
  "dia_mes": 3,
  "jornada": "M",
  "jornada_nombre": "Mañana",
  "turnos": [
    {
      "medico": "Uribe",
      "hora_entrada": "08:00",
      "hora_salida": "15:00",
      "duracion_horas": 7
    },
    {
      "medico": "Soto",
      "hora_entrada": "10:00",
      "hora_salida": "16:00",
      "duracion_horas": 6
    }
  ],
  "total_medicos": 2
}
```

---

## VALIDACIONES RECOMENDADAS

1. **Validar continuidad de fechas**: Todos los días del mes deben estar presentes
2. **Validar cobertura 24h**: Para cada día, los turnos deben cubrir 00:00-24:00
3. **Validar nombres**: Verificar que todos los nombres estén en la lista de médicos conocidos
4. **Validar solapamientos**: M termina a 15/16, T empieza a 15/16, N empieza a 22:00
5. **Validar festivos**: Aplicar regla de entrada a las 09:00 en días festivos

---

## PRÓXIMOS PASOS SUGERIDOS

1. Crear diccionario de festivos de España/Madrid para el año
2. Implementar parser que convierta el Excel a JSON estructurado
3. Crear validador de cuadrantes
4. Generar estadísticas por médico (total de horas, distribución de turnos)
5. Exportar a formato `.ics` para calendarios

---

## COMPARATIVA XLS vs CSV

| Aspecto | XLS | CSV | Recomendación |
|---------|-----|-----|---------------|
| **Facilidad de procesamiento** | ❌ Requiere xlrd | ✅ Nativo en pandas | **CSV** |
| **Fila 25 (leyenda)** | ❌ Sin leyenda | ✅ Con leyenda | **CSV** |
| **Formato fechas** | datetime complejo | Texto "31-Oct" | **CSV** (más simple) |
| **Nombres médicos** | Mixto | Mixto (igual) | Igual |
| **Estructura** | Idéntica | Idéntica | Igual |

✅ **RECOMENDACIÓN FINAL**: Usar CSV para procesamiento automático

---

## OBSERVACIONES FINALES

✅ **Estructura bien definida**: Patrón repetitivo de 5 filas por semana
✅ **Reglas claras**: Horarios diferenciados por día de la semana
✅ **Información completa**: Todos los turnos tienen médicos asignados
✅ **CSV preferible**: Más fácil de procesar y sin ambigüedades

⚠️ **Atención especial**:
- Fila 25 sin leyenda en XLS (corregido en CSV)
- Días del mes anterior en primera semana (filtrar)
- Nombres con mayúsculas inconsistentes (normalizar)
- Variaciones en espaciado de nombres (trim)
- Refuerzos tienen horarios muy variables según día
- 2 médicos nuevos en CSV vs análisis inicial (Marcelina, Milena)

🎯 **Objetivo**: Con estas reglas se puede automatizar completamente la extracción e interpretación del cuadrante
