# Prompts para GitHub Copilot

Colección de prompts especializados para crear y optimizar plantillas médicas en el repositorio HM Hospital Recursos.

## 📁 Prompts Disponibles

### Creación de Templates
- `crear-template-subjetivo.prompt.md` - Genera plantillas sección Subjetiva (S)
- `crear-template-objetivo.prompt.md` - Genera plantillas sección Objetiva (O)
- `crear-template-analisis-plan.prompt.md` - Genera plantillas Análisis y Plan (A+P)
- `crear-template-resultados.prompt.md` - Genera plantillas interpretación Resultados (R)

### Optimización
- `optimizar-template-existente.prompt.md` - Mejora plantillas existentes según convenciones

## 🚀 Cómo Usar los Prompts

### En VS Code:
1. Abrir Copilot Chat
2. Hacer clic en el icono "Attach context" (📎)
3. Seleccionar "Prompt..." y elegir el prompt deseado
4. Seguir las instrucciones del prompt

### Requisitos:
- GitHub Copilot habilitado
- Prompt files activados en configuración VS Code
- Repositorio abierto en VS Code

## 🎯 Filosofía de los Prompts

### Consistencia
- Todos los prompts siguen las convenciones del repositorio
- Mantienen la filosofía de escritura concisa y eficiente
- Respetan la estructura YAML front-matter

### Especialización
- Cada prompt está optimizado para un tipo específico de plantilla
- Incluyen ejemplos y estructuras apropiadas
- Consideran el contexto médico de urgencias

### Calidad
- Generan contenido realista basado en casos típicos
- Aplican abreviaciones médicas estándar
- Mantienen terminología precisa en español

## 📋 Convenciones Aplicadas

### Nomenclatura:
- Archivos: `patologia-sufijo.md`
- Sufijos: `-sub`, `-obj`, `-plan`, `-res`
- Formato: kebab-case

### Contenido:
- **Subjetivo**: Ejemplos entre [corchetes], escritura concisa
- **Objetivo**: Texto fluido, exploración sistemática
- **Análisis-Plan**: Casos realistas, planes específicos
- **Resultados**: Interpretaciones estándar, terminología precisa

### Abreviaciones:
- Temporales: h, d, min
- Anatómicas: FID, EEII, EIC
- Médicas: FRCV, DM2, ROT, MAP

## 🔧 Configuración Requerida

Para usar estos prompts en VS Code:

```json
{
  "chat.promptFiles": true
}
```

## 📖 Ejemplos de Uso

### Crear Nueva Plantilla:
1. Usar prompt `crear-template-subjetivo.prompt.md`
2. Especificar patología (ej: "lumbalgia")
3. Copilot genera plantilla siguiendo convenciones
4. Revisar y ajustar según necesidades específicas

### Optimizar Plantilla Existente:
1. Usar prompt `optimizar-template-existente.prompt.md`
2. Especificar archivo a optimizar
3. Copilot aplica mejoras según estándares
4. Verificar cambios y confirmar optimizaciones

## 🎯 Beneficios

- **Eficiencia**: Generación rápida de plantillas consistentes
- **Calidad**: Adherencia automática a convenciones del repositorio
- **Consistencia**: Formato uniforme entre todas las plantillas
- **Especialización**: Contenido médico apropiado para urgencias

---
*Prompts diseñados para el Servicio de Urgencias - HM Montepríncipe*
