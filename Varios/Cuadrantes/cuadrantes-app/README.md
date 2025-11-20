# 🏥 Dashboard de Guardias Médicas

Una aplicación web moderna para visualizar, analizar y gestionar cuadrantes de guardias médicas. Diseñada para ofrecer valor tanto a la dirección médica como a los facultativos individuales.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue)

## ✨ Características Principales

### 1. 📊 Dashboard de Equidad (Para Administradores)
Una herramienta potente para garantizar un reparto justo de la carga de trabajo.
- **Tabla Comparativa**: Visualiza a todos los médicos en una sola lista.
- **Métricas Clave**:
  - **Horas Reales**: Tiempo físico de presencia.
  - **Horas Computadas**: Cálculo ajustado (Real + 7h/Noche) para compensación.
  - **Noches y Fines de Semana**: Contadores específicos para detectar sobrecargas.
- **Heatmaps Visuales**: Barras de color integradas para identificar rápidamente desviaciones de la media.

### 2. 👨‍⚕️ Espacio Personal (Para Médicos)
Un área privada donde cada profesional puede entender su mes de un vistazo.
- **Gráficos de Distribución**: Visualiza qué porcentaje de tu tiempo dedicas a Mañanas, Tardes, Noches o Refuerzos.
- **Tarjeta "Horas Computadas"**: Muestra claramente el total de horas que te corresponden tras aplicar los factores de corrección por nocturnidad.
- **Agenda Visual**: Lista limpia de tus próximas guardias.

### 3. 📅 Calendario Interactivo Global
Una vista de calendario completa para coordinar a todo el equipo.
- **Vista Mensual**: Visualiza todos los turnos del mes en un calendario clásico.
- **Filtros Dinámicos**:
  - **Ver Todos**: Panorámica completa del servicio.
  - **Por Médico**: Filtra para ver solo los turnos de un compañero específico.
  - **Resaltar**: Mantén la vista global pero destaca visualmente los turnos de una persona.

### 4. 📲 Exportación Inteligente a Calendario
Lleva tu horario contigo. Genera un archivo `.ics` compatible con Google Calendar, Outlook e iOS.
- **Detalle Rico**:
  - **Título**: "Mañana 3 HM-Torrelodones" (Claro y conciso).
  - **Ubicación**: "Hospital Universitario HM Torrelodones..." (Geolocalizable).
  - **Compañeros**: La descripción incluye quién más está de guardia contigo ese día.
- **Lógica de Fechas**: Gestiona automáticamente el cruce de medianoche en turnos de noche.

---

## 🧠 Lógica de Negocio

El sistema implementa reglas complejas de gestión de turnos:

### Cálculo de Horas
- **Horas Reales**: Suma directa de la duración de cada turno.
- **Horas Computadas**: `Horas Reales + (Nº Noches * 7)`.
  - *Justificación*: Se añaden 7 horas por cada guardia nocturna en concepto de descanso post-guardia retribuido.

### Tipos de Turno
- **Mañana (M)**: 8-15h (L-V) | 9-15h (S-D).
- **Tarde (T)**: 15-22h.
- **Noche (N)**: 22-08h (Día siguiente).
- **Refuerzo (Ref)**: Horarios variables según día de la semana.

---

## 📝 Ejemplo de Formato .ICS

Al exportar tu calendario, obtendrás eventos con esta estructura estándar:

```text
BEGIN:VEVENT
SUMMARY:Noche 3 HM-Torrelodones
DTSTART:20251103T220000
DTEND:20251104T080000
LOCATION:Hospital Universitario HM Torrelodones, Avenida Castillo Olivares, Torrelodones
DESCRIPTION:Guardia de Noche (22:00-08:00).\nCompañeros: Dr. Ramiro.
END:VEVENT
```

---

## 🚀 Guía de Uso

1.  **Carga**: Arrastra tu archivo CSV (exportado del Excel de turnos) a la pantalla de inicio.
2.  **Navegación**:
    - **Visión Global**: Tabla de equidad y métricas comparativas.
    - **Calendario Global**: Vista mensual de todo el equipo.
    - **Mi Cuadrante**: Tu espacio personal con estadísticas y exportación.
3.  **Exportación**: En tu vista personal, pulsa el botón **"Descargar Calendario"** para obtener el archivo `.ics` e impórtalo en tu móvil.

---

## 🛠️ Stack Tecnológico

- **Core**: React 19 + TypeScript
- **Estilos**: Tailwind CSS v4 (Diseño "Glassmorphism")
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Lógica**: Motores personalizados de parsing (PapaParse) y generación de ICS.

---

## 🌐 Despliegue

Esta aplicación utiliza **GitHub Actions** para un despliegue continuo (CI/CD) en **GitHub Pages**.

**URL de Producción**: [https://aiojpineda.github.io/hm_hospital_recursos/](https://aiojpineda.github.io/hm_hospital_recursos/)

### ¿Cómo funciona?
El flujo de trabajo está definido en `.github/workflows/deploy-cuadrantes.yml`.
1.  Detecta cambios en la carpeta `Varios/Cuadrantes/cuadrantes-app`.
2.  Instala dependencias y construye el proyecto (`npm run build`).
3.  Sube los archivos estáticos a la rama `gh-pages`.
4.  GitHub sirve la web automáticamente.

---
Desarrollado para optimizar la gestión clínica en HM Hospitales.
