# 🏥 Dashboard de Guardias Médicas

Una aplicación web moderna para visualizar y analizar cuadrantes de guardias médicas. Permite subir archivos CSV con la planificación mensual y genera automáticamente un dashboard interactivo con calendarios y estadísticas personalizadas.

![Status](https://img.shields.io/badge/Status-Functional-success)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue)

## ✨ Características Principales

- **📂 Carga de Archivos**: Soporte para arrastrar y soltar archivos CSV de cuadrantes.
- **🧠 Parser Inteligente**: Algoritmo capaz de interpretar la estructura compleja de turnos (Mañana, Tarde, Noche, Refuerzos) y sus variaciones por día de la semana.
- **📅 Visualización de Calendario**: Vista mensual clara con indicadores de colores por tipo de turno.
- **📊 Analítica en Tiempo Real**:
  - Cálculo automático de horas totales.
  - Conteo de guardias, noches y fines de semana.
- **👨‍⚕️ Filtro por Médico**: Visualización personalizada para cada profesional.
- **🎨 Diseño Premium**: Interfaz limpia con estilo "Glassmorphism", colores médicos modernos y modo oscuro (preparado).

## 🛠️ Stack Tecnológico

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) + Variables CSS nativas
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Procesamiento de Datos**: [PapaParse](https://www.papaparse.com/)

## 🚀 Guía de Inicio

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Instalación

1.  **Clonar el repositorio** (o descargar la carpeta):
    ```bash
    cd cuadrantes-app
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

4.  Abrir el navegador en `http://localhost:5173`.

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura limpia y modular:

```
src/
├── components/      # Componentes UI reutilizables (Card, StatCard)
├── logic/           # Lógica de negocio pura
│   └── parser.ts    # Motor de interpretación del CSV (El "Cerebro")
├── lib/             # Utilidades y helpers (cn, formatters)
├── styles/          # Sistema de diseño
│   └── variables.css # Paleta de colores y tokens de diseño
├── App.tsx          # Componente principal y orquestador
└── main.tsx         # Punto de entrada
```

## 🧠 Lógica del Cuadrante

El sistema se basa en reglas específicas definidas en `logica_cuadrante.md`. El parser (`src/logic/parser.ts`) maneja casos complejos como:

*   **Turnos de Mañana (M)**: 8-15h (L-V) vs 9-15h (Fines de semana).
*   **Refuerzos (Ref)**: Horarios variables según si es Lunes, Martes-Viernes o Fin de semana.
*   **Noches (N)**: Detección de 1 o 2 médicos según el día de la semana.
*   **Normalización**: Corrección automática de nombres (ej. "PINEDA" -> "Pineda").

## 📝 Uso

1.  Exporta tu cuadrante de Excel a **CSV**.
2.  Abre la aplicación.
3.  Arrastra el archivo CSV a la zona de carga.
4.  Selecciona tu nombre en el desplegable superior para ver tus estadísticas personales.

---
Desarrollado con ❤️ para optimizar la gestión de tiempo médico.
